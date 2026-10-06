#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultCasesPath = path.join(scriptDirectory, "..", "evals", "cases.json");
const outputExtensions = [".md", ".txt"];
const structuralTypes = new Set(["fence", "list", "quote", "table"]);

export function loadCases(casesPath = defaultCasesPath) {
  return JSON.parse(fs.readFileSync(casesPath, "utf8")).cases;
}

function normalizeNewlines(text) {
  return text.replace(/\r\n?/g, "\n");
}

function blockType(line) {
  if (/^\s*#{1,6}\s/.test(line)) return "heading";
  if (/^\s*(?:[-*+]|\d+[.)])\s/.test(line)) return "list";
  if (/^\s*>/.test(line)) return "quote";
  if (/^\s*\|/.test(line)) return "table";
  return "prose";
}

/** Memecah teks Markdown menjadi blok: heading, fence, list, quote, table, atau prose. */
export function splitBlocks(text) {
  const blocks = [];
  let current = null;
  let fenceMarker = "";

  const flush = () => {
    if (current && current.lines.length > 0) blocks.push({ type: current.type, text: current.lines.join("\n") });
    current = null;
  };

  for (const line of normalizeNewlines(text).split("\n")) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);

    if (current?.type === "fence") {
      current.lines.push(line);
      if (fenceMatch && fenceMatch[1][0] === fenceMarker[0] && fenceMatch[1].length >= fenceMarker.length) flush();
      continue;
    }
    if (fenceMatch) {
      flush();
      fenceMarker = fenceMatch[1];
      current = { type: "fence", lines: [line] };
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    if (!current) {
      const type = blockType(line);
      current = { type, lines: [line] };
      if (type === "heading") flush();
      continue;
    }
    current.lines.push(line);
  }
  flush();
  return blocks;
}

/**
 * Blok pembuka: heading awal dilewati, lalu blok pertama sampai paragraf prosa pertama,
 * ditambah satu blok struktural (code block, daftar, kutipan, tabel) yang langsung mengikutinya.
 */
export function leadText(output) {
  const blocks = splitBlocks(output);
  let index = 0;
  while (index < blocks.length && blocks[index].type === "heading") index += 1;

  const lead = [];
  while (index < blocks.length) {
    lead.push(blocks[index]);
    index += 1;
    if (lead.at(-1).type === "prose") break;
  }
  if (index < blocks.length && structuralTypes.has(blocks[index].type)) lead.push(blocks[index]);

  return lead.map((block) => block.text).join("\n\n");
}

