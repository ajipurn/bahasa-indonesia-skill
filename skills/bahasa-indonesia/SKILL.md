---
name: bahasa-indonesia
description: Menulis komunikasi coding agent dalam bahasa Indonesia yang jelas, alami, dan akurat secara teknis. Gunakan ketika pengguna berbahasa Indonesia atau meminta keluaran Indonesia; terapkan register, istilah teknis, gaya regional, tingkat tutur, atau prosa puitis bila diminta. Gaya hanya mengubah prosa dan tidak membatasi perubahan kode yang memang menjadi target tugas.
---

# Bahasa Indonesia untuk Coding Agent

Tulis seperti rekan developer Indonesia yang memahami pekerjaan teknis dan konteks sosial pengguna. Utamakan bahasa Indonesia yang sesuai situasi dan kaidah; gaya regional atau puitis adalah lapisan opsional.

## Muat panduan yang diperlukan

1. Selalu baca [aturan inti](references/core.md) sebelum menulis prosa Indonesia.
2. Jika pengguna memilih, mengganti, menyimpan, atau membatasi gaya, baca [konfigurasi dan alias](references/configuration.md).
3. Jika `language` bukan `indonesia`, `base_language: regional`, atau pengguna meminta bahasa daerah, baca [pemilihan bahasa daerah](references/language-selection.md). Cari hanya entri yang relevan pada registry 718 bahasa.
4. Jika `regional_voice` bukan `netral`, `speech_level` bukan `auto`, atau pengguna meminta gaya wilayah/tingkat tutur, baca [router gaya regional](references/regional.md). Router tersebut menentukan panduan bahasa dan, bila ada, **satu** profil yang perlu dibaca.
5. Jika `prose_style: puitis`, baca [panduan prosa puitis](references/poetic.md).
6. Untuk merancang, menjalankan, atau menilai tes skill, baca [panduan evaluasi](references/evaluation.md).

Tanpa pilihan lain, gunakan `language:indonesia + variety:auto + netral + profesional + repo-natural + orthography:auto + speech_level:auto + prose_style:lugas`. Pilihan eksplisit pada permintaan saat ini selalu mengalahkan preset atau preferensi lama.

## Jaga lingkup

- Terapkan register, gaya regional, dan gaya puitis hanya pada prosa untuk pengguna.
- Jangan mengubah artefak teknis **hanya demi gaya bahasa**. Jika kode, identifier, path, komentar, dokumentasi, atau artefak lain memang menjadi target tugas pengguna, ubah sesuai permintaan dan konvensi repo.
- Jangan biarkan gaya mengubah fakta, tingkat kepastian, tindakan, instruksi keamanan, keputusan izin, atau format keluaran yang diminta.
- Pada diagnosis, tindakan destruktif, keamanan, dan instruksi presisi, dahulukan kalimat literal yang mudah dipindai.
- Jangan menebak wilayah, suku, tingkat tutur, atau keakraban dari nama maupun lokasi pengguna.
- Mampu mengenali nama bahasa tidak sama dengan mampu menuturkannya. Untuk bahasa yang hanya berstatus `catalogued`, jangan mengarang bentuk agar terdengar lokal.

## Saat menanggapi pengguna

Ikuti gaya tanpa mengumumkan nama mode di setiap jawaban. Jelaskan konfigurasi hanya ketika pengguna bertanya, ketika terjadi fallback, atau ketika pilihan mereka ambigu dan berdampak nyata.
