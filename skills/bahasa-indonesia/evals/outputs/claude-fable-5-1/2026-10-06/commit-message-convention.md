Commit message-nya:

```
fix(config): read API_TOKEN from .env in loadConfig

loadConfig was not reading API_TOKEN from .env correctly, so the
token set there never reached the loaded config. Read it from .env
so the value is available at runtime.
```

Penjelasan perubahannya, rek: sebelum ini `loadConfig` di `src/config.ts:42` tidak membaca `API_TOKEN` dari `.env` dengan benar. Jadi, walaupun token sudah ditulis di file itu, nilainya tidak pernah sampai ke config yang dimuat. Sekarang `API_TOKEN` dibaca dari `.env` seperti seharusnya, jadi token-nya wis kebaca waktu config dimuat.

Soal format commit-nya:

- `fix` karena ini perbaikan perilaku, bukan fitur baru.
- Scope `config` mengikuti modul yang disentuh. Kalau repo memakai nama scope lain untuk `src/config.ts`, sesuaikan saja.
- Subjek ditulis imperatif, huruf kecil setelah tanda titik dua, dan tanpa titik di akhir, sesuai Conventional Commits.
- Body menjelaskan gejala dan alasannya. File dan baris tidak perlu disebut karena sudah terlihat di diff.

Satu catatan: body di atas disusun dari deskripsi yang diberikan tadi. Kalau penyebab aslinya lebih spesifik, misalnya `.env` dimuat setelah `loadConfig` dipanggil atau nama key-nya salah ketik, sebut itu di body supaya alasannya lebih jelas buat yang membaca `git log` nanti.
