`npm test -- config` gagal karena tes konfigurasi membaca `API_TOKEN` dari `.env`, dan nilainya kosong.

Urutan kejadiannya:

1. `npm test` menjalankan skrip `test` di `package.json`. Argumen setelah `--` diteruskan ke test runner, jadi `config` dipakai sebagai filter: hanya file tes yang namanya cocok dengan `config` yang dijalankan.
2. Saat tes itu dimuat, modul konfigurasi membaca `.env` lalu mengambil `process.env.API_TOKEN`.
3. Baris `API_TOKEN=` tanpa nilai (atau barisnya tidak ada sama sekali) membuat variabel itu berisi string kosong atau `undefined`. Pengecekan seperti `if (!process.env.API_TOKEN)` atau validasi skema menganggapnya tidak ada, sehingga modul melempar error, atau assertion di tes gagal, sebelum kasus uji lain sempat berjalan.

Yang pasti: kegagalannya ada pada nilai `API_TOKEN`, bukan pada filter `config` atau logika tes lainnya. Yang masih dugaan: cara `.env` dimuat (misalnya lewat `dotenv`) dan bentuk persis validasinya. Keduanya bisa dicek dari pesan error pertama di output dan dari modul konfigurasi yang diimpor tes.

Cara memperbaikinya:

- Isi `API_TOKEN` di `.env` dengan token yang valid untuk lingkungan lokal. Jangan commit file ini.
- Kalau tes tidak butuh token asli, isi nilai dummy di `.env.test` atau set langsung saat menjalankan: `API_TOKEN=dummy npm test -- config`.
- Untuk CI, set variabelnya lewat secret atau environment pipeline, bukan lewat `.env`.

Kalau output error lengkapnya dikirim, bisa dipastikan apakah yang gagal itu validasi di modul konfigurasi atau assertion di tesnya.
