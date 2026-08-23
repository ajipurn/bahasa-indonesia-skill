#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(process.argv[2] ?? path.join(scriptDirectory, ".."));
const errors = [];

function read(relativePath) {
  const absolutePath = path.join(skillRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`File wajib tidak ditemukan: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function frontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"));
  if (!match) return "";
  return match[1].trim().replace(/^(["'])(.*)\1$/, "$2");
}

const skillText = read("SKILL.md");
const frontmatterMatch = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

if (!frontmatterMatch) {
  errors.push("SKILL.md tidak memiliki frontmatter YAML yang lengkap.");
} else {
  const name = frontmatterValue(frontmatterMatch[1], "name");
  const description = frontmatterValue(frontmatterMatch[1], "description");
  const allowedFrontmatterKeys = new Set(["name", "description", "license", "allowed-tools", "metadata"]);
  const frontmatterKeys = [...frontmatterMatch[1].matchAll(/^([A-Za-z0-9_-]+):/gm)].map((match) => match[1]);

  for (const key of frontmatterKeys) {
    if (!allowedFrontmatterKeys.has(key)) errors.push(`Properti frontmatter tidak dikenal: ${key}`);
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    errors.push(`Nama skill tidak valid: ${name || "<kosong>"}`);
  }
  if (name !== path.basename(skillRoot)) {
    errors.push(`Nama skill '${name}' tidak sama dengan folder '${path.basename(skillRoot)}'.`);
  }
  if (description.length < 1 || description.length > 1024) {
    errors.push(`Panjang description harus 1–1024 karakter; ditemukan ${description.length}.`);
  }
  if (/[<>]/.test(description)) {
    errors.push("Description tidak boleh memuat tanda kurung sudut.");
  }
}

for (const requiredReference of [
  "references/core.md",
  "references/configuration.md",
  "references/language-selection.md",
  "references/regional.md",
  "references/poetic.md",
  "references/evaluation.md",
]) {
  if (!skillText.includes(`](${requiredReference})`)) {
    errors.push(`SKILL.md tidak merutekan referensi wajib: ${requiredReference}`);
  }
}

if (skillText.includes("references/profiles/")) {
  errors.push("SKILL.md memuat profil secara langsung; profil harus dirutekan melalui references/regional.md.");
}

const markdownFiles = walk(skillRoot).filter((file) => file.endsWith(".md"));
for (const file of markdownFiles) {
  const text = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(skillRoot, file);
  const fenceCount = text.split(/\r?\n/).filter((line) => /^\s*(```|~~~)/.test(line)).length;
  if (fenceCount % 2 !== 0) errors.push(`Fence Markdown tidak seimbang: ${relativeFile}`);

  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim();
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    target = target.split("#", 1)[0];
    const resolvedTarget = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolvedTarget)) {
      errors.push(`Tautan lokal rusak: ${relativeFile} -> ${match[1]}`);
    }
  }

  if (/\b(?:TODO|TBD|FIXME|PLACEHOLDER)\b/.test(text)) {
    errors.push(`Placeholder belum selesai: ${relativeFile}`);
  }
}

const regionalText = read("references/regional.md");
const profileDirectory = path.join(skillRoot, "references", "profiles");
const profileFiles = fs.readdirSync(profileDirectory).filter((file) => file.endsWith(".md")).sort();
for (const profileFile of profileFiles) {
  const profileText = fs.readFileSync(path.join(profileDirectory, profileFile), "utf8");
  if (!regionalText.includes(`profiles/${profileFile}`)) {
    errors.push(`Profil tidak dirutekan oleh regional.md: ${profileFile}`);
  }
  if (!/^Kesiapan: (?:beta|eksperimental|stabil)\./m.test(profileText)) {
    errors.push(`Status kesiapan profil tidak valid atau hilang: ${profileFile}`);
  }
  for (const heading of ["Suara yang dituju", "Hindari", "Kalibrasi", "Sumber"]) {
    if (!profileText.includes(`## ${heading}`)) {
      errors.push(`Profil ${profileFile} tidak memiliki bagian '${heading}'.`);
    }
  }
}

const languageGuideDirectory = path.join(skillRoot, "references", "languages");
const languageGuideFiles = fs.readdirSync(languageGuideDirectory).filter((file) => file.endsWith(".md")).sort();
for (const guideFile of languageGuideFiles) {
  const guideText = fs.readFileSync(path.join(languageGuideDirectory, guideFile), "utf8");
  if (!/^Kesiapan: beta\./m.test(guideText)) {
    errors.push(`Panduan bahasa populer tidak berstatus beta: ${guideFile}`);
  }
  for (const heading of ["Hindari", "Sumber"]) {
    if (!guideText.includes(`## ${heading}`)) {
      errors.push(`Panduan ${guideFile} tidak memiliki bagian '${heading}'.`);
    }
  }
}

let languageRegistry;
let betaLanguageCount = 0;
try {
  languageRegistry = JSON.parse(read("references/languages.json"));
} catch (error) {
  errors.push(`references/languages.json bukan JSON valid: ${error.message}`);
}

