`API_TOKEN` di `.env` kosong, je. Itu sebabnya `loadConfig` di `src/config.ts:42` mengembalikan `undefined`: tanpa nilai `API_TOKEN`, config tidak pernah terbentuk.

Perbaikannya:

1. Isi `API_TOKEN` di `.env` dengan token yang valid.
2. Jalankan `npm test -- config` untuk memastikan `loadConfig` sudah mengembalikan config.

Nilai token cukup di `.env` lokal, jangan ikut di-commit ke repo.
