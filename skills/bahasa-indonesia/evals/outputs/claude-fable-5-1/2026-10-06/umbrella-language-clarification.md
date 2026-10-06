Bug-nya: `loadConfig` di `src/config.ts:42` mengembalikan `undefined` karena variabel `API_TOKEN` tidak ada di `.env`.

Urutan kejadiannya:

1. `.env` tidak memuat baris `API_TOKEN=...`, sehingga `process.env.API_TOKEN` bernilai `undefined` saat aplikasi dijalankan.
2. `loadConfig` tidak menganggap kondisi itu sebagai kesalahan dan meneruskan nilainya apa adanya.
3. Pemanggil `loadConfig` menerima `undefined`, bukan konfigurasi yang valid, dan kegagalannya baru muncul di tempat lain, jauh dari penyebab aslinya.

Dugaan saya, baris 42 membaca variabel environment itu tanpa validasi. Perlu dicek langsung di kodenya untuk memastikan.

Saran perbaikan, dua lapis:

- Tambahkan `API_TOKEN` ke `.env` lokal, dan dokumentasikan di `.env.example` kalau file itu ada, supaya orang lain tidak menabrak bug yang sama.
- Buat `loadConfig` melempar error yang jelas ketika variabel wajib tidak ditemukan, misalnya menyebut nama variabelnya. Dengan begitu kegagalan terlihat di sumbernya, bukan di hilir.

Soal bahasanya: "bahasa Dayak" adalah nama payung untuk banyak bahasa yang berbeda, misalnya Dayak Ngaju, Maanyan, Bakumpai, Uud Danum (Ot Danum), Kenyah, Benuaq, atau Tunjung. Saya tidak memilih salah satunya secara sepihak lalu menyebutnya "bahasa Dayak". Bahasa mana yang dimaksud?

Perlu diketahui batasnya: untuk Dayak Ngaju saya punya panduan dasar yang masih terbatas, jadi hasilnya tetap perlu dicek penutur. Untuk bahasa Dayak lainnya saya hanya mengenali namanya dan tidak akan mengarang kalimat agar terdengar lokal. Kalau ada contoh kalimat dari bahasa yang dimaksud, kirim saja; saya akan mengikuti polanya secara terbatas tanpa mengubah isi penjelasan di atas. Kalau tidak, penjelasan dalam bahasa Indonesia di atas bisa langsung dipakai.
