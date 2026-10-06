Kita so cek `.env` di repo contoh: `API_TOKEN=` memang masih kosong, tidak ada nilai sama sekali. Karena itu `loadConfig` di `src/config.ts:42` mengembalikan `undefined`.

Pengecekan itu kita yang lakukan sendiri; tidak ada yang perlu diulang. Tinggal isi nilai `API_TOKEN` di `.env`, lalu jalankan ulang kode yang memanggil `loadConfig`.
