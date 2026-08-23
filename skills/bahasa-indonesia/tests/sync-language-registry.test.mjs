import test from "node:test";
import assert from "node:assert/strict";

import { parseLanguageRegistry } from "../scripts/sync-language-registry.mjs";

const fixture = `
<tr bgcolor=#dfe2e3 valign=top>
  <td align=center><a name=1></a>1.</td>
  <td valign=top><strong>Abui (Aboa)</strong></td>
  <td valign=top><b>Nusa Tenggara Timur</b></td>
  <td valign=top><div><a href="infostatistik.php?idb=225&count=1"><u>Nusa Tenggara Timur</u></a></div></td>
</tr>
<tr bgcolor=#cccdce valign=top>
  <td align=center><a name=2></a>2.</td>
  <td valign=top><strong>Jawa</strong></td>
  <td valign=top><b>Jawa dan Bali</b>, <b>Sumatra</b></td>
  <td valign=top><a href="infostatistik.php?idb=70&count=2"><u>Jawa Tengah</u></a>, <a href="infostatistik.php?idb=70&count=2"><u>Jawa Timur</u></a></td>
</tr>
<tr bgcolor=#dfe2e3 valign=top>
  <td align=center><a name=3></a>3.</td>
  <td valign=top><strong>Aceh</strong></td>
  <td valign=top><b>Sumatra</b></td>
  <td valign=top><a href="infostatistik.php?idb=1&count=3"><u>Aceh</u></a></td>
</tr>`;

test("mengurai nama, alias, wilayah, provinsi, dan ID sumber", () => {
  const registry = parseLanguageRegistry(fixture, { retrievedAt: "2026-08-23" });
  assert.equal(registry.language_count, 3);
  assert.deepEqual(registry.languages[0], {
    index: 1,
    id: "abui-aboa",
    name: "Abui (Aboa)",
    aliases: ["Aboa"],
    macroregions: ["Nusa Tenggara Timur"],
    provinces: ["Nusa Tenggara Timur"],
    source_id: 225,
    support: { status: "catalogued" },
  });
});

test("memberi status beta hanya pada bahasa yang memiliki panduan", () => {
  const registry = parseLanguageRegistry(fixture);
  assert.deepEqual(registry.languages[1].support, {
    status: "beta",
    reference: "references/javanese.md",
  });
  assert.deepEqual(registry.languages[1].macroregions, ["Jawa dan Bali", "Sumatra"]);
  assert.deepEqual(registry.languages[1].provinces, ["Jawa Tengah", "Jawa Timur"]);
  assert.deepEqual(registry.languages[2].support, {
    status: "beta",
    reference: "references/languages/sumatra.md",
  });
});
