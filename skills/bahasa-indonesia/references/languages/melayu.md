# Panduan Bahasa Populer: Varietas Melayu Indonesia Timur

Kesiapan: beta.

Panduan ini mencakup empat varietas Melayu kontak yang dipakai luas sebagai bahasa sehari-hari: **Melayu Ambon**, **Melayu Manado**, **Melayu Kupang**, dan **Melayu Papua**. Keempatnya adalah varietas bahasa tersendiri dengan sistem pronomina, negasi, aspek, dan posesif yang berbeda dari bahasa Indonesia baku dan berbeda satu sama lain. Jangan memperlakukannya sebagai “aksen Indonesia Timur”.

## Cakupan dan syarat `variety`

- `language: melayu` **wajib** disertai `variety: ambon|manado|kupang|papua` untuk keluaran apa pun. Tanpa `variety`, pertahankan bahasa Indonesia dan minta satu pilihan; jangan membuat campuran generik.
- Entri registry `melayu` juga mencakup varietas lain seperti Melayu Riau, Deli, Pontianak, Palembang, Bangka, dan Melayu Tamiang. Varietas yang tidak ada dalam panduan ini tetap diperlakukan sebagai `catalogued`: kenali namanya, jangan mengarang tuturan.
- Pada `intensity: tipis`, pertahankan tulang punggung teknis dalam bahasa Indonesia dan gunakan paling banyak satu–dua konstruksi varietas yang fungsinya pasti. Naik ke `sedang` hanya jika hubungan tutur dan pronomina sudah jelas; `kental` memerlukan contoh pengguna dan review penutur.
- `regional_voice` tidak mempunyai profil `ambon`, `manado`, `kupang`, atau `papua`. Permintaan “logat Ambon” atau “gaya Manado” berarti `language: melayu` + `variety` pada intensitas tipis, atau tetap netral jika pengguna hanya menginginkan bahasa Indonesia.

## Bentuk inti yang tidak boleh tertukar

Tabel ini merangkum bentuk yang terdokumentasi dalam sumber di bawah. Tabel ini adalah peta perbedaan, bukan kamus; jangan menyusun kalimat hanya dengan mengganti kata Indonesia satu per satu.

| Fungsi | Ambon | Manado | Kupang | Papua |
|---|---|---|---|---|
| saya | `beta` | `kita` | `beta` | `saya` / `sa` |
| kamu (tunggal) | `ale` / `ose` (sensitif) | `ngana` (sensitif) | `lu` | `kamu` / `ko` |
| dia | `dia`; `akang` untuk benda | `dia` | `dia` | `dia` / `de` |
| kita/kami | `katong` | `torang` | `katong` (inklusif) / `botong` (eksklusif) | `kitong` / `tong` (tanpa pembedaan inklusif–eksklusif) |
| kalian | `dorang` (sama dengan mereka); varian `kamong` | `ngoni` | `bosong` | `kamu` / `kam` |
| mereka | `dorang` / `dong` | `dorang` | `dong` | `dorang` / `dong` |
| tidak | `seng` | `nyanda` / `nda` | `sonde` | `tida` / `tra` |
| belum | `balong` | `bolong` | `balom` | `belum` / `blum` |
| sudah (perfektif) | `su` | `so` | `su` | `sudah` / `su` |
| posesif | pemilik `pung` milik | pemilik `pe` milik | pemilik `pung` milik | pemilik `punya` / `pu` milik |

Posesif memakai urutan **pemilik–penanda–milik**: `beta pung laptop`, `kita pe laptop`, `sa pu laptop`. Jangan membalik urutannya mengikuti pola Indonesia `laptop saya`.

Jika satu bentuk saja tidak pasti, tulis klausa itu dalam bahasa Indonesia. Prosa Indonesia dengan satu konstruksi varietas yang benar lebih baik daripada kalimat panjang yang mencampur `seng`, `nyanda`, dan `sonde`.

## Melayu Ambon

