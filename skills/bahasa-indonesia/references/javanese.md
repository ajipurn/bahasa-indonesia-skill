# Panduan Bersama Profil Jawa

Baca ini bersama profil `surabaya`, `semarang`, `yogyakarta`, `jawa-alus`, `banyumasan`, atau `kebumen`, serta kapan pun `speech_level: ngoko|madya|krama` dipilih.

## Pisahkan wilayah dari tingkat tutur

Dialek wilayah dan tingkat tutur bukan hal yang sama:

- Surabaya/Arekan, Semarang, Yogyakarta, Banyumasan, dan Kebumen memiliki pola regional yang berbeda.
- `ngoko`, `madya`, dan `krama` mengatur hubungan sosial dan kesantunan; semuanya dapat berinteraksi dengan wilayah.
- `jawa-alus` dalam skill ini adalah preset kesantunan berbasis krama, bukan nama sebuah daerah.

Jangan menggabungkan penanda seperti `rek`, `ik`, `je`, dan `inyong` dalam satu profil kecuali pengguna memang meminta campuran.

## Ngoko bukan izin untuk menghina

Frasa pengguna “Jawa kasar” dinormalisasi ke `speech_level: ngoko`. Ngoko terutama menandai hubungan akrab atau tidak berjarak; pemakaiannya tetap bergantung pada usia, status, situasi, dan wilayah. Jangan otomatis menambahkan makian, kata tabu, atau bentuk yang merendahkan.

- Gunakan ngoko setelah pengguna memintanya atau hubungan akrab/sebaya sudah jelas.
- Bedakan `ngoko lugu` dari `ngoko alus` jika konteks membutuhkan penghormatan terhadap orang yang dibicarakan.
- Pronomina seperti `kowe`, `koen`, atau bentuk Banyumasan tidak dapat dipertukarkan lintas wilayah.
- Jika pengguna meminta bahasa Jawa dominan dengan ngoko sedang/kental tetapi tidak menyebut wilayah, minta pilihan wilayah atau ikuti contoh mereka. Untuk keluaran tipis, gunakan bentuk yang aman dan jangan mengklaim satu “Jawa kasar” universal.

## Kebumen sebagai wilayah pertemuan

Profil `kebumen` berada pada kontinum Banyumasan–bandek, bukan kotak yang terpisah sempurna dari keduanya. Pengaruh Banyumasan dominan secara umum, sedangkan Prembun dan wilayah timur lebih dekat ke daerah transisi bandek. Jangan membuat campuran acak: ikuti kecamatan, kecenderungan barat–tengah–timur, atau contoh pengguna. Jika tidak ada rincian, pertahankan kecenderungan Banyumasan yang ringan dan batasi intensitas pada `sedang`.

## Jangan menyederhanakan kesantunan

- Jangan menyebut ngoko sebagai bahasa orang kasar. Ngoko dapat menandai keakraban dan solidaritas.
- Jangan menganggap krama sekadar versi formal dengan penggantian beberapa kata. Pilihan leksikon dapat bergantung pada siapa pelaku tindakan dan siapa yang dihormati.
- Pada Jawa Tengah, hindari memakai verba honorifik untuk meninggikan diri sendiri. Jika tidak yakin pada pasangan krama inggil/andhap, gunakan bahasa Indonesia yang sopan.
- `sampeyan` dapat membawa jarak dan kesantunan berbeda di Jawa Timur dan Jawa Tengah. Jangan menyamakannya lintas profil.
- Hubungan usia, status, dan keakraban tidak boleh ditebak dari nama pengguna.

## Bahasa dasar

Dengan `language: indonesia`, pertahankan sintaksis utama Indonesia. Sisipkan pola regional sesuai intensitas tanpa mengklaim bahwa hasilnya adalah terjemahan penuh ke bahasa Jawa.

Dengan `language: jawa`, gunakan bahasa Jawa dominan hanya jika pengguna memintanya. Jika tingkat tutur atau subwilayah belum jelas dan dapat mengubah kesantunan, ajukan satu pertanyaan singkat atau gunakan bentuk Indonesia yang aman untuk bagian yang meragukan.

Pada `language: jawa`, `variety` memakai ID profil wilayah: `surabaya`, `semarang`, `yogyakarta`, `banyumasan`, atau `kebumen`. Profil yang sama memberi pola wilayah, sedangkan `speech_level` tetap mengatur tingkat tutur. `jawa-alus` bukan nilai `variety`; permintaan “Jawa alus” dengan `language: jawa` berarti `speech_level: krama`, dan wilayahnya tetap ditanyakan atau mengikuti contoh pengguna.

## Ejaan Latin Jawa

Ejaan informal seperti `opo`, `piye`, dan `monggo` lazim dalam tulisan sehari-hari dan bukan parodi aksen; ejaan baku `apa` dan `mangga` juga sah. Pilih satu kecenderungan per jawaban dan ikuti contoh pengguna. Larangan di `regional.md` menyasar salah eja yang dibuat-buat untuk meniru bunyi, bukan konvensi ejaan yang memang dipakai penutur.

## Intensitas pada profil Jawa

- `tipis`: prosa Indonesia dengan ritme, satu partikel yang tepat, atau frasa Jawa pendek.
- `sedang`: beberapa frasa atau klausa Jawa, pronomina sesuai hubungan, dan pola wilayah yang konsisten.
- `kental`: bahasa Jawa dapat dominan pada penjelasan percakapan; detail teknis tetap mudah dipindai dan artefak exact-match yang bukan target tugas tetap persis.

Jangan mengubah intensitas menjadi ejaan fonetis. Perbedaan bunyi seperti realisasi vokal Banyumasan tidak perlu ditulis sebagai parodi aksen.

## Istilah teknis

Jangan mengubah istilah repo dan artefak teknis yang hanya dirujuk demi gaya Jawa. Artefak yang memang menjadi target tugas tetap mengikuti perubahan pengguna. Afiks atau enklitik regional boleh berada di luar inline code:

- aman: “`token`-e durung kebaca”;
- tidak aman: mengubah identifier `authToken` menjadi ejaan regional;
- aman: “Jalankan `npm test` sek.”;
- tidak aman: mengubah isi command atau output-nya.

Jika campuran membuat instruksi ambigu, tulis langkah eksekusi dalam Indonesia netral dan gunakan gaya regional pada penjelasannya.

## Sumber tambahan

- [Isodarus, tingkat tutur Jawa dan relasi sosial](https://e-journal.usd.ac.id/index.php/sintesis/article/view/2550/0)
- [Azila dan Febriani, ngoko sebagai komunikasi akrab tanpa jarak](https://doi.org/10.24198/metahumaniora.v11i2.34998)
- [Arfianingrum, ngoko lugu/ngoko alus dan krama lugu/krama alus](https://doi.org/10.24176/jpp.v3i2.6963)
