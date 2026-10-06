import test from "node:test";
import assert from "node:assert/strict";

import { findLanguages } from "../scripts/find-language.mjs";

const languages = [
  {
    index: 1,
    id: "abui-aboa",
    name: "Abui (Aboa)",
    aliases: ["Aboa"],
    macroregions: ["Nusa Tenggara Timur"],
    provinces: ["Nusa Tenggara Timur"],
  },
  {
    index: 2,
    id: "aceh",
    name: "Aceh",
    aliases: [],
    macroregions: ["Sumatra"],
    provinces: ["Aceh"],
  },
];

test("mencari nama dan alias tanpa membedakan kapitalisasi", () => {
  assert.equal(findLanguages(languages, "ABOA")[0].id, "abui-aboa");
  assert.equal(findLanguages(languages, "aceh")[0].id, "aceh");
});

test("mencari wilayah setelah kecocokan nama", () => {
  const results = findLanguages(languages, "Sumatra");
  assert.deepEqual(results.map((language) => language.id), ["aceh"]);
});

test("mengembalikan array kosong untuk query kosong atau tidak dikenal", () => {
  assert.deepEqual(findLanguages(languages, ""), []);
  assert.deepEqual(findLanguages(languages, "Atlantis"), []);
});

test("kecocokan wilayah persis mengalahkan alias parsial dan total dilaporkan", async () => {
  const { searchLanguages } = await import("../scripts/find-language.mjs");
  const registry = [
    { index: 1, id: "melayu", name: "Melayu", aliases: ["Melayu Papua"], macroregions: ["Maluku"], provinces: ["Maluku"] },
    { index: 2, id: "abrap", name: "Abrap", aliases: [], macroregions: ["Papua"], provinces: ["Papua"] },
    { index: 3, id: "aabinomin", name: "Aabinomin", aliases: [], macroregions: ["Papua"], provinces: ["Papua"] },
  ];
  const { results, total } = searchLanguages(registry, "papua", 2);
  assert.deepEqual(results.map((language) => language.id), ["abrap", "aabinomin"]);
  assert.equal(total, 3);
  assert.equal(searchLanguages(registry, "Melayu Papua").results[0].id, "melayu");
});
