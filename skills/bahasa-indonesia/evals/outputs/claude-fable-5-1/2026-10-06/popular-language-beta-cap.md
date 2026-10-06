`API_TOKEN` belum ada di `.env`, jadi `loadConfig` di `src/config.ts:42` mengembalikan `undefined`. Kode nan memakai nilai itu indak menerima token, melainkan `undefined`, sehingga kegagalannya baru terlihat di hilir saat request ke API ditolak.

Cara memperbaikinya:

1. Tambahkan baris `API_TOKEN=<nilai token>` ke `.env`; jangan commit nilainya.
2. Jalankan ulang proses supaya `.env` dibaca lagi.
3. Opsional: buat `loadConfig` melempar error yang jelas ketika `API_TOKEN` kosong, supaya masalahnya ketahuan di `src/config.ts`, bukan di tempat lain.

Soal bahasanya: Minangkabau kental belum saya pakai karena varietasnya belum ditentukan dan belum ada contoh tutur yang bisa diikuti. Tanpa itu, saya hanya memakai bentuk Minangkabau umum secara tipis seperti di atas, supaya tidak mengarang tuturan Pasaman, Lima Puluh Kota, Pesisir Selatan, atau rantau dengan tebakan. Sebutkan varietasnya (misalnya Agam, Tanah Datar, Pariaman, atau Pesisir Selatan) atau beri dua–tiga kalimat contoh, lalu saya naikkan intensitasnya. Hasil yang kental tetap perlu dicek penutur Minangkabau sebelum dipakai di luar percakapan ini.
