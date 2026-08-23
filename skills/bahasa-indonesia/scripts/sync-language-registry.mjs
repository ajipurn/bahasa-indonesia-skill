#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultOutputPath = path.join(scriptDirectory, "..", "references", "languages.json");
const defaultSourceUrl = "https://petabahasa.kemendikdasmen.go.id/databahasa.php";

const documentedLanguages = new Map([
  ["Aceh", { status: "beta", reference: "references/languages/sumatra.md" }],
  ["Bali", { status: "beta", reference: "references/languages/java-bali-nusa-tenggara.md" }],
  ["Banjar", { status: "beta", reference: "references/languages/kalimantan.md" }],
  ["Bima (Mbojo)", { status: "beta", reference: "references/languages/java-bali-nusa-tenggara.md" }],
  ["Bugis", { status: "beta", reference: "references/languages/sulawesi.md" }],
  ["Dayak Ngaju", { status: "beta", reference: "references/languages/kalimantan.md" }],
  ["Jawa", { status: "beta", reference: "references/javanese.md" }],
  ["Lampung", { status: "beta", reference: "references/languages/sumatra.md" }],
  ["Madura", { status: "beta", reference: "references/languages/java-bali-nusa-tenggara.md" }],
  ["Makassar", { status: "beta", reference: "references/languages/sulawesi.md" }],
  ["Minangkabau", { status: "beta", reference: "references/languages/sumatra.md" }],
  ["Sasak", { status: "beta", reference: "references/languages/java-bali-nusa-tenggara.md" }],
  ["Sunda", { status: "beta", reference: "references/sundanese.md" }],
  ["Toraja", { status: "beta", reference: "references/languages/sulawesi.md" }],
]);

function decodeEntity(entity) {
  if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
  if (entity.startsWith("#")) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
  return { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' }[entity] ?? `&${entity};`;
}

function cleanHtml(value) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity) => decodeEntity(entity.toLowerCase()))
    .replace(/\s+/g, " ")
    .trim();
}

function taggedValues(value, tagName) {
  return [...value.matchAll(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi"))]
    .map((match) => cleanHtml(match[1]))
    .filter(Boolean);
}

function aliasesFromName(name) {
  return [...name.matchAll(/\(([^()]*)\)/g)]
    .flatMap((match) => match[1].split(/[,;/]/))
    .map((alias) => alias.trim())
    .filter((alias) => alias && alias.length <= 80);
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseLanguageRegistry(html, { retrievedAt = new Date().toISOString().slice(0, 10) } = {}) {
  const rows = [...html.matchAll(/<tr\s+bgcolor=[^>]*>([\s\S]*?)<\/tr>/gi)];
  const languages = [];
  const usedIds = new Set();

  for (const rowMatch of rows) {
    const cells = [...rowMatch[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => match[1]);
    if (cells.length < 4) continue;

    const indexMatch = cells[0].match(/name\s*=\s*["']?(\d+)/i);
    const sourceIdMatch = cells[3].match(/[?&]idb=(\d+)/i);
    if (!indexMatch || !sourceIdMatch) continue;

    const index = Number.parseInt(indexMatch[1], 10);
    const sourceId = Number.parseInt(sourceIdMatch[1], 10);
    const name = cleanHtml(cells[1]);
    const macroregions = taggedValues(cells[2], "b");
    const provinces = taggedValues(cells[3], "u");
    const baseId = slugify(name) || `bahasa-${sourceId}`;
    const id = usedIds.has(baseId) ? `${baseId}-${sourceId}` : baseId;
    usedIds.add(id);

    languages.push({
      index,
      id,
      name,
      aliases: aliasesFromName(name),
      macroregions,
      provinces,
      source_id: sourceId,
      support: documentedLanguages.get(name) ?? { status: "catalogued" },
    });
  }

  languages.sort((left, right) => left.index - right.index);

  return {
    schema_version: 1,
    retrieved_at: retrievedAt,
    source: {
      name: "Peta Bahasa Badan Pengembangan dan Pembinaan Bahasa",
      url: defaultSourceUrl,
      note: "Daftar 2019; tidak mencakup dialek dan subdialek secara terpisah.",
    },
    language_count: languages.length,
    capability_legend: {
      catalogued: "Nama dikenali; skill tidak boleh mengarang tuturan tanpa panduan atau contoh pengguna.",
      beta: "Panduan tersedia, tetapi keluaran tetap memerlukan kalibrasi dan review penutur.",
      validated: "Panduan telah lulus evaluasi penutur yang relevan.",
    },
    languages,
  };
}

async function readStandardInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function runCli() {
  const args = process.argv.slice(2);
  const useStandardInput = args.includes("--stdin");
  const outputIndex = args.indexOf("--output");
  const dateIndex = args.indexOf("--date");
  const outputPath = path.resolve(outputIndex >= 0 ? args[outputIndex + 1] : defaultOutputPath);
  const retrievedAt = dateIndex >= 0 ? args[dateIndex + 1] : new Date().toISOString().slice(0, 10);

  let bytes;
  if (useStandardInput) {
    bytes = await readStandardInput();
  } else {
    const response = await fetch(defaultSourceUrl);
    if (!response.ok) throw new Error(`Gagal mengunduh registry: HTTP ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
  }

  const html = new TextDecoder("windows-1252").decode(bytes);
  const registry = parseLanguageRegistry(html, { retrievedAt });
  if (registry.language_count !== 718) {
    throw new Error(`Registry harus berisi 718 bahasa; ditemukan ${registry.language_count}.`);
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  console.log(`Registry diperbarui: ${registry.language_count} bahasa -> ${outputPath}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
