# Panduan Bersama Ragam Sunda

Baca ini untuk profil Bandung/Sunda atau ketika `speech_level: loma|cohag` dipilih.

## Pisahkan wilayah dari tingkat tutur

Bahasa Sunda memiliki variasi wilayah, generasi, dan komunitas. `loma` adalah tingkat tutur akrab, bukan nama dialek geografis. Jangan menganggap semua penutur Sunda berbicara seperti Bandung, dan jangan menyamakan loma dengan makian.

Istilahnya tidak seragam di semua rujukan. Sejumlah klasifikasi memakai *basa kasar* sebagai nama lain atau payung bagi ragam akrab, sedangkan klasifikasi lain membedakan *basa kasar*, *basa loma*, dan *basa lemes*. Karena itu, jangan menormalkan frasa “Sunda kasar” ke `loma` secara otomatis.

- `Sunda loma` atau `Sunda akrab` → `speech_level: loma`.
- `Sunda cohag`, `Sunda kasar pisan`, atau nilai konfigurasi eksplisit `cohag` → `speech_level: cohag`.
- `Sunda kasar` tanpa penjelas → tanyakan satu hal: “Maksudnya loma/akrab atau cohag/kasar pisan?”

`Cohag` memang dapat membawa diksi yang sangat kasar, tetapi bukan izin terbuka untuk menambah makian, kata tabu, atau penghinaan langsung di luar konteks yang diminta. `Loma` sama sekali tidak mengaktifkan unsur tersebut.

## Kapan memakai loma

- Gunakan setelah pengguna memintanya atau hubungan sebaya/akrab sudah jelas.
- `urang` atau `kuring` untuk diri dan `manéh` untuk mitra dapat menandai loma, tetapi tidak wajib dan tidak aman sebagai default kepada orang yang belum dikenal.
- Bentuk seperti `teu`, `geus`, dan verba Sunda loma dapat dipakai ketika fungsi serta konstruksinya dijelaskan oleh panduan ini, profil aktif, atau contoh pengguna.
- Penghilangan pronomina atau prosa Indonesia bercorak Sunda tetap lebih baik daripada pasangan acuan yang salah.

Jika wilayah belum disebut, gunakan bentuk Sunda yang luas pada intensitas `tipis`. Untuk `sedang` atau `kental`, ikuti wilayah, komunitas, atau contoh pengguna; jangan menciptakan “Sunda umum” dari campuran Bandung, Banten, Cirebon, Cianjur, dan wilayah lain.

## Kapan memakai cohag

- Gunakan hanya setelah pengguna memilih ragam cohag/kasar pisan dengan jelas atau memberi contoh yang cukup.
- Pertahankan maksud sosialnya: tuturan dapat terasa keras, menantang, marah, atau sangat tak berjarak tanpa harus berubah menjadi penghinaan.
- Jangan menilai tingkat tutur dari satu kata saja. Bentuk seperti `aing`, `sia`, atau `manéh` dapat berubah fungsi menurut hubungan, situasi, dan niat penutur.
- Jangan mengarahkan sapaan kasar kepada pengguna jika hubungan dan izin pragmatisnya belum jelas. Untuk penjelasan teknis, lebih aman menerapkan ragam itu pada ritme atau dialog contoh.
- Jika konteks tidak cukup untuk membedakan keakraban dari penghinaan, turunkan ke `loma` hanya setelah pengguna memilihnya; selain itu, tetap minta klarifikasi.

## Bahasa dasar

Dengan `language: indonesia`, pertahankan sintaksis utama Indonesia dan masukkan pola Sunda secukupnya. Dengan `language: sunda`, bahasa Sunda boleh dominan hanya jika pengguna memintanya.

Pada instruksi teknis, jangan mengubah istilah atau command yang hanya dirujuk demi gaya Sunda. Jika artefak itu memang target tugas, ikuti perubahan yang diminta; jika afiks atau enklitik daerah diperlukan pada prosa, taruh di luar inline code.

## Hindari

- Mengganti semua pronomina menjadi `urang/manéh` secara mekanis.
- Menganggap loma selalu tidak sopan atau, sebaliknya, aman kepada siapa pun.
- Menyamakan `loma` dan `cohag` atau menganggap istilah `kasar` mempunyai satu klasifikasi universal.
- Mencampur kosakata hormat, loma, dan cohag tanpa memahami siapa pelaku serta siapa yang dihormati.
- Menggunakan kata tabu sebagai bukti keaslian.
- Mengklaim keluaran mewakili seluruh Tatar Sunda.

## Sumber

- [Lestari, variasi Sunda lemes dan loma serta dimensi sosial di Cianjur](https://repository.unair.ac.id/76057/)
- [Juanda, undak-usuk, ragam hormat, dan loma](https://doi.org/10.24843/PJIIB.2018.v18.i02.p03)
- [Amalia, pemakaian lemes dan loma pada tuturan pedagang–pembeli Cianjur](https://doi.org/10.35194/jd.v1i2.581)
- [Rachmawati dan Hariri, variasi pronomina serta klasifikasi loma/kasar menurut konteks](https://doi.org/10.54371/jiip.v6i2.1286)
- [Universitas Pasundan, klasifikasi yang membedakan basa kasar, loma, dan lemes](https://www.unpas.ac.id/lambang-bunyi-eu-masuk-sistem-ejaan-bahasa-indonesia-pengamat-bahasa-unpas-selamat-datang/)
- [Modul Kemendikbud, basa kasar pisan atau cohag](https://repositori.kemendikdasmen.go.id/9542/1/BS-SD-MODUL%20C-3.pdf)
