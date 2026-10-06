`API_TOKEN` belum ada di `.env`, jadi `loadConfig` di `src/config.ts:42` mengembalikan `undefined`.

Soal bahasa Abui: saya mengenali Abui (Aboa) sebagai bahasa di Nusa Tenggara Timur, tetapi belum ada panduan kosakata dan tata bahasanya yang bisa saya pakai. Daripada mengarang kalimat yang terdengar Abui tetapi belum tentu benar, penjelasannya saya tulis dalam bahasa Indonesia dulu.

Intinya:

- Variabel `API_TOKEN` belum didefinisikan di file `.env`.
- Karena itu `loadConfig` tidak menemukan nilainya dan mengembalikan `undefined`.
- Tambahkan baris `API_TOKEN=<nilai token>` ke `.env`, lalu jalankan ulang aplikasi.

Kalau ada contoh kalimat Abui untuk situasi seperti ini, kirimkan saja. Saya bisa mengikuti polanya secara terbatas sambil menjaga makna, tanpa menambahkan bentuk rekaan.
