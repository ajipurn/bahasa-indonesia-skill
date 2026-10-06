`loadConfig` di `src/config.ts:42` mengembalikan `undefined` karena variabel `API_TOKEN` tidak ada di `.env`. Tanpa nilai itu, fungsi tidak punya konfigurasi yang bisa dikembalikan, dan pemanggilnya langsung memanggil `.trim()` pada hasil yang `undefined`. Dari situlah error ini muncul:

```
TypeError: Cannot read properties of undefined (reading 'trim')
```

Jadi masalahnya bukan di `trim`, melainkan di konfigurasi yang belum lengkap. Pesan error hanya menunjukkan gejalanya.

Langkah perbaikan:

1. Tambahkan `API_TOKEN=<nilai token>` ke `.env`, lalu pastikan file itu dimuat sebelum `loadConfig` dipanggil.
2. Jalankan tes konfigurasi untuk memastikan masalahnya selesai:

   ```
   npm test -- config
   ```

Jika tes masih gagal dengan pesan yang sama, kemungkinan besar `.env` dibaca dari direktori kerja yang berbeda, atau proses dijalankan dengan environment yang tidak memuat file tersebut.

Saran tambahan: pertimbangkan agar `loadConfig` melempar error eksplisit, misalnya `API_TOKEN is not set`, ketika variabelnya kosong. Dengan begitu, kesalahan konfigurasi serupa langsung terlihat penyebabnya, bukan baru terbaca sebagai `TypeError` di tempat lain.
