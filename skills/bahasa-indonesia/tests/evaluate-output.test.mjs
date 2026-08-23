import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { evaluateOutput } from "../scripts/evaluate-output.mjs";

const baseCase = {
  checks: {
    preserve: ["API_TOKEN", "npm test -- config"],
    require: ["readConfig"],
    forbid_patterns: ["\\bgue\\b", "\\blo\\b"],
    first_paragraph_require: ["API_TOKEN"],
  },
};

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
  assert.ok(evaluateOutput(baseCase, output).some((failure) => failure.includes("Paragraf pertama")));
});

test("CLI mengevaluasi kasus dari cases.json", () => {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "bahasa-indonesia-eval-"));
  const outputPath = path.join(temporaryDirectory, "output.txt");
  const scriptPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "scripts", "evaluate-output.mjs");

  try {
    fs.writeFileSync(
      outputPath,
      "`readConfig` sekarang menjadi nama fungsi yang dipakai. `API_TOKEN` dan `.env` tidak berubah.\n\nJalankan `npm test -- config`.",
    );
    const result = spawnSync(process.execPath, [scriptPath, "targeted-identifier-edit", outputPath], {
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /lulus/);
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});
