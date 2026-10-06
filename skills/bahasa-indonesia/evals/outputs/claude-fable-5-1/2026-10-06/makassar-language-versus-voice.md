Tabe'. Anne saba'na: tena `API_TOKEN` ri `.env`.

**Yang terjadi**

- `loadConfig` di `src/config.ts:42` membaca `API_TOKEN` dari `.env`. Karena variabel itu tidak ada, fungsi tersebut mengembalikan `undefined`, bukan objek konfigurasi.
- Tes yang memakai hasil `loadConfig` lalu gagal, sehingga `npm test` keluar dengan status gagal. Ini bukan bug pada logika tes; penyebabnya lingkungan lokal yang belum lengkap.

**Dugaan:** error yang tampil kemungkinan berupa akses properti pada `undefined` di tes pertama yang menyentuh konfigurasi. Kalau pesannya berbeda, kirim potongan log-nya.

**Cara memperbaiki**

1. Tambahkan `API_TOKEN=<nilai>` ke `.env` di root proyek. Kalau repo punya `.env.example`, salin dari situ.
2. Jalankan ulang `npm test`.

**Saran (opsional):** buat `loadConfig` melempar error eksplisit saat `API_TOKEN` kosong, bukan diam-diam mengembalikan `undefined`, supaya kegagalan berikutnya langsung menunjuk ke variabel yang hilang.

Punna nia'mi `API_TOKEN` ri `.env`, le'ba'mi.

Catatan: bahasa Makassar di sini masih tipis, hanya pada bingkai kalimat; isi teknis tetap dalam bahasa Indonesia supaya tidak ada bentuk Makassar yang dikarang. Kalau ada contoh tuturan Makassar yang diinginkan, bisa diikuti lebih dalam, dan untuk hasil yang akan dipublikasikan tetap perlu review penutur.
