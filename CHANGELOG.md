# Changelog

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/). Versi mengacu pada commit di `main` sampai ada tag rilis.

## Belum dirilis

### Ditambahkan

- Panduan beta untuk empat varietas Melayu Indonesia Timur: Ambon, Manado, Kupang, dan Papua, di `references/languages/melayu.md`. `language: melayu` kini berstatus `beta` dan mewajibkan `variety`.
- Alias registry `Melayu Ambon`, `Melayu Manado`, `Melayu Kupang`, dan `Melayu Papua` sehingga `find-language.mjs` menemukannya.
- Mode batch pada `evaluate-output.mjs` (`--all <folder>`, `--list`, `--strict`) untuk forward testing banyak kasus sekaligus.
- Catatan review penutur di `evals/reviews/` dengan skema yang divalidasi; status `stabil` atau `validated` kini ditolak validator tanpa catatan `naik-status`.
- Tiga kasus evaluasi Melayu: klarifikasi varietas, batas campur varietas, dan pembacaan `kita` Manado sebagai orang pertama tunggal.
- Lisensi MIT (`LICENSE` dan field `license` di `SKILL.md`).
- Aturan bahasa jawaban di `core.md`: permintaan eksplisit menang, konfigurasi proyek mengalahkan bahasa pesan, tanpa keduanya ikuti bahasa pengguna. Deskripsi `SKILL.md` kini memuat pemicu berbahasa Inggris.
- Opsi `artifact_language` (`auto`, `indonesia`, `english`) untuk commit message, deskripsi PR, komentar kode, docstring, dan changelog; gaya regional atau puitis tidak pernah masuk ke artefak ini.
- Dua kasus evaluasi: prompt Inggris dengan konfigurasi Indonesia, dan commit message berkonvensi dengan penjelasan bergaya regional.
- `package.json` tanpa dependency dengan script `validate`, `test`, `check`, `eval`, `find-language`, `sync-registry`, dan `matrix`; CI memakai script yang sama.
- `tags` pada setiap kasus dan opsi `--tag` serta `--cases` pada evaluator.
- Kasus multi-turn lewat `turns`; dua kasus baru untuk “balik netral” dan larangan sapaan di tengah percakapan.
- `scripts/generate-matrix.mjs` menghasilkan 238 kasus profil × skenario × intensitas dengan deteksi kebocoran penanda antarprofil.
- Forward testing pertama: 19 keluaran `claude-fable-5-1` tersimpan di `evals/outputs/claude-fable-5-1/2026-10-06/` beserta ringkasan; 18 lulus otomatis, 1 temuan perilaku (klarifikasi terkubur).
- Pemeriksaan `early_require` (tiga blok pertama) untuk catatan fallback dan pertanyaan klarifikasi; aturan penempatannya ditulis di `SKILL.md` dan `core.md`.

### Diubah

- Jumlah bahasa beta menjadi 15; dokumentasi, validator, dan script sinkronisasi disesuaikan.
- `sync-language-registry.mjs` dapat menambahkan alias tambahan untuk bahasa yang didokumentasikan; `Nggahi Mbojo` menjadi alias `bima-mbojo`.
- `sync-language-registry.mjs` membatasi masukan 10 MiB pada jalur `--stdin` (PR #3 oleh @anupamme) dan jalur `fetch`, termasuk penolakan dini berdasarkan `content-length`.
- `speech_level: lemes` untuk ragam hormat Sunda; tingkat tutur Madura memakai nilai ASCII `enja-iya`, `engghi-enten`, `engghi-bhunten` dan dirutekan dari `regional.md`.
- `language: jawa` memilih wilayah lewat `variety` berisi ID profil Jawa.
- Fallback eksplisit untuk “Betawi”, “Batak”, dan “Melayu” tanpa varietas; `naturalness.md` kini dirutekan juga dari jalur bahasa beta.
- `evaluate-output.mjs`: blok pembuka melewati heading dan menyertakan code block atau daftar yang mengikutinya; `require` tidak membedakan kapital; `forbid_patterns` mengabaikan code; file duplikat dilaporkan; file hilang berhenti dengan pesan rapi.
- `find-language.mjs`: kecocokan wilayah persis mengalahkan alias parsial; jumlah kecocokan yang terpotong dilaporkan.
- `validate-skill.mjs`: mengabaikan `evals/outputs/`, mencocokkan heading secara persis pada level dua, menoleransi title dan URL-encoding pada tautan, menolak panduan bahasa yatim, dan mewajibkan minimal 2 reviewer serta skor ≥4 untuk `naik-status` dengan catatan terbaru yang berlaku.
- Bagian “Invarian otomatis” di `evaluation.md` diturunkan ke empat pemeriksaan yang benar-benar dijalankan.

### Diperbaiki

- `manéh` (Sunda) dibedakan dari `maneh` (Jawa, “lagi”) di aturan inti dan profil Bandung.
- Contoh Kebumen condong Banyumasan memakai `kuwe`, bukan `kuwi`.
- Dompu dijelaskan sebagai varietas di dalam entri `bima-mbojo`, bukan bahasa lain.
- Heading sumber profil Jaksel disamakan dengan profil lain.
- Kasus evaluasi Jakarta mencakup varian `gua`, `gw`, `lu`, `elo`; kasus Manado tidak lagi melarang kata “beta” sebagai status; kasus rename meminta artefak disebut eksplisit sehingga `preserve` tidak gagal palsu.

## Rilis awal — 22 sampai 23 Agustus 2026

- Skill `bahasa-indonesia` dengan aturan inti, konfigurasi, 11 profil regional, 14 bahasa beta, registry 718 bahasa, gaya puitis, dan harness evaluasi.
