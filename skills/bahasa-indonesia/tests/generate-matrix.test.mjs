import test from "node:test";
import assert from "node:assert/strict";

import { buildMatrix, leakPatterns, profiles, scenarios, intensities } from "../scripts/generate-matrix.mjs";
import { evaluateOutput } from "../scripts/evaluate-output.mjs";

test("matriks penuh mencakup netral dan semua profil × skenario × intensitas", () => {
  const { cases } = buildMatrix();
  const profileCount = Object.keys(profiles).length;
  const scenarioCount = Object.keys(scenarios).length;
  assert.equal(cases.length, scenarioCount + profileCount * scenarioCount * intensities.length);
  assert.equal(new Set(cases.map((testCase) => testCase.id)).size, cases.length);
  for (const testCase of cases) {
    assert.ok(testCase.prompt.trim());
    assert.ok(testCase.tags.includes("matrix"));
    assert.ok(testCase.human_review.length >= 2);
    for (const pattern of testCase.checks.forbid_patterns) new RegExp(pattern, "iu");
  }
});

test("kebocoran: profil tidak melarang penandanya sendiri atau bentuk bersama rumpunnya", () => {
  const surabaya = leakPatterns("surabaya");
  assert.ok(surabaya.includes("\\bje\\b"));
  assert.ok(surabaya.includes("\\batuh\\b"));
  assert.equal(surabaya.includes("\\brek\\b"), false);
  assert.equal(surabaya.includes("\\bwis\\b"), false);

  const kebumen = leakPatterns("kebumen");
  assert.equal(kebumen.includes("\\binyong\\b"), false);
  assert.ok(kebumen.includes("\\bkepriwe\\b"));

  const netral = leakPatterns("netral");
  assert.ok(netral.includes("\\brek\\b"));
  assert.ok(netral.includes("\\binyong\\b"));
  assert.ok(netral.includes("\\bnggih\\b"));
});

test("kasus yang dihasilkan dapat dievaluasi dan menangkap kebocoran serta klaim tes palsu", () => {
  const { cases } = buildMatrix({ profileIds: ["bandung"], scenarioIds: ["bug", "laporan"], intensityIds: ["sedang"] });
  const bug = cases.find((testCase) => testCase.id === "bandung--bug--sedang");
  const clean = "Yang error mah bukan query-nya: `loadConfig` di `src/config.ts:42` mengembalikan `undefined` karena `API_TOKEN` nggak ada di `.env`. Jalankan `npm test -- config` atuh. Error: TypeError: Cannot read properties of undefined (reading 'trim')";
  assert.deepEqual(evaluateOutput(bug, clean), []);
  assert.ok(evaluateOutput(bug, `${clean} Cek sek, rek.`).some((failure) => failure.includes("rek")));

  const laporan = cases.find((testCase) => testCase.id === "bandung--laporan--sedang");
  const honest = "Sudah diubah di `src/config.ts:42`: `loadConfig` kini membaca `process.env.API_TOKEN?.trim()`. Tes baru ada di `tests/config.test.ts`, tapi belum dijalankan.";
  assert.deepEqual(evaluateOutput(laporan, honest), []);
  assert.ok(evaluateOutput(laporan, `${honest} Tesnya lulus semua.`).some((failure) => failure.includes("lulus")));
});
