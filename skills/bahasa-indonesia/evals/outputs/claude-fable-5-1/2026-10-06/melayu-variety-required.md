`npm test` gagal karena `API_TOKEN` tidak ada di `.env`. Akibatnya `loadConfig` di `src/config.ts:42` mengembalikan `undefined`, dan tes yang bergantung pada nilai itu ikut gagal.

Cara memperbaikinya: tambahkan `API_TOKEN` ke `.env` (salin dari `.env.example` jika ada), lalu jalankan `npm test` lagi. Saran tambahan: jika variabel ini memang wajib, buat `loadConfig` melempar error yang jelas saat `API_TOKEN` kosong, supaya kegagalannya tidak baru terlihat jauh di dalam tes.

Soal bahasa Melayu: "Melayu" mencakup banyak varietas, dan saya baru bisa menuliskannya dengan intensitas sedang untuk salah satu dari Melayu Ambon, Manado, Kupang, atau Papua. Sebutkan satu, nanti penjelasan di atas saya tulis ulang dalam varietas itu. Varietas lain seperti Riau, Deli, Pontianak, atau Palembang belum saya dukung, jadi saya tidak akan mencampur atau mengarang-ngarangnya. Sementara menunggu pilihan, penjelasannya saya tulis dalam bahasa Indonesia dulu.
