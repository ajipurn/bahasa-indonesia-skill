#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultCasesPath = path.join(scriptDirectory, "..", "evals", "cases.json");

export function loadCases(casesPath = defaultCasesPath) {
  return JSON.parse(fs.readFileSync(casesPath, "utf8")).cases;
}

export function evaluateOutput(testCase, output) {
  const failures = [];
  const checks = testCase.checks ?? {};
  const firstParagraph = output.trim().split(/\r?\n\s*\r?\n/, 1)[0] ?? "";

  for (const value of checks.preserve ?? []) {
    if (!output.includes(value)) failures.push(`Artefak terlindungi hilang atau berubah: ${value}`);
  }
  for (const value of checks.require ?? []) {
    if (!output.includes(value)) failures.push(`Substring wajib tidak ditemukan: ${value}`);
  }
  for (const value of checks.first_paragraph_require ?? []) {
    if (!firstParagraph.includes(value)) failures.push(`Paragraf pertama tidak memuat: ${value}`);
  }
  for (const pattern of checks.forbid_patterns ?? []) {
    if (new RegExp(pattern, "iu").test(output)) failures.push(`Pola terlarang ditemukan: /${pattern}/iu`);
  }

  return failures;
}

function runCli() {
  const [caseId, outputPath] = process.argv.slice(2);
  if (!caseId || !outputPath) {
    console.error("Pemakaian: node scripts/evaluate-output.mjs <id-kasus> <file-keluaran>");
    process.exit(2);
  }

  const testCase = loadCases().find((candidate) => candidate.id === caseId);
  if (!testCase) {
    console.error(`Kasus tidak ditemukan: ${caseId}`);
    process.exit(2);
  }

  const output = fs.readFileSync(path.resolve(outputPath), "utf8");
  const failures = evaluateOutput(testCase, output);
  if (failures.length > 0) {
    console.error(`Evaluasi ${caseId} gagal (${failures.length}):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Evaluasi otomatis ${caseId} lulus. Lanjutkan dengan ${testCase.human_review.length} kriteria review manusia.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
