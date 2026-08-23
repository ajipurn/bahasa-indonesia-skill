# Development guide

Dokumen ini buat maintainer dan contributor. Kalau cuma mau install dan memakai skill, cukup ikuti [README utama](../README.md).

## Source of truth

Semua file yang ikut didistribusikan ada di `skills/bahasa-indonesia/`:

```text
skills/bahasa-indonesia/
├── SKILL.md
├── agents/openai.yaml
├── evals/cases.json
├── scripts/
│   ├── validate-skill.mjs
│   ├── evaluate-output.mjs
│   ├── sync-language-registry.mjs
│   └── find-language.mjs
├── tests/*.test.mjs
└── references/
    ├── core.md
    ├── configuration.md
    ├── language-selection.md
    ├── languages.json
    ├── regional.md
    ├── naturalness.md
    ├── javanese.md
    ├── sundanese.md
    ├── poetic.md
    ├── evaluation.md
    ├── languages/*.md
    └── profiles/*.md
```

`SKILL.md` menangani routing. Reference files di-load on demand supaya context window tetap hemat. `agents/openai.yaml` menyimpan display metadata dan default prompt untuk Codex/ChatGPT.

## Validation dan test

Jalankan dari repo root:

```bash
node skills/bahasa-indonesia/scripts/validate-skill.mjs skills/bahasa-indonesia
node --test skills/bahasa-indonesia/tests/*.test.mjs
```

Validator mengecek frontmatter, required reference routing, Markdown fences, local links, language registry, readiness status setiap profile, metadata `agents/openai.yaml`, dan schema `evals/cases.json`.

Untuk mengevaluasi satu agent output terhadap test case:

```bash
node skills/bahasa-indonesia/scripts/evaluate-output.mjs <case-id> <output-file>
```

Automated checks hanya dipakai untuk invariant yang bisa diamati, seperti exact-match artifacts, required substrings, forbidden patterns, dan informasi yang harus muncul lebih awal. Naturalness tetap memerlukan human review dengan rubrik di [`references/evaluation.md`](../skills/bahasa-indonesia/references/evaluation.md).

GitHub Actions menjalankan validator dan test suite setiap ada push atau pull request.

## Language registry

Registry lokal berisi 718 nama bahasa dari Peta Bahasa Badan Bahasa. Cari entri dengan:

```bash
node skills/bahasa-indonesia/scripts/find-language.mjs <name>
```

Sinkronkan ulang source data dengan:

```bash
node skills/bahasa-indonesia/scripts/sync-language-registry.mjs
```

Status `catalogued` hanya berarti nama bahasa dikenali. Status itu bukan klaim bahwa agent bisa menuturkannya. Status `beta` mensyaratkan panduan batas dan sumber; keluaran sedang/kental tetap membutuhkan examples atau review penutur. Jangan menaikkan capability status tanpa bukti yang relevan.

## Local install smoke test

Install langsung dari checkout lokal:

```bash
npx skills add . --skill bahasa-indonesia
```

Pastikan CLI menemukan tepat satu skill bernama `bahasa-indonesia`, lalu cek bahwa seluruh reference files ikut tersalin.

## Publish ke skills.sh

1. Pastikan `skills/bahasa-indonesia/SKILL.md` tersedia di main branch public repo.
2. Jalankan validation dan test suite.
3. Uji install dari GitHub:

   ```bash
   npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia
   ```

4. Public install dengan built-in telemetry membantu skills.sh mendeteksi skill dan memasukkannya ke directory.

Public page: [skills.sh/ajipurn/bahasa-indonesia-skill/bahasa-indonesia](https://skills.sh/ajipurn/bahasa-indonesia-skill/bahasa-indonesia).

## Research dan release gate

- Landasan desain: [`riset-ragam-bahasa-indonesia.md`](riset-ragam-bahasa-indonesia.md).
- Evaluation rubric: [`references/evaluation.md`](../skills/bahasa-indonesia/references/evaluation.md).
- Regional profiles tetap beta sampai human review yang relevan tercatat.
- `jawa-alus` tetap eksperimental sampai batas tingkat tutur dan penggunaan krama tervalidasi dengan baik.
