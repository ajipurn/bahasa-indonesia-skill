`API_TOKEN` balong terbaca di `.env`, jadi `loadConfig` di `src/config.ts:42` mengembalikan `undefined`: nilai yang diterimanya kosong.

Dua kemungkinan penyebabnya:

- key `API_TOKEN` memang belum diisi atau belum ada di `.env`;
- `.env` seng ikut dimuat sebelum `loadConfig` dipanggil, misalnya `dotenv` dijalankan setelah import `config`.

Isi dulu nilainya di `.env`, baru jalankan:

```bash
npm test -- config
```

Kalau test masih gagal setelah token terisi, kirim output-nya supaya urutan pemuatan `.env` bisa dicek.