/** Prosa tanpa fenced code block dan inline code; dipakai untuk forbid_patterns. */
export function stripCode(output) {
  return splitBlocks(output)
    .filter((block) => block.type !== "fence")
    .map((block) => block.text)
    .join("\n\n")
    .replace(/`[^`\n]*`/g, " ");
}

export function evaluateOutput(testCase, output) {
  const failures = [];
  const checks = testCase.checks ?? {};
  const raw = normalizeNewlines(output);
  const lowered = raw.toLocaleLowerCase("id");
  const lead = leadText(raw).toLocaleLowerCase("id");
  const prose = stripCode(raw);

  for (const value of checks.preserve ?? []) {
    if (!raw.includes(value)) failures.push(`Artefak terlindungi hilang atau berubah: ${value}`);
  }
  for (const value of checks.require ?? []) {
    if (!lowered.includes(value.toLocaleLowerCase("id"))) failures.push(`Substring wajib tidak ditemukan: ${value}`);
  }
  for (const value of checks.first_paragraph_require ?? []) {
    if (!lead.includes(value.toLocaleLowerCase("id"))) failures.push(`Blok pembuka tidak memuat: ${value}`);
  }
  for (const pattern of checks.forbid_patterns ?? []) {
    if (new RegExp(pattern, "iu").test(prose)) failures.push(`Pola terlarang ditemukan: /${pattern}/iu`);
  }

  return failures;
}

export function findOutputFile(directory, caseId) {
  const candidates = outputExtensions
    .map((extension) => path.join(directory, `${caseId}${extension}`))
    .filter((candidate) => fs.existsSync(candidate));
  return { path: candidates[0] ?? null, duplicates: candidates.slice(1) };
}

export function evaluateDirectory(cases, directory) {
  return cases.map((testCase) => {
    const found = findOutputFile(directory, testCase.id);
    const base = { id: testCase.id, failures: [], humanReview: testCase.human_review.length, duplicates: found.duplicates };
    if (!found.path) return { ...base, status: "missing" };
    const failures = evaluateOutput(testCase, fs.readFileSync(found.path, "utf8"));
    return { ...base, status: failures.length === 0 ? "pass" : "fail", failures };
  });
}

function usage() {
  console.error("Pemakaian:");
  console.error("  node scripts/evaluate-output.mjs <id-kasus> <file-keluaran>");
  console.error("  node scripts/evaluate-output.mjs --all <folder-keluaran> [--strict]");
  console.error("  node scripts/evaluate-output.mjs --list");
  process.exit(2);
}

function runSingle(caseId, outputPath) {
  const testCase = loadCases().find((candidate) => candidate.id === caseId);
  if (!testCase) {
    console.error(`Kasus tidak ditemukan: ${caseId}`);
    process.exit(2);
  }

  const resolvedPath = path.resolve(outputPath);
  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    console.error(`File keluaran tidak ditemukan: ${outputPath}`);
    process.exit(2);
  }

  const failures = evaluateOutput(testCase, fs.readFileSync(resolvedPath, "utf8"));
  if (failures.length > 0) {
    console.error(`Evaluasi ${caseId} gagal (${failures.length}):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Evaluasi otomatis ${caseId} lulus. Lanjutkan dengan ${testCase.human_review.length} kriteria review manusia.`);
}

function runBatch(directory, strict) {
  const resolvedDirectory = path.resolve(directory);
  if (!fs.existsSync(resolvedDirectory) || !fs.statSync(resolvedDirectory).isDirectory()) {
    console.error(`Folder keluaran tidak ditemukan: ${directory}`);
    process.exit(2);
  }

  const results = evaluateDirectory(loadCases(), resolvedDirectory);
  const counts = { pass: 0, fail: 0, missing: 0 };
  for (const result of results) {
    counts[result.status] += 1;
    const marker = { pass: "✔", fail: "✖", missing: "–" }[result.status];
    const note = result.status === "missing"
      ? "belum ada keluaran"
      : result.status === "pass"
        ? `lulus; ${result.humanReview} kriteria review manusia`
        : `gagal (${result.failures.length})`;
    console.log(`${marker} ${result.id}: ${note}`);
    for (const failure of result.failures) console.log(`    - ${failure}`);
    for (const duplicate of result.duplicates) {
      console.log(`    ! diabaikan: ${path.basename(duplicate)} (hanya satu file per kasus yang dinilai)`);
    }
  }

  console.log(`\nRingkasan: ${counts.pass} lulus, ${counts.fail} gagal, ${counts.missing} belum ada keluaran dari ${results.length} kasus.`);
  console.log("Keluaran yang lulus tetap memerlukan review manusia sesuai kriteria pada tiap kasus.");
  if (counts.fail > 0 || (strict && counts.missing > 0)) process.exit(1);
}

function runList() {
  for (const testCase of loadCases()) {
    console.log(`${testCase.id}\t${testCase.human_review.length} kriteria review manusia`);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  if (args.includes("--list")) return runList();

  const allIndex = args.indexOf("--all");
  if (allIndex >= 0) {
    const directory = args[allIndex + 1];
    if (!directory || directory.startsWith("--")) usage();
    return runBatch(directory, args.includes("--strict"));
  }

  const [caseId, outputPath] = args;
  if (!caseId || !outputPath) usage();
  return runSingle(caseId, outputPath);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
