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
</tr>
<tr bgcolor=#cccdce valign=top>
  <td align=center><a name=4></a>4.</td>
  <td valign=top><strong>Melayu</strong></td>
  <td valign=top><b>Maluku</b>, <b>Papua</b></td>
  <td valign=top><a href="infostatistik.php?idb=10&count=4"><u>Maluku</u></a>, <a href="infostatistik.php?idb=10&count=4"><u>Papua</u></a></td>
</tr>`;

test("mengurai nama, alias, wilayah, provinsi, dan ID sumber", () => {
  const registry = parseLanguageRegistry(fixture, { retrievedAt: "2026-08-23" });
  assert.equal(registry.language_count, 4);
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

test("menambahkan alias varietas untuk bahasa yang didokumentasikan", () => {
  const registry = parseLanguageRegistry(fixture);
  const melayu = registry.languages[3];
  assert.equal(melayu.id, "melayu");
  assert.deepEqual(melayu.aliases, ["Melayu Ambon", "Melayu Manado", "Melayu Kupang", "Melayu Papua"]);
  assert.deepEqual(melayu.support, { status: "beta", reference: "references/languages/melayu.md" });
  assert.equal("aliases" in melayu.support, false);
});

test("readBounded berhenti sebelum melampaui batas dan menggabungkan chunk di bawah batas", async () => {
  const { readBounded } = await import("../scripts/sync-language-registry.mjs");
  async function* chunks(sizes) {
    for (const size of sizes) yield Buffer.alloc(size, 0x61);
  }
  const small = await readBounded(chunks([3, 4]), "Uji", 10);
  assert.equal(small.toString(), "aaaaaaa");
  await assert.rejects(readBounded(chunks([6, 6]), "Uji", 10), /Uji melebihi batas 10 byte\./);
});

test("downloadRegistry menolak content-length dan body yang melampaui batas, tetapi menerima unduhan kecil", async () => {
  const { downloadRegistry } = await import("../scripts/sync-language-registry.mjs");
  const stub = ({ ok = true, status = 200, contentLength, body }) => async () => ({
    ok,
    status,
    headers: new Headers(contentLength === undefined ? {} : { "content-length": String(contentLength) }),
    body,
  });
  const stream = (sizes) => new ReadableStream({
    start(controller) {
      for (const size of sizes) controller.enqueue(new Uint8Array(size).fill(0x62));
      controller.close();
    },
  });

  await assert.rejects(
    downloadRegistry("https://contoh", { fetchImplementation: stub({ contentLength: 11, body: stream([1]) }), limit: 10 }),
    /content-length 11/,
  );
  await assert.rejects(
    downloadRegistry("https://contoh", { fetchImplementation: stub({ body: stream([6, 6]) }), limit: 10 }),
    /Unduhan registry melebihi batas 10 byte\./,
  );
  await assert.rejects(
    downloadRegistry("https://contoh", { fetchImplementation: stub({ ok: false, status: 503, body: stream([]) }) }),
    /HTTP 503/,
  );
  const bytes = await downloadRegistry("https://contoh", { fetchImplementation: stub({ contentLength: 7, body: stream([3, 4]) }), limit: 10 });
  assert.equal(bytes.toString(), "bbbbbbb");
});