if (languageRegistry) {
  const languages = languageRegistry.languages;
  if (languageRegistry.schema_version !== 1 || !Array.isArray(languages)) {
    errors.push("references/languages.json harus memakai schema_version 1 dan array languages.");
  } else {
    if (languageRegistry.language_count !== 718 || languages.length !== 718) {
      errors.push(`Registry bahasa harus berisi 718 entri; ditemukan ${languages.length}.`);
    }

    const ids = new Set();
    const sourceIds = new Set();
    const expectedBetaLanguages = new Map([
      ["aceh", "references/languages/sumatra.md"],
      ["bali", "references/languages/java-bali-nusa-tenggara.md"],
      ["banjar", "references/languages/kalimantan.md"],
      ["bima-mbojo", "references/languages/java-bali-nusa-tenggara.md"],
      ["bugis", "references/languages/sulawesi.md"],
      ["dayak-ngaju", "references/languages/kalimantan.md"],
      ["jawa", "references/javanese.md"],
      ["lampung", "references/languages/sumatra.md"],
      ["madura", "references/languages/java-bali-nusa-tenggara.md"],
      ["makassar", "references/languages/sulawesi.md"],
      ["minangkabau", "references/languages/sumatra.md"],
      ["sasak", "references/languages/java-bali-nusa-tenggara.md"],
      ["sunda", "references/sundanese.md"],
      ["toraja", "references/languages/sulawesi.md"],
    ]);
    const actualBetaLanguages = new Set();
    for (const [position, language] of languages.entries()) {
      if (language.index !== position + 1) {
        errors.push(`Urutan registry tidak berlanjut pada posisi ${position + 1}.`);
      }
      if (!language.id || ids.has(language.id)) errors.push(`ID bahasa kosong atau duplikat: ${language.id}`);
      ids.add(language.id);
      if (!Number.isInteger(language.source_id) || sourceIds.has(language.source_id)) {
        errors.push(`source_id bahasa tidak valid atau duplikat: ${language.source_id}`);
      }
      sourceIds.add(language.source_id);
      if (!language.name || !Array.isArray(language.aliases) || !Array.isArray(language.macroregions) || !Array.isArray(language.provinces)) {
        errors.push(`Metadata registry tidak lengkap: ${language.id || position + 1}`);
      }
      if (!["catalogued", "beta", "validated"].includes(language.support?.status)) {
        errors.push(`Status kemampuan bahasa tidak valid: ${language.id}`);
      }
      if (language.support?.status === "beta") actualBetaLanguages.add(language.id);
      if (expectedBetaLanguages.has(language.id) && language.support?.reference !== expectedBetaLanguages.get(language.id)) {
        errors.push(`Referensi beta tidak sesuai untuk ${language.id}: ${language.support?.reference || "<kosong>"}`);
      }
      if (language.support?.reference) {
        const referencePath = path.join(skillRoot, language.support.reference);
        if (!fs.existsSync(referencePath)) errors.push(`Referensi kemampuan bahasa hilang: ${language.support.reference}`);
      }
      if (language.support?.status !== "catalogued" && !language.support?.reference) {
        errors.push(`Bahasa ${language.id} berstatus ${language.support?.status} tanpa referensi.`);
      }
    }
    if (actualBetaLanguages.size !== expectedBetaLanguages.size ||
        [...expectedBetaLanguages.keys()].some((id) => !actualBetaLanguages.has(id))) {
      errors.push(`Registry harus memiliki tepat ${expectedBetaLanguages.size} bahasa beta yang didokumentasikan.`);
    }
    betaLanguageCount = actualBetaLanguages.size;
  }
}

const openaiYaml = read("agents/openai.yaml");
const shortDescription = frontmatterValue(openaiYaml, "short_description");
const defaultPrompt = frontmatterValue(openaiYaml, "default_prompt");
if (shortDescription.length < 25 || shortDescription.length > 64) {
  errors.push(`Panjang short_description harus 25–64 karakter; ditemukan ${shortDescription.length}.`);
}
if (!defaultPrompt.includes("$bahasa-indonesia")) {
  errors.push("default_prompt harus menyebut $bahasa-indonesia.");
}

let evaluationCases;
try {
  evaluationCases = JSON.parse(read("evals/cases.json"));
} catch (error) {
  errors.push(`evals/cases.json bukan JSON valid: ${error.message}`);
}

if (evaluationCases) {
  if (evaluationCases.schema_version !== 1 || !Array.isArray(evaluationCases.cases)) {
    errors.push("evals/cases.json harus memakai schema_version 1 dan array cases.");
  } else {
    const ids = new Set();
    for (const testCase of evaluationCases.cases) {
      if (!testCase.id || ids.has(testCase.id)) errors.push(`ID kasus kosong atau duplikat: ${testCase.id}`);
      ids.add(testCase.id);
      if (typeof testCase.prompt !== "string" || !testCase.prompt.trim()) {
        errors.push(`Prompt kasus tidak valid: ${testCase.id}`);
      }
      for (const key of ["preserve", "require", "forbid_patterns", "first_paragraph_require"]) {
        if (!Array.isArray(testCase.checks?.[key])) errors.push(`checks.${key} harus array: ${testCase.id}`);
      }
      if (!Array.isArray(testCase.human_review) || testCase.human_review.length === 0) {
        errors.push(`human_review wajib diisi: ${testCase.id}`);
      }
      for (const pattern of testCase.checks?.forbid_patterns ?? []) {
        try {
          new RegExp(pattern, "iu");
        } catch (error) {
          errors.push(`Regex terlarang tidak valid pada ${testCase.id}: ${error.message}`);
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Validasi gagal (${errors.length} masalah):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validasi lulus: ${path.basename(skillRoot)}, ${languageRegistry.language_count} bahasa terdaftar, ${betaLanguageCount} bahasa beta, ${profileFiles.length} profil regional, ${evaluationCases.cases.length} kasus evaluasi.`);
