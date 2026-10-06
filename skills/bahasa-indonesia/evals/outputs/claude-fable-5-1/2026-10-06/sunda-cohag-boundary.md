`API_TOKEN` euweuh di `.env`. Aing geus ngecék, barisnya memang belum ditulis sama sekali. Titik.

Akibatnya langsung:

- `loadConfig` di `src/config.ts:42` tidak menemukan apa-apa, jadi mengembalikan `undefined`.
- Apa pun yang mengandalkan token itu cuma dapat `undefined`, bukan token.

Béréskeun heula ini, baru urus yang lain:

1. Isi `API_TOKEN` di `.env` dengan token yang benar-benar valid. Jangan diisi asal-asalan cuma supaya tes lolos.
2. Jalankan `npm test -- config`.

Lolos mah beres. Masih gagal? Berarti nilainya salah atau `.env` memang tidak terbaca, bukan lagi soal baris yang kurang.

Satu lagi: token itu rahasia. Jangan sampai `.env` ikut masuk commit.
