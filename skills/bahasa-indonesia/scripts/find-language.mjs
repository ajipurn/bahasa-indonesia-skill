#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRegistryPath = path.join(scriptDirectory, "..", "references", "languages.json");
const defaultLimit = 12;

function normalize(value) {
  return value
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLocaleLowerCase("id")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Peringkat: 0 nama/alias persis, 1 awalan nama/alias, 2 wilayah/provinsi persis,
 * 3 nama/alias mengandung query, 4 wilayah/provinsi mengandung query.
 * Kecocokan wilayah persis sengaja mengalahkan alias parsial agar query seperti
 * "papua" menampilkan bahasa-bahasa Papua sebelum alias "Melayu Papua".
 */
export function searchLanguages(languages, query, limit = defaultLimit) {
  const needle = normalize(query);
  if (!needle) return { results: [], total: 0 };

  const scored = languages
    .map((language) => {
      const primary = [language.id, language.name, ...language.aliases].map(normalize);
      const locations = [...language.macroregions, ...language.provinces].map(normalize);
      let score = Number.POSITIVE_INFINITY;

      if (primary.includes(needle)) score = 0;
      else if (primary.some((value) => value.startsWith(needle))) score = 1;
      else if (locations.includes(needle)) score = 2;
      else if (primary.some((value) => value.includes(needle))) score = 3;
      else if (locations.some((value) => value.includes(needle))) score = 4;

      return { language, score };
    })
    .filter((result) => Number.isFinite(result.score))
    .sort((left, right) => left.score - right.score || left.language.index - right.language.index);

  return { results: scored.slice(0, limit).map(({ language }) => language), total: scored.length };
}

export function findLanguages(languages, query, limit = defaultLimit) {
  return searchLanguages(languages, query, limit).results;
}

function runCli() {
  const query = process.argv.slice(2).join(" ").trim();
  if (!query) {
    console.error("Pemakaian: node scripts/find-language.mjs <nama|alias|wilayah|provinsi>");
    process.exit(2);
  }

  const registry = JSON.parse(fs.readFileSync(defaultRegistryPath, "utf8"));
  const { results, total } = searchLanguages(registry.languages, query);
  if (results.length === 0) {
    console.log(`Tidak ada kecocokan registry untuk: ${query}`);
    return;
  }

  for (const language of results) {
    const aliases = language.aliases.length > 0 ? `; alias: ${language.aliases.join(", ")}` : "";
    const locations = language.provinces.length > 0 ? language.provinces.join(", ") : language.macroregions.join(", ");
    console.log(`${language.id}\t${language.name}\t${language.support.status}\t${locations}${aliases}`);
  }
  if (total > results.length) {
    console.log(`… dan ${total - results.length} kecocokan lain. Persempit query atau sebutkan nama bahasa yang lebih spesifik.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
