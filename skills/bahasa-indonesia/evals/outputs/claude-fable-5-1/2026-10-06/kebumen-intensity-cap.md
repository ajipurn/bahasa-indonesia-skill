Bug-e ana nang `loadConfig` di `src/config.ts:42`: fungsi kuwe mbalekna `undefined` merga `API_TOKEN` ora ana nang `.env`. Dadi dudu logika `loadConfig`-e sing rusak; nilai sing arep diwaca pancen durung ana.

**Sing kedadean**

`loadConfig` maca `process.env.API_TOKEN`. Variabel kuwe ora disetel nang `.env`, dadi hasil bacane `undefined`, terus nilai kuwe mili langsung ke config sing dibalekna. Kode yang memakai config itu baru sadar ada masalah ketika butuh token, bukan saat config dimuat, makanya error-e kelihatan jauh dari sumbere.

**Carane ndandani**

1. Tambahkan `API_TOKEN=<nilai token>` ke file `.env`. Isi dengan nilai yang valid; jangan dibiarkan kosong.
2. Jalankan `npm test -- config` maning untuk memastikan `loadConfig` wis mbalekna object yang lengkap.

Ningkan nek tes-e isih gagal bar `.env` diisi, cek disit apakah `.env` memang dibaca dari working directory yang benar; nilai yang ada di file lain ora otomatis kebaca.

**Catatan**

Tanpa kecamatan atau kecenderungan barat/tengah/timur, jawaban ini ditahan di campuran sedang yang condong Banyumasan, bukan kental, supaya tidak mengarang bentuk yang belum tentu dipakai di sebagian Kebumen. Kalau mau lebih kental, sebutkan kecenderungannya atau beri satu-dua contoh kalimat; hasilnya tetap perlu dicek penutur sebelum dipakai di luar percakapan ini.
