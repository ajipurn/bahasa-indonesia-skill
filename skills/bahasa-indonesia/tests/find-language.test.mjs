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
