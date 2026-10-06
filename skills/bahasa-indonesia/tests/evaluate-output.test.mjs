import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { evaluateOutput, leadText, stripCode } from "../scripts/evaluate-output.mjs";

const scriptPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "scripts", "evaluate-output.mjs");

const baseCase = {
  checks: {
    preserve: ["API_TOKEN", "npm test -- config"],
    require: ["readConfig"],
    forbid_patterns: ["\\bgue\\b", "\\blo\\b"],
    first_paragraph_require: ["API_TOKEN"],
  },
};

function withTemporaryDirectory(run) {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "bahasa-indonesia-eval-"));
  try {
    return run(temporaryDirectory);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

test("menerima keluaran yang memenuhi seluruh invarian", () => {
  const output = "`API_TOKEN` belum tersedia. Ubah pemanggilan menjadi `readConfig`.\n\nJalankan `npm test -- config`.";
  assert.deepEqual(evaluateOutput(baseCase, output), []);
});

test("mendeteksi artefak terlindungi yang hilang", () => {
  const output = "Konfigurasinya belum tersedia. Gunakan `readConfig`.\n\nJalankan tes konfigurasi.";
  assert.ok(evaluateOutput(baseCase, output).some((failure) => failure.includes("API_TOKEN")));
  assert.ok(evaluateOutput(baseCase, output).some((failure) => failure.includes("npm test -- config")));
});

test("mendeteksi pola terlarang tanpa mewajibkan slang tertentu", () => {
  const output = "API_TOKEN belum ada, lo. Gunakan readConfig lalu jalankan npm test -- config.";
  assert.ok(evaluateOutput(baseCase, output).some((failure) => failure.includes("Pola terlarang")));
});

test("mendeteksi informasi risiko yang terlambat", () => {
  const output = "Perubahan ini perlu perhatian.\n\nAPI_TOKEN akan dihapus; gunakan readConfig dan npm test -- config.";
  assert.ok(evaluateOutput(baseCase, output).some((failure) => failure.includes("Blok pembuka")));
});

test("blok pembuka melewati heading dan menyertakan code block atau daftar yang mengikutinya", () => {
  const withHeading = "## Diagnosis\n\n`API_TOKEN` hilang.\n\nDetail lain.";
  assert.equal(leadText(withHeading), "`API_TOKEN` hilang.");

  const withFence = "Perintah berikut menghapus cache:\n\n```bash\nrm -rf ./build-cache\n```\n\nPenjelasan lanjutan.";
  assert.match(leadText(withFence), /rm -rf \.\/build-cache/);
  assert.doesNotMatch(leadText(withFence), /Penjelasan lanjutan/);

  const withList = "Maksudnya yang mana?\n\n- loma/akrab\n- cohag/kasar pisan\n\nSaya tunggu.";
  assert.match(leadText(withList), /cohag/);

  const fenceFirst = "```text\nTypeError: x\n```\n\n`API_TOKEN` hilang.";
  assert.match(leadText(fenceFirst), /API_TOKEN/);

  const crlf = "## Judul\r\n\r\n`API_TOKEN` hilang.\r\n\r\nLain.";
  assert.equal(leadText(crlf), "`API_TOKEN` hilang.");
});

test("require dan first_paragraph_require tidak membedakan kapital, preserve tetap persis", () => {
  const testCase = { checks: { preserve: ["API_TOKEN"], require: ["loma", "cohag"], first_paragraph_require: ["loma"], forbid_patterns: [] } };
  assert.deepEqual(evaluateOutput(testCase, "Loma (akrab) atau Cohag (kasar pisan)? `API_TOKEN` tetap."), []);
  assert.ok(evaluateOutput(testCase, "Loma atau Cohag? `api_token` tetap.").some((failure) => failure.includes("API_TOKEN")));
});

test("forbid_patterns mengabaikan fenced code block dan inline code", () => {
  const testCase = { checks: { preserve: [], require: [], first_paragraph_require: [], forbid_patterns: ["\\blo\\b"] } };
  const output = "Interface `lo` adalah loopback.\n\n```bash\nifconfig lo\n```\n\nPenjelasan tanpa pronomina.";
  assert.deepEqual(evaluateOutput(testCase, output), []);
  assert.equal(stripCode(output).includes("ifconfig"), false);
  assert.ok(evaluateOutput(testCase, "Cek dulu lo.").length === 1);
});

test("CLI mengevaluasi kasus dari cases.json dan menolak file yang tidak ada", () => {
  withTemporaryDirectory((temporaryDirectory) => {
    const outputPath = path.join(temporaryDirectory, "output.txt");
    fs.writeFileSync(
      outputPath,
      "`readConfig` sekarang menjadi nama fungsi yang dipakai. `API_TOKEN` dan `.env` tidak berubah.\n\nJalankan `npm test -- config`.",
    );
    const result = spawnSync(process.execPath, [scriptPath, "targeted-identifier-edit", outputPath], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /lulus/);

    const missing = spawnSync(process.execPath, [scriptPath, "targeted-identifier-edit", path.join(temporaryDirectory, "tidak-ada.md")], { encoding: "utf8" });
    assert.equal(missing.status, 2);
    assert.match(missing.stderr, /File keluaran tidak ditemukan/);
  });
});

test("mode batch merangkum lulus, gagal, keluaran yang belum ada, dan file duplikat", () => {
  withTemporaryDirectory((temporaryDirectory) => {
    fs.writeFileSync(
      path.join(temporaryDirectory, "targeted-identifier-edit.md"),
      "`readConfig` sekarang menjadi nama fungsi yang dipakai. `API_TOKEN` dan `.env` tidak berubah.\n\nJalankan `npm test -- config`.",
    );
    fs.writeFileSync(path.join(temporaryDirectory, "targeted-identifier-edit.txt"), "");
    fs.writeFileSync(
      path.join(temporaryDirectory, "jakarta-pronoun-override.txt"),
      "`API_TOKEN` nggak kebaca, lu. Jalanin `npm test -- config`.",
    );

    const result = spawnSync(process.execPath, [scriptPath, "--all", temporaryDirectory], { encoding: "utf8" });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stdout, /✔ targeted-identifier-edit/);
    assert.match(result.stdout, /! diabaikan: targeted-identifier-edit\.txt/);
    assert.match(result.stdout, /✖ jakarta-pronoun-override/);
    assert.match(result.stdout, /Ringkasan: 1 lulus, 1 gagal/);
    assert.match(result.stdout, /belum ada keluaran/);

    fs.rmSync(path.join(temporaryDirectory, "jakarta-pronoun-override.txt"));
    const lenient = spawnSync(process.execPath, [scriptPath, "--all", temporaryDirectory], { encoding: "utf8" });
    assert.equal(lenient.status, 0, lenient.stdout);
    const strict = spawnSync(process.execPath, [scriptPath, "--all", temporaryDirectory, "--strict"], { encoding: "utf8" });
    assert.equal(strict.status, 1, strict.stdout);
  });
});

test("--list mencetak setiap ID kasus", () => {
  const result = spawnSync(process.execPath, [scriptPath, "--list"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^netral-bug-explanation\t/m);
  assert.match(result.stdout, /^melayu-manado-first-person\t/m);
});

test("early_require memeriksa tiga blok pertama tanpa heading", async () => {
  const { earlyText } = await import("../scripts/evaluate-output.mjs");
  const output = "## Diagnosis\n\n`API_TOKEN` hilang.\n\nLangkahnya begini.\n\nSoal bahasa Abui: belum ada panduan.\n\nParagraf keempat menyebut Dayak.";
  assert.match(earlyText(output), /Abui/);
  assert.doesNotMatch(earlyText(output), /Dayak/);

  const testCase = { checks: { preserve: [], require: [], first_paragraph_require: [], forbid_patterns: [], early_require: ["Abui", "Dayak"] } };
  const failures = evaluateOutput(testCase, output);
  assert.equal(failures.length, 1);
  assert.match(failures[0], /Tiga blok pertama tidak memuat: Dayak/);
});