- `beta` untuk diri aman dalam hampir semua hubungan. `ale` lebih akrab dan netral; `ose` dapat terasa kasar atau merendahkan bagi sebagian penutur. Jangan memakai `ose` kepada pengguna yang belum menunjukkan keakraban; penghilangan pronomina mitra lebih aman.
- `antua` adalah bentuk orang ketiga yang menghormati; `akang` dipakai untuk acuan bukan orang. Jangan memakai `akang` untuk manusia.
- `katong` untuk kita, `dorang`/`dong` untuk mereka dan juga kalian; `kamong` adalah varian untuk kalian yang dilaporkan sebagian sumber. Pilih satu bentuk dan ikuti contoh pengguna.
- Negasi: `seng` untuk “tidak”, `balong` untuk “belum”, `jang` untuk larangan. `tar`/`tra` adalah negasi tegas dan tidak boleh dipakai sebagai pengganti `seng` di semua posisi.
- Aspek: `su` untuk sudah, `ada` untuk sedang berlangsung, `mau`/`mo` untuk akan atau hendak.
- `par` (untuk) dan `deng` (dengan) hanya dipakai pada intensitas sedang ke atas ketika pola kalimatnya sudah konsisten.
- Jangan mencampur Melayu Ambon dengan bahasa-bahasa asli Maluku Tengah, Melayu Ternate, atau Melayu Papua meskipun sejumlah bentuk mirip.

Contoh tipis:

> `API_TOKEN` balong terbaca di `.env`, jadi `loadConfig` mengembalikan `undefined`. Isi dulu nilainya, baru jalankan `npm test -- config`.

## Melayu Manado

- `kita` berarti **saya**, bukan “kita”. Ini kesalahan paling berbahaya dalam konteks coding agent karena mengubah siapa pelaku tindakan. Jika agent melaporkan “kita so cek `.env`”, maknanya adalah *saya sudah mengecek*; jangan memakainya untuk menyertakan pengguna. Untuk “kita/kami” pakai `torang`.
- `ngana` (kamu) bergantung pada usia, keakraban, pendidikan, dan posisi sosial; kepada orang yang lebih tua atau belum dikenal, bentuk ini dapat dinilai tidak sopan. Tanpa kejelasan hubungan, hilangkan pronomina mitra atau pakai sapaan yang sudah dipakai pengguna.
- `ngoni` untuk kalian, `dorang` untuk mereka.
- Negasi: `nyanda` atau `nda` untuk tidak, `bolong` untuk belum. Aspek: `so` untuk sudah, `ada` untuk sedang berlangsung, `mo` untuk akan.
- Posesif memakai `pe`: `kita pe laptop` berarti laptop saya; `depe` adalah bentuk gabungan `dia pe`.
- Partikel seperti `jo`, `to`, `kwa`, dan `dang` membawa fungsi pragmatik tersendiri. Pakai hanya jika fungsinya pada kalimat itu jelas; jangan menaburkannya sebagai tanda tangan gaya.
- Jangan mencampur Melayu Manado dengan Melayu Gorontalo, bahasa Tondano, Tonsea, atau bahasa Minahasa lain.

Contoh tipis:

> Kita so cek `.env`; `API_TOKEN` memang masih kosong. Isi dulu nilainya, baru jalankan `npm test -- config`.

Kalimat itu menyatakan bahwa **agent** yang sudah mengecek. Jika pengguna yang mengecek, pakai `ngana` hanya bila hubungannya mengizinkan; selain itu tulis dalam bahasa Indonesia.

## Melayu Kupang

- `beta` untuk saya, `lu` untuk kamu, `dia` untuk dia. `lu` bersifat kasual dan lazim antarteman; kepada orang yang dihormati, hilangkan pronomina atau ikuti sapaan pengguna.
- Bedakan `katong` (kita, termasuk mitra tutur) dari `botong` (kami, tidak termasuk mitra tutur). Dalam laporan agent, “kami sudah menjalankan test” umumnya `botong`; jangan memakai `katong` jika pengguna tidak ikut melakukan tindakan.
- `bosong`/`besong` untuk kalian, `dong` untuk mereka.
- Negasi: `sonde` untuk tidak, `balom` untuk belum. Aspek: `su` untuk sudah, `ada` untuk sedang berlangsung.
- Posesif memakai `pung`: `beta pung laptop`.
- `kasi`/`kas` + verba membentuk kausatif, misalnya `kas mati` untuk mematikan. Pola ini juga ada pada varietas lain dengan ejaan berbeda; pilih satu ejaan yang konsisten dengan varietas aktif.
- Jangan menggabungkan Melayu Kupang dengan Ambon atau Papua hanya karena sama-sama memakai `beta`, `su`, atau `pung`. Negasi dan pronomina jamaknya berbeda.

Contoh tipis:

> `API_TOKEN` balom ada di `.env`, jadi `loadConfig` sonde dapat nilai. Isi dulu, baru jalankan `npm test -- config`.

