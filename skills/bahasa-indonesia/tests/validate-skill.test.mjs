import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(skillRoot, "scripts", "validate-skill.mjs");

function validateCopy(mutate = () => {}) {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "bahasa-indonesia-validate-"));
  const copy = path.join(temporaryDirectory, "bahasa-indonesia");
  fs.cpSync(skillRoot, copy, { recursive: true, filter: (source) => !source.includes(`${path.sep}node_modules`) });
  try {
    mutate(copy);
    const result = spawnSync(process.execPath, [scriptPath, copy], { encoding: "utf8" });
    return { status: result.status, output: `${result.stdout}${result.stderr}` };
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

function replaceInFile(file, from, to) {
  const text = fs.readFileSync(file, "utf8");
  assert.ok(text.includes(from), `teks '${from}' tidak ditemukan di ${file}`);
  fs.writeFileSync(file, text.replace(from, to));
}

const strongReview = {
  schema_version: 1,
  subject: { kind: "profile", id: "medan" },
  date: "2026-10-01",
  skill_commit: "abc123",
  model: "uji",
  intensity: "sedang",
  case_ids: ["netral-bug-explanation"],
  reviewers: { count: 2, relationship: "penutur yang tumbuh di Medan" },
  scores: { kealamian: 4, partikel_morfologi: 4, pronomina_jarak_sosial: 5, konsistensi_wilayah: 4, kejelasan_teknis: 5, bebas_stereotip: 4 },
  recurring_failures: [],
  decision: "naik-status",
};

function writeReview(copy, name, review) {
  fs.writeFileSync(path.join(copy, "evals", "reviews", name), `${JSON.stringify(review, null, 2)}\n`);
}

test("salinan skill apa adanya lulus validasi", () => {
  const { status, output } = validateCopy();
  assert.equal(status, 0, output);
});

test("panduan bahasa yang tidak dirujuk registry ditolak", () => {
  const { status, output } = validateCopy((copy) => {
    fs.writeFileSync(path.join(copy, "references", "languages", "atlantis.md"), "# Atlantis\n\nKesiapan: beta.\n\n## Hindari\n\n- x\n\n## Sumber\n\n- y\n");
  });
  assert.equal(status, 1);
  assert.match(output, /tidak dirujuk oleh entri registry mana pun: references\/languages\/atlantis\.md/);
});

test("heading profil harus level dua dan persis", () => {
  const { status, output } = validateCopy((copy) => {
    replaceInFile(path.join(copy, "references", "profiles", "medan.md"), "## Kalibrasi", "### Kalibrasi");
  });
  assert.equal(status, 1);
  assert.match(output, /medan\.md tidak memiliki bagian '## Kalibrasi'/);
});

test("folder evals/outputs dan tautan di dalam code fence diabaikan", () => {
  const { status, output } = validateCopy((copy) => {
    const outputs = path.join(copy, "evals", "outputs", "model-x");
    fs.mkdirSync(outputs, { recursive: true });
    fs.writeFileSync(path.join(outputs, "netral-bug-explanation.md"), "Lihat [x](../../tidak-ada.md). // TODO rapikan\n");
    fs.appendFileSync(path.join(copy, "references", "core.md"), "\n```markdown\n[contoh](tidak-ada-di-fence.md)\n```\n\n[judul](core.md \"Aturan inti\")\n");
  });
  assert.equal(status, 0, output);
});

test("naik-status dengan skor rendah atau satu reviewer ditolak", () => {
  const { status, output } = validateCopy((copy) => {
    replaceInFile(path.join(copy, "references", "profiles", "medan.md"), "Kesiapan: beta.", "Kesiapan: stabil.");
    writeReview(copy, "2026-10-01-medan.json", {
      ...strongReview,
      intensity: "tipis",
      reviewers: { count: 1, relationship: "pembuat skill" },
      scores: { ...strongReview.scores, kealamian: 1 },
    });
  });
  assert.equal(status, 1);
  assert.match(output, /naik-status memerlukan minimal 2 reviewer/);
  assert.match(output, /skor minimal 4 pada semua dimensi; kurang pada kealamian/);
});

test("catatan turun-status yang lebih baru membatalkan naik-status", () => {
  const { status, output } = validateCopy((copy) => {
    replaceInFile(path.join(copy, "references", "profiles", "medan.md"), "Kesiapan: beta.", "Kesiapan: stabil.");
    writeReview(copy, "2026-10-01-medan.json", strongReview);
    writeReview(copy, "2026-10-05-medan.json", { ...strongReview, date: "2026-10-05", decision: "turun-status", reviewers: { count: 1, relationship: "penutur Medan" } });
  });
  assert.equal(status, 1);
  assert.match(output, /Profil medan berstatus stabil tanpa catatan review 'naik-status' yang masih berlaku/);
});

test("naik-status yang memenuhi syarat meloloskan status stabil", () => {
  const { status, output } = validateCopy((copy) => {
    replaceInFile(path.join(copy, "references", "profiles", "medan.md"), "Kesiapan: beta.", "Kesiapan: stabil.");
    writeReview(copy, "2026-10-01-medan.json", strongReview);
  });
  assert.equal(status, 0, output);
  assert.match(output, /1 catatan review/);
});
