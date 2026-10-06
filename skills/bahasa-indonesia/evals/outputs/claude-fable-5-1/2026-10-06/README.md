# Forward testing: claude-fable-5-1, 6 Oktober 2026

Model: `claude-fable-5-1` (dijalankan sebagai subagent Claude Code, satu agent segar per kasus).
Skill: commit `73f2c50` ditambah perubahan harness pada hari yang sama.
Kasus: 19 kasus di `evals/cases.json`. Setiap agent hanya menerima `prompt` atau `turns`, bukan `checks` atau `human_review`, dan dilarang membaca folder `evals/`.

Reproduksi penilaian otomatis:

```bash
npm run eval -- --all skills/bahasa-indonesia/evals/outputs/claude-fable-5-1/2026-10-06 --strict
```

## Hasil otomatis

Run pertama memakai `first_paragraph_require` untuk nama bahasa pada kasus fallback dan klarifikasi: 14 lulus, 5 gagal. Empat dari lima kegagalan ternyata ekspektasi kasus yang tidak konsisten antarkasus; harness lalu mendapat pemeriksaan `early_require` (tiga blok pertama) dan enam kasus diselaraskan. Keluaran tidak diubah.

Setelah penyelarasan: 18 lulus, 1 gagal.

| Kasus | Otomatis | Catatan pembaca (bukan review penutur) |
|---|---|---|
| netral-bug-explanation | lulus | Diagnosis dan tindakan jelas. |
| targeted-identifier-edit | lulus | Rename dijelaskan; artefak lain disebut tidak berubah. |
| jakarta-pronoun-override | lulus | Tanpa `gue/lo` dan variannya. |
| unknown-regional-fallback | lulus | Catatan fallback satu kalimat di awal, lalu diagnosis. |
| puitis-destructive-warning | lulus | Peringatan literal mendahului citraan. |
| kebumen-intensity-cap | lulus | Ditahan di `sedang` dengan catatan; `ningkan` dipakai sebagai pertentangan nyata. |
| sunda-kasar-ambigu | lulus | Bertanya loma/cohag di awal sambil memberi inti bug. |
| sunda-cohag-boundary | lulus | Nada keras lewat ritme; tanpa makian atau `sia` ke pengguna. |
| catalogued-language-fallback | lulus | Diagnosis dulu, batas Abui di paragraf kedua. |
| umbrella-language-clarification | **gagal** | Pertanyaan "bahasa Dayak mana" baru muncul di paragraf ketujuh. Temuan perilaku yang memotivasi aturan penempatan catatan fallback di `core.md`. |
| popular-language-beta-cap | lulus | Minangkabau tipis (`nan`, `indak`) dengan penjelasan fallback. |
| makassar-language-versus-voice | lulus | Bingkai kalimat Makassar, isi teknis Indonesia; perlu review penutur untuk `tena`, `punna nia'mi`, `le'ba'mi`. |
| melayu-variety-required | lulus | Diagnosis dulu, lalu meminta pilihan Ambon/Manado/Kupang/Papua. |
| melayu-ambon-no-mixing | lulus | Hanya `balong` dan `seng`. |
| melayu-manado-first-person | lulus | `kita so cek` dibaca sebagai agent; tanpa pronomina ke pengguna. |
| english-prompt-project-default | lulus | Jawaban Indonesia tanpa kata fungsi Inggris. |
| commit-message-convention | lulus | Commit Inggris Conventional Commits; gaya Surabaya hanya di penjelasan. |
| switch-back-neutral | lulus | Tanpa penanda Surabaya setelah "balik netral". |
| forbid-address-midway | lulus | Tanpa Mas/Mbak; satu `je`. |

## Yang belum dinilai

Kolom catatan di atas ditulis pembuat skill, bukan penutur varietas terkait, sehingga tidak dihitung sebagai review penutur dan tidak mengubah status apa pun. Kasus yang paling membutuhkan penutur: Kebumen, Sunda cohag, Makassar, Minangkabau, Melayu Ambon, dan Melayu Manado. Catatan review disimpan di `evals/reviews/`.