## Melayu Papua

- Setiap pronomina mempunyai bentuk panjang dan pendek: `saya`/`sa`, `kamu`/`ko`, `dia`/`de`, `kitong`/`tong`, `kamu`/`kam`, `dorang`/`dong`. Bentuk pendek lebih lisan; pilih satu kecenderungan dalam satu jawaban.
- `kitong`/`tong` dipakai tanpa pembedaan inklusif–eksklusif. Bentuk `kitorang`/`torang` juga dilaporkan pada sebagian penutur; ikuti contoh pengguna.
- `ko` bersifat akrab. Kepada orang yang lebih tua atau belum dikenal, pakai `kamu`, sapaan yang sudah dipakai pengguna, atau hilangkan pronomina.
- Negasi: `tida`/`tra` untuk tidak dalam klausa verbal, `bukang` untuk negasi nominal, `belum`/`blum` untuk belum. Aspek: `sudah`/`su` untuk sudah, `ada` untuk sedang berlangsung, `mau`/`mo` untuk akan.
- Posesif memakai `punya`/`pu`: `sa pu laptop`.
- Melayu Papua mempunyai variasi internal yang besar antara pesisir, pegunungan, dan kota seperti Jayapura, Sorong, Manokwari, atau Merauke. Jangan menyamakan satu bentuk dengan seluruh Tanah Papua, dan jangan mencampurnya dengan bahasa-bahasa Papua non-Melayu.
- Permintaan “bahasa Papua” tetap merupakan label payung. Hanya “Melayu Papua” atau penyebutan eksplisit yang mengaktifkan varietas ini.

Contoh tipis:

> `API_TOKEN` blum ada di `.env`, jadi `loadConfig` tra dapat nilai. Isi dulu, baru jalankan `npm test -- config`.

## Kalibrasi

- `tipis`: sintaksis Indonesia; satu–dua bentuk inti dari tabel pada posisi yang fungsinya pasti, biasanya negasi, aspek, atau pronomina diri.
- `sedang`: pronomina, negasi, aspek, dan posesif varietas dipakai konsisten di seluruh prosa percakapan; langkah teknis tetap mudah dipindai.
- `kental`: klausa varietas boleh dominan hanya dengan contoh pengguna atau review penutur. Tanpa itu, tetap pada `sedang`.

Artefak teknis yang bukan target tugas tetap persis: jangan mengubah `loadConfig` menjadi ejaan lokal, jangan menempelkan `pung`, `pe`, atau `pu` ke dalam inline code, dan jangan mengganti command.

## Hindari

- Menyamakan keempat varietas sebagai satu “bahasa Indonesia Timur” atau menukar `pung`, `pe`, dan `pu`.
- Membaca `kita` Manado sebagai jamak atau memakainya untuk melibatkan pengguna dalam tindakan yang hanya dilakukan agent.
- Memakai `ose`, `ngana`, `lu`, atau `ko` kepada pengguna yang belum menunjukkan keakraban.
- Memakai `katong` Kupang ketika pengguna tidak termasuk pelaku tindakan.
- Menulis ejaan fonetis atau tanda baca tambahan untuk meniru intonasi.
- Mencampur varietas Melayu dengan bahasa asli Maluku, Minahasa, Timor, atau Papua.
- Menyebut keluaran beta sebagai tuturan penutur asli.

## Sumber

- [APiCS, *Ambon Malay*](https://apics-online.info/surveys/68)
- [Paauw, *The Malay contact varieties of eastern Indonesia: a typological comparison*](https://www.acsu.buffalo.edu/~dryer/PaauwMalayIndonesia.pdf)
- [Mandang, *Personal pronoun ngana and its use in Manado Malay*](https://doi.org/10.24167/celt.v21i2.3271)
- [Shiohara, *Two definite markers in Manado Malay*](https://langsci-press.org/catalog/view/201/1264/1184-1)
- [Jacob dan Grimes, *Developing a role for Kupang Malay*](https://sil-philippines-languages.org/ical/papers/Jacob-Grimes%20Kupang%20Malay.pdf)
- [Pronomina dalam bahasa Melayu Kupang, jurnal Sintesis](https://e-journal.usd.ac.id/index.php/sintesis/article/view/4480)
- [Kluge, *A Grammar of Papuan Malay*](https://langsci-press.org/catalog/book/78)
- [Peta Bahasa Badan Bahasa](https://petabahasa.kemendikdasmen.go.id/databahasa.php)
