`loadConfig` mengembalikan `undefined` karena `process.env.API_TOKEN` memang bernilai `undefined` ketika key itu tidak ada di `.env`, dan jalur di `src/config.ts:42` tidak menangani kasus tersebut secara eksplisit.

Urutan kejadiannya:

1. `dotenv` (atau loader serupa) hanya menyalin key yang tertulis di `.env` ke `process.env`. Key yang tidak ada tidak menjadi string kosong; ia tetap `undefined`.
2. Baris 42 kemungkinan besar memakai guard seperti `if (!process.env.API_TOKEN) return;` atau ekspresi `token && { ... }`. Keduanya berhenti lebih awal tanpa nilai balik, sehingga pemanggil menerima `undefined`, bukan objek config.
3. Tipe balik `loadConfig` kemungkinan tidak dideklarasikan atau dideklarasikan sebagai `Config | undefined`, jadi TypeScript tidak menolak jalur `return` kosong itu.

Poin 1 adalah perilaku `dotenv` yang pasti. Poin 2 dan 3 adalah dugaan berdasarkan pola yang umum; bentuk persisnya ada di baris 42, jadi cek apakah guard-nya `return;` tanpa nilai atau ada ekspresi kondisional yang jatuh ke `undefined`.

Dua perbaikan yang lazim:

- Lempar error dengan pesan jelas, misalnya `throw new Error("API_TOKEN is not set")`, supaya kegagalan muncul di sumbernya, bukan di pemanggil yang kemudian mengakses properti dari `undefined`.
- Jika token memang opsional, kembalikan config dengan nilai default yang eksplisit dan nyatakan tipe baliknya sebagai `Config` saja, bukan `Config | undefined`.

Untuk memverifikasi, jalankan:

```bash
npm test -- config
```

Argumen setelah `--` diteruskan ke test runner sebagai filter, jadi hanya tes yang namanya cocok dengan `config` yang dijalankan. Jika sudah ada tes untuk kasus `API_TOKEN` kosong, hasilnya memperlihatkan perilaku saat ini. Jika belum, tambahkan satu kasus yang menghapus `process.env.API_TOKEN` sebelum memanggil `loadConfig` agar regresi ini tertangkap di CI.
