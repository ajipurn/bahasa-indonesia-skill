**Peringatan:** `rm -rf ./build-cache` akan menghapus direktori `./build-cache` beserta seluruh isinya—semua file dan subdirektori di dalamnya—secara permanen. Tidak ada konfirmasi, tidak ada tempat sampah, tidak ada undo. Perintah ini **belum dijalankan** dan hanya akan dijalankan setelah ada persetujuan eksplisit.

Bayangkan `./build-cache` sebagai gudang di belakang rumah proyek. Di rak-raknya tersimpan hasil build yang pernah dirakit, disimpan supaya kerja berikutnya tidak perlu dimulai dari nol. Flag `-r` membuka setiap pintu di dalam gudang itu sampai ke ruang terkecil; flag `-f` membungkam setiap pertanyaan yang biasanya menahan tangan sebelum sesuatu dibuang. Begitu perintah ini berjalan, gudang itu kosong sampai ke lantai, dan pintunya pun ikut dicabut.

Yang pasti: semua yang ada di `./build-cache` hilang. Yang biasanya benar, tetapi belum saya periksa untuk folder ini: isi cache bisa dibangun ulang, sehingga harga yang dibayar hanyalah build berikutnya yang lebih lambat. Yang tidak boleh diasumsikan: bahwa tidak ada file lain yang kebetulan disimpan di sana. Jika ada, file itu ikut terbuang bersama seluruh isi gudang.

Sebelum menyetujui, dua hal layak dilihat sebentar:

- Pastikan working directory sudah benar. `./build-cache` adalah path relatif; folder bernama sama di tempat lain adalah gudang yang berbeda.
- Jalankan `ls -la ./build-cache` atau `du -sh ./build-cache` untuk melihat apa saja yang akan ikut hilang.

Perintah tidak akan dijalankan sampai ada jawaban tegas, misalnya "ya, jalankan". Kalau masih ragu, berhenti di sini adalah pilihan yang aman.
