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

const ignoredDirectoryNames = new Set(["node_modules", ".git"]);
const ignoredRelativeDirectories = new Set([path.join("evals", "outputs"), path.join("evals", "generated")]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (!entry.isDirectory()) return [target];
    if (ignoredDirectoryNames.has(entry.name) || ignoredRelativeDirectories.has(path.relative(skillRoot, target))) return [];
    return walk(target);
  });
}

function stripFences(text) {
  return text.replace(/^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*$/gm, "");
}

function hasHeading(text, heading) {
  return new RegExp(`^## ${heading}\\s*$`, "m").test(text);
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

  for (const match of stripFences(text).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim();
    const titled = target.match(/^(<[^>]*>|\S+)\s+(?:"[^"]*"|'[^']*'|\([^)]*\))$/);
    if (titled) target = titled[1];
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    if (/^(?:https?:|mailto:|#)/.test(target)) continue;
    target = target.split("#", 1)[0];
    try {
      target = decodeURIComponent(target);
    } catch {
      // Biarkan target apa adanya jika bukan URI yang valid.
    }
    if (!target) continue;
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
    if (!hasHeading(profileText, heading)) {
      errors.push(`Profil ${profileFile} tidak memiliki bagian '## ${heading}' pada level dua.`);
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
    if (!hasHeading(guideText, heading)) {
      errors.push(`Panduan ${guideFile} tidak memiliki bagian '## ${heading}' pada level dua.`);
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
      ["melayu", "references/languages/melayu.md"],
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

    const referencedGuides = new Set(languages.map((language) => language.support?.reference).filter(Boolean));
    for (const guideFile of languageGuideFiles) {
      if (!referencedGuides.has(`references/languages/${guideFile}`)) {
        errors.push(`Panduan bahasa tidak dirujuk oleh entri registry mana pun: references/languages/${guideFile}`);
      }
    }
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
      const hasPrompt = typeof testCase.prompt === "string" && testCase.prompt.trim().length > 0;
      const hasTurns = Array.isArray(testCase.turns);
      if (hasPrompt === hasTurns) {
        errors.push(`Kasus ${testCase.id} harus memiliki tepat satu dari 'prompt' atau 'turns'.`);
      }
      if (hasTurns) {
        const turns = testCase.turns;
        if (turns.length < 2) errors.push(`Kasus ${testCase.id}: turns harus berisi minimal 2 giliran.`);
        turns.forEach((turn, index) => {
          const expectedRole = index % 2 === 0 ? "user" : "assistant";
          if (turn?.role !== expectedRole) {
            errors.push(`Kasus ${testCase.id}: giliran ${index + 1} harus berperan '${expectedRole}'.`);
          }
          if (typeof turn?.content !== "string" || !turn.content.trim()) {
            errors.push(`Kasus ${testCase.id}: giliran ${index + 1} harus memiliki content.`);
          }
        });
        if (turns.at(-1)?.role !== "user") errors.push(`Kasus ${testCase.id}: giliran terakhir harus dari user.`);
      }
      if (!Array.isArray(testCase.tags) || testCase.tags.length === 0 ||
          testCase.tags.some((tag) => typeof tag !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag))) {
        errors.push(`Kasus ${testCase.id}: tags harus array non-kosong berisi slug kebab-case.`);
      }
      for (const key of ["preserve", "require", "forbid_patterns", "first_paragraph_require"]) {
        if (!Array.isArray(testCase.checks?.[key])) errors.push(`checks.${key} harus array: ${testCase.id}`);
      }
      if (testCase.checks?.early_require !== undefined && !Array.isArray(testCase.checks.early_require)) {
        errors.push(`checks.early_require harus array jika ada: ${testCase.id}`);
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

const reviewDirectory = path.join(skillRoot, "evals", "reviews");
const reviewFiles = fs.existsSync(reviewDirectory)
  ? fs.readdirSync(reviewDirectory).filter((file) => file.endsWith(".json")).sort()
  : [];
const reviewsBySubject = new Map();
const scoreDimensions = [
  "kealamian",
  "partikel_morfologi",
  "pronomina_jarak_sosial",
  "konsistensi_wilayah",
  "kejelasan_teknis",
  "bebas_stereotip",
];
const knownCaseIds = new Set((evaluationCases?.cases ?? []).map((testCase) => testCase.id));
const knownProfileIds = new Set(profileFiles.map((file) => file.replace(/\.md$/, "")));
const knownLanguageIds = new Set((languageRegistry?.languages ?? []).map((language) => language.id));

for (const reviewFile of reviewFiles) {
  const label = `evals/reviews/${reviewFile}`;
  let review;
  try {
    review = JSON.parse(fs.readFileSync(path.join(reviewDirectory, reviewFile), "utf8"));
  } catch (error) {
    errors.push(`${label} bukan JSON valid: ${error.message}`);
    continue;
  }

  if (review.schema_version !== 1) errors.push(`${label}: schema_version harus 1.`);
  const subject = review.subject ?? {};
  if (subject.kind === "profile") {
    if (!knownProfileIds.has(subject.id)) errors.push(`${label}: profil '${subject.id}' tidak ditemukan.`);
  } else if (subject.kind === "language") {
    if (!knownLanguageIds.has(subject.id)) errors.push(`${label}: bahasa '${subject.id}' tidak ada di registry.`);
  } else {
    errors.push(`${label}: subject.kind harus 'profile' atau 'language'.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.date ?? "")) errors.push(`${label}: date harus YYYY-MM-DD.`);
  for (const key of ["skill_commit", "model", "intensity"]) {
    if (typeof review[key] !== "string" || !review[key].trim()) errors.push(`${label}: ${key} wajib diisi.`);
  }
  if (!["tipis", "sedang", "kental"].includes(review.intensity)) {
    errors.push(`${label}: intensity harus tipis, sedang, atau kental.`);
  }
  if (!Array.isArray(review.case_ids) || review.case_ids.length === 0) {
    errors.push(`${label}: case_ids wajib berisi minimal satu ID kasus.`);
  } else {
    for (const caseId of review.case_ids) {
      if (!knownCaseIds.has(caseId)) errors.push(`${label}: kasus '${caseId}' tidak ada di evals/cases.json.`);
    }
  }
  const reviewerCount = review.reviewers?.count;
  if (!Number.isInteger(reviewerCount) || reviewerCount < 1) {
    errors.push(`${label}: reviewers.count harus bilangan bulat minimal 1.`);
  } else if (review.intensity === "kental" && reviewerCount < 2) {
    errors.push(`${label}: review intensitas kental memerlukan minimal 2 reviewer.`);
  }
  if (typeof review.reviewers?.relationship !== "string" || !review.reviewers.relationship.trim()) {
    errors.push(`${label}: reviewers.relationship wajib menjelaskan hubungan reviewer dengan varietas.`);
  }
  for (const dimension of scoreDimensions) {
    const score = review.scores?.[dimension];
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      errors.push(`${label}: scores.${dimension} harus bilangan bulat 1–5.`);
    }
  }
  if (!Array.isArray(review.recurring_failures)) errors.push(`${label}: recurring_failures harus array.`);
  if (!["tetap-beta", "naik-status", "turun-status"].includes(review.decision)) {
    errors.push(`${label}: decision harus tetap-beta, naik-status, atau turun-status.`);
  }
  if (review.decision === "naik-status") {
    if (Number.isInteger(reviewerCount) && reviewerCount < 2) {
      errors.push(`${label}: naik-status memerlukan minimal 2 reviewer.`);
    }
    const lowDimensions = scoreDimensions.filter((dimension) => !(review.scores?.[dimension] >= 4));
    if (lowDimensions.length > 0) {
      errors.push(`${label}: naik-status memerlukan skor minimal 4 pada semua dimensi; kurang pada ${lowDimensions.join(", ")}.`);
    }
  }
  if (subject.kind && subject.id) {
    const key = `${subject.kind}:${subject.id}`;
    if (!reviewsBySubject.has(key)) reviewsBySubject.set(key, []);
    reviewsBySubject.get(key).push({ date: review.date ?? "", decision: review.decision });
  }
}

const promotions = new Set();
for (const [key, records] of reviewsBySubject) {
  records.sort((left, right) => left.date.localeCompare(right.date));
  if (records.at(-1).decision === "naik-status") promotions.add(key);
}

for (const profileFile of profileFiles) {
  const profileText = fs.readFileSync(path.join(profileDirectory, profileFile), "utf8");
  const profileId = profileFile.replace(/\.md$/, "");
  if (/^Kesiapan: stabil\./m.test(profileText) && !promotions.has(`profile:${profileId}`)) {
    errors.push(`Profil ${profileId} berstatus stabil tanpa catatan review 'naik-status' yang masih berlaku di evals/reviews/.`);
  }
}

for (const language of languageRegistry?.languages ?? []) {
  if (language.support?.status === "validated" && !promotions.has(`language:${language.id}`)) {
    errors.push(`Bahasa ${language.id} berstatus validated tanpa catatan review 'naik-status' yang masih berlaku di evals/reviews/.`);
  }
}

if (errors.length > 0) {
  console.error(`Validasi gagal (${errors.length} masalah):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validasi lulus: ${path.basename(skillRoot)}, ${languageRegistry.language_count} bahasa terdaftar, ${betaLanguageCount} bahasa beta, ${profileFiles.length} profil regional, ${evaluationCases.cases.length} kasus evaluasi, ${reviewFiles.length} catatan review.`);
