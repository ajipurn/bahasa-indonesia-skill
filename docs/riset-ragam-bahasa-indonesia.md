# Riset Ragam Bahasa Indonesia untuk Coding Agent

Tanggal riset: 22 Agustus 2026

Status: riset awal dan lanjutan sudah diterjemahkan menjadi prototipe V1; profil regional masih menunggu validasi penutur

## Kesimpulan utama

Skill ini sebaiknya tidak dimodelkan sebagai satu pilihan `logat`. Untuk keluaran teks, yang sebenarnya bisa dikendalikan adalah gabungan beberapa hal:

1. tingkat formalitas;
2. hubungan antara agent dan pengguna;
3. pronomina dan sapaan;
4. diksi teknis serta kadar campur bahasa Inggris;
5. ciri regional pada kosakata, morfologi, dan partikel pragmatik;
6. intensitas ciri regional.

Istilah yang paling tepat untuk UI adalah **gaya bahasa regional**. Kata **logat** masih boleh dipakai sebagai label yang mudah dipahami pengguna, tetapi model internalnya perlu lebih rinci. Aksen terutama menyangkut pelafalan, tekanan, dan intonasi; coding agent berbasis teks tidak benar-benar menghasilkan aksen kecuali melalui audio atau transkripsi fonetis.

Keputusan versi awal:

- Jadikan `netral-profesional` sebagai default.
- Pisahkan pilihan `baku`, `profesional`, dan `santai` dari pilihan regional.
- Gunakan `jakarta`, `bandung`, `medan`, dan `makassar` sebagai fondasi yang terdokumentasi langsung; tambahkan profil beta `jaksel`, `surabaya`, `semarang`, `yogyakarta`, `jawa-alus`, `banyumasan`, dan `kebumen` setelah riset lanjutan.
- Perlakukan Melayu Ambon, Melayu Manado, Melayu Kupang, dan Melayu Papua sebagai varietas bahasa tersendiri yang hanya aktif jika dipilih secara eksplisit—bukan sebagai satu profil generik “Indonesia Timur”.
- Jangan merilis profil payung `jawa`, `sunda`, `sumatra`, atau `timur`. Masing-masing menutupi perbedaan internal yang terlalu besar.

## 1. Istilah yang perlu dibedakan

| Istilah | Makna kerja untuk skill | Implikasi |
|---|---|---|
| **Aksen** | Ciri pelafalan, tekanan, dan intonasi | Relevan untuk suara; jangan disimulasikan lewat salah eja secara default. |
| **Logat** | Dalam penggunaan umum dapat merujuk pada aksen atau dialek | Cocok sebagai label UI yang ramah, tetapi terlalu ambigu untuk konfigurasi internal. |
| **Dialek/regiolek** | Varian berdasarkan kelompok penutur atau wilayah; dapat berbeda pada bunyi, kosakata, morfologi, dan tata bahasa | Dapat direpresentasikan sebagian dalam teks. |
| **Ragam/register/laras** | Varian berdasarkan pemakaian, topik, media, tujuan, dan hubungan antarpenutur | Harus menjadi sumbu tersendiri dari wilayah. |
| **Idiolek** | Kebiasaan bahasa khas seorang individu | Agent dapat meniru pola pengguna secara terbatas, tetapi tidak boleh menyimpulkan identitas pengguna. |

[Balai Bahasa Jawa Tengah membedakan dialek sebagai jenis tuturan dan aksen/logat sebagai cara bertutur](https://balaibahasajateng.kemendikdasmen.go.id/2020/03/dialek-atau-bahasa/). [Petunjuk KBBI VI](https://kbbi.kemendikdasmen.go.id/Beranda/PetunjukPemakaianKBBIPDF) juga membedakan varian menurut pemakai—dialek regional, sosial, temporal, dan idiolek—dari ragam menurut pemakaian.

### Lapisan variasi yang dapat muncul

| Lapisan | Contoh | Dapat dikendalikan dalam teks? | Risiko |
|---|---|---:|---|
| Fonologi dan prosodi | perubahan vokal, tekanan, intonasi | Tidak secara langsung | Penulisan fonetis mudah berubah menjadi parodi. |
| Ortografi percakapan | `sudah` → `udah`, `tidak` → `nggak` | Ya | Dapat mengurangi keterbacaan dan mengganggu pencarian teks. |
| Diksi | `lihat`/`tengok`, `pasar`/`pajak` dalam ragam Medan | Ya | Satu kata bisa berbeda makna antardaerah. |
| Morfologi | sufiks `-in` dalam ragam Jakarta; klitik `-mi`, `-ji`, `-pi` di Makassar | Ya | Salah posisi dapat mengubah makna atau terdengar palsu. |
| Sintaksis | susunan posesif atau penghilangan unsur tertentu | Ya | Dampaknya lebih besar daripada sekadar “rasa” regional. |
| Pronomina dan sapaan | `saya`, `aku`, `gue`; `Anda`, `kamu`, `lo`, nama, gelar | Ya | Mengandung makna keakraban, jarak, umur, dan kuasa. |
| Partikel pragmatik | `sih`, `dong`, `mah`, `atuh`, `ji` | Ya | Bukan hiasan; fungsi bergantung pada konteks dan posisi. |
| Campur kode | istilah Inggris di dalam kalimat Indonesia | Ya | Terlalu banyak terasa dibuat-buat; terlalu sedikit dapat mengaburkan istilah teknis. |

## 2. Lanskap sosiolinguistik Indonesia

### Indonesia sangat multibahasa

Badan Bahasa mencatat [718 bahasa daerah dari 2.560 daerah pengamatan](https://petabahasa.kemendikdasmen.go.id/). Angka itu tidak memasukkan dialek dan subdialek. Konsekuensinya, tidak masuk akal menganggap ada satu cara informal yang mewakili semua penutur bahasa Indonesia.

Bahasa daerah juga bukan sekadar sumber kosakata dekoratif. Sebagian penutur memakai bahasa Indonesia sebagai bahasa kedua; sebagian lain tumbuh dengan bahasa Indonesia regional sebagai bahasa pertama. Kontak yang berbeda melahirkan ragam perkotaan yang berbeda pula.

### Baku dan informal membentuk kontinum

Bahasa Indonesia baku banyak dipakai dalam pendidikan, administrasi, media, dan situasi resmi. Ragam percakapan lebih beragam secara regional. Sneddon menjelaskan hubungan ini sebagai kontinum: ketika situasi makin formal, ciri informal berkurang secara bertahap, bukan berpindah lewat satu sakelar biner. Ia juga menegaskan bahwa tidak ada satu ragam informal standar, walaupun bahasa Indonesia Jakarta berpengaruh luas. Lihat [“Diglossia in Indonesian”](https://brill.com/view/journals/bki/159/4/article-p519_4.pdf).

Prinsip resmi “baik dan benar” juga tidak berarti “selalu baku”. “Baik” berkaitan dengan kecocokan terhadap situasi, mitra, sarana, tempat, dan topik; “benar” berkaitan dengan kaidah yang dipakai. Penjelasan ini dirangkum oleh [Balai Bahasa Provinsi Maluku](https://balaibahasaprovinsimaluku.kemendikdasmen.go.id/2021/03/bahasa-indonesia-yang-baik-dan-benar/).

Implikasi untuk agent: gaya formal bukan selalu gaya terbaik, dan gaya santai bukan otomatis salah.

### Ragam Jakarta bukan sinonim bahasa Indonesia informal

Bahasa Indonesia Jakarta muncul dari kontak bahasa Indonesia baku dan Melayu Betawi. Ragam ini memiliki norma dan variasinya sendiri. Penelitian korpus menunjukkan variasi antarpembicara sekaligus variasi pada pembicara yang sama; pilihan pronomina dapat berubah menurut lawan bicara dan percakapan. Lihat [Abtahian dkk. tentang pronomina orang pertama](https://benjamins.com/catalog/aplv.20012.rav) dan [Cohn, Vogel, dan Abtahian tentang pola variasi](https://doaj.org/article/0ebfdf4fa4ad49ab9fada88cb7c18650).

Karena itu, `gue/lo + nggak + dong` bukan rumus universal untuk bahasa santai. Pemakaian otomatis gaya Jakarta sebagai default justru menghapus keragaman yang ingin didukung skill ini.

### Pronomina adalah keputusan sosial

Bahasa Indonesia memiliki sistem acuan orang yang terbuka. Nama, gelar, istilah kekerabatan, pronomina, atau penghilangan subjek dapat dipilih menurut hubungan dan tindakan percakapan. [Ewing dan Djenar](https://doi.org/10.1075/pbns.304.11ewi) menunjukkan bahwa bentuk dan penempatan sapaan ikut membawa sikap penutur. Dalam percakapan, `Anda` dan `Saudara` cenderung terbatas pada situasi formal, sementara pronomina kedua sering dihilangkan ketika acuannya sudah jelas; lihat [Hamdani tentang sapaan dalam pertanyaan bahasa Indonesia](https://www.sciencedirect.com/science/article/pii/S0378216622002053).

Implikasinya:

- Jangan mengganti semua `saya/Anda` secara mekanis menjadi pasangan regional.
- Penghilangan pronomina sering lebih netral daripada memilih sapaan yang salah.
- Sapaan `Pak`, `Bu`, `Kak`, `Mas`, `Mbak`, `Bang`, dan bentuk regional lain harus mengikuti konteks, bukan dijadikan pemanis.

### Partikel pragmatik bukan konfeti

Partikel seperti `lho`, `kok`, `sih`, `dong`, `deh`, dan `kan` mengatur informasi, asumsi bersama, sikap, serta daya tindak suatu ujaran. Fungsi sebuah partikel juga bergantung pada posisi dan konteks. Kajian [Karaj](https://doi.org/10.17510/wacana.v22i2.909) dan [Mutiara](https://doi.org/10.51817/kimli.vi.73) menunjukkan bahwa partikel yang sama dapat menjalankan beberapa fungsi percakapan.

Agent tidak boleh sekadar menambahkan partikel setiap beberapa kalimat. Profil regional perlu menjelaskan kapan suatu partikel boleh muncul dan kapan harus dihindari.

### Campur Indonesia–Inggris adalah variabel gaya, bukan kesalahan otomatis

Dalam data percakapan lintas enam kota, perpindahan Indonesia–Inggris paling sering terjadi pada unsur kecil di dalam kalimat, terutama nomina dan frasa nomina. Temuan tersebut tidak membuktikan bahwa semua istilah harus dibiarkan dalam bahasa Inggris; temuan itu menunjukkan bahwa campur kode memang bagian dari praktik komunikasi nyata. Lihat [Sahib dkk.](https://doi.org/10.1155/2021/3402485).

Badan Bahasa sendiri menyediakan [PASTI](https://pasti.kemendikdasmen.go.id/home.php), yang saat riset ini memuat lebih dari 172 ribu padanan pada 59 ranah. Maka, pilihan yang masuk akal untuk agent bukan `semua Inggris` versus `semua Indonesia`, melainkan:

- `repo-natural`: ikuti istilah yang dominan di repo dan komunitas;
- `indonesia-first`: pakai padanan Indonesia yang mudah dipahami, lalu beri istilah Inggris bila perlu;
- `english-first`: pertahankan jargon Inggris, dengan kalimat penghubung berbahasa Indonesia.

Nama API, identifier, nama paket, perintah, path, dan pesan error asli tetap tidak boleh diterjemahkan.

## 3. Model konfigurasi yang disarankan

Gunakan preset sederhana di depan, tetapi simpan beberapa sumbu di bawahnya.

| Sumbu | Nilai awal yang disarankan | Default |
|---|---|---|
| `register` | `baku`, `profesional`, `santai` | `profesional` |
| `regional_voice` | `netral`, `jakarta`, `bandung`, `medan`, `makassar` | `netral` |
| `intensity` | `tipis`, `sedang`, `kental` | `tipis` |
| `technical_terms` | `repo-natural`, `indonesia-first`, `english-first` | `repo-natural` |
| `self_reference` | `auto` atau bentuk eksplisit | `auto` |
| `addressee_reference` | `auto`, `omit`, atau bentuk eksplisit | `auto` |
| `orthography` | `standar`, `percakapan` | mengikuti `register` |

Contoh permintaan pengguna:

- “Pakai gaya Medan, santai, tipis.”
- “Bahasa Indonesia baku; istilah teknis tetap mengikuti repo.”
- “Gaya Jakarta sedang, tapi jangan pakai `gue/lo`.”
- “Pakai Melayu Ambon untuk penjelasannya, kode tetap apa adanya.”

Urutan keputusan:

1. pilihan eksplisit pada permintaan saat ini;
2. konfigurasi proyek;
3. pilihan yang sudah ditegaskan dalam percakapan;
4. pola bahasa pengguna yang benar-benar terlihat, hanya untuk menyesuaikan tingkat formalitas;
5. fallback `netral-profesional`.

Agent boleh menyesuaikan formalitas dari tulisan pengguna. Agent tidak boleh menyimpulkan suku, asal daerah, umur, gender, atau kelas sosial pengguna lalu memilih profil regional tanpa diminta.

## 4. Kandidat profil dan tingkat kesiapan

### Profil inti versi awal

| Profil | Dasar linguistik | Ciri yang layak dimodelkan | Batasan |
|---|---|---|---|
| `netral` | Bahasa Indonesia lintas daerah | struktur ringkas, pronomina minimal, ejaan sesuai konteks, tanpa penanda regional | Bukan berarti harus sangat formal. |
| `jakarta` | Ragam kontak antara bahasa Indonesia baku dan Melayu Betawi | pilihan `gue/gua/aku/saya`, `lo/lu/kamu`, bentuk percakapan, afiks informal, partikel Jakarta secara kontekstual | Jangan menyebutnya Betawi; jangan menganggap semua penutur Jakarta memakai pasangan `gue/lo`. |
| `bandung` | Bahasa Indonesia bercorak Sunda dalam percakapan Bandung | elemen Sunda terpilih, terutama partikel dan kosakata yang telah terdokumentasi | Pemakaian berbeda menurut identitas, lawan bicara, topik, dan situasi; jangan menabur `mah`, `teh`, atau `atuh` secara acak. |
| `medan` | Ragam lisan bahasa Indonesia di Medan yang terbentuk dalam lingkungan multietnik | `aku/kau` atau bentuk yang disepakati, penyangat `kali`, partikel `lah/pula`, dan diksi lokal yang tidak ambigu dalam konteks | Medan tidak identik dengan Batak. `Horas` tidak mewakili semua orang Medan; `bah` juga tidak boleh menjadi stempel otomatis. |
| `makassar` | Bahasa Indonesia dialek Bugis–Makassar | klitik `-mi`, `-ji`, dan `-pi` dengan fungsi semantis yang benar; pola sapaan yang tervalidasi | Klitik bukan dekorasi: `-mi` dapat menandai perfektif, `-ji` pembatas/penegas, dan `-pi` futuristik. Perlu validasi penutur sebelum dipakai kental. |

Sumber profil:

- Jakarta: [Abtahian dkk.](https://benjamins.com/catalog/aplv.20012.rav) dan [Cohn dkk.](https://doi.org/10.15026/122194).
- Bandung: [Michael C. Ewing, “Features of Indonesian in Bandung”](https://tufs.repo.nii.ac.jp/record/1435/files/04Ewing.pdf). Studi ini juga menekankan bahwa seorang penutur tidak memiliki satu “bahasa Indonesia lokal” yang selalu tetap; pilihan unsur berubah mengikuti kebutuhan interaksi.
- Medan: [Amran Purba, “Dialek Medan: Kosakata dan Lafalnya”](https://ojs.badanbahasa.kemendikdasmen.go.id/jurnal/index.php/medanmakna/article/view/830). Studi ini mendokumentasikan perbedaan bunyi, bentuk, dan leksikon sekaligus mengingatkan bahwa sapaan Batak tidak otomatis mewakili Medan.
- Makassar: [Muhammad Ali Imran, tesis tentang `-mi`, `-ji`, dan `-pi`](https://etd.repository.ugm.ac.id/penelitian/detail/79172).

### Profil eksplisit lanjutan

| Profil | Status yang tepat | Ciri penting | Catatan desain |
|---|---|---|---|
| `melayu-ambon` | Varietas Melayu regional, bukan sekadar aksen Indonesia | `beta`, `katong`, `su`, `seng`, penanda posesif `pung` | `ale/ose` hanya untuk konteks akrab dan dapat dinilai tidak sopan. Aktifkan hanya atas permintaan eksplisit. |
| `melayu-manado` | Varietas Melayu regional | `kita` sebagai orang pertama tunggal, `ngana`, `torang`, penanda posesif `pe`, aspek `so` | Makna `kita` berlawanan dengan bahasa Indonesia baku. Kesalahan dapat mengubah pelaku tindakan. |
| `melayu-kupang` | Varietas Melayu regional | `beta`, `katong`, `lu`, `dong`, penanda posesif `pung` | Jangan digabung dengan Ambon atau Papua meski ada kemiripan bentuk. |
| `melayu-papua` | Varietas Melayu nonbaku dengan tata bahasa terdokumentasi | bentuk panjang/pendek seperti `saya/sa`, `dia/de`, `dorang/dong`; `ko`, `tra`, `su`, posesif `pu` | Perlu referensi grammar tersendiri dan validasi penutur Papua dari wilayah yang sesuai. |

Sumber awal:

- [APiCS: Ambon Malay](https://apics-online.info/surveys/68) menjelaskan kedudukan sosial, pronomina, posesif, negasi, dan penanda aspek Melayu Ambon.
- [Mandang tentang `ngana` dalam Melayu Manado](https://doi.org/10.24167/celt.v21i2.3271) menunjukkan bahwa pemakaiannya bergantung pada umur, keakraban, pendidikan, dan posisi sosial.
- [Jacob dan Grimes tentang Melayu Kupang](https://citeseerx.ist.psu.edu/document?doi=19ed84021924cdc3bbe8ed8bd29ab81cd2e9292b&repid=rep1&type=pdf) membedakan sistem pronomina dan konstruksi posesifnya dari bahasa Indonesia.
- [Angela Kluge, *A Grammar of Papuan Malay*](https://langsci-press.org/catalog/book/78) memberi deskripsi berbasis korpus tentang fonologi, pronomina, posesif, dan struktur klausa Melayu Papua.

### Temuan lanjutan untuk profil Jawa dan Jaksel

- `jaksel` lebih tepat dimodelkan sebagai sosiolek campur Indonesia–Inggris daripada dialek geografis. [Studi Indoglish di Jaksel](https://journal.ikipsiliwangi.ac.id/index.php/project/article/view/7239/0) mendokumentasikan fenomenanya, tetapi memakai korpus kecil sehingga profil tidak boleh direduksi menjadi daftar filler Inggris.
- Surabaya/Arekan memiliki strategi kesantunan sendiri. [Krauße](https://doi.org/10.17510/wacana.v19i1.615) menunjukkan bahwa anggapan Surabayaan “tidak sopan” dari sudut Jawa Tengah adalah mitos; sistemnya lebih dekat pada pembedaan akrab–hormat yang bersifat biner.
- Semarangan mempunyai partikel dengan fungsi berbeda. [Kajian UGM](https://etd.repository.ugm.ac.id/penelitian/detail/226491) menemukan sebelas partikel, sedangkan [kajian Undip](https://eprints.undip.ac.id/81469/3/BAB_II.pdf) merinci antara lain `ik` untuk penegasan afektif dan `ok` untuk penegasan pernyataan/tindakan.
- Yogyakarta dan Surakarta berkerabat dekat tetapi bukan satu bentuk identik. [Kajian isolek Yogyakarta–Surakarta](https://eprints.uny.ac.id/4963/1/STATUS_ISOlEK_YOGYAKARTA-SURAKARTA.pdf) mencatat `je` dan `gek` sebagai ciri Yogyakarta.
- “Jawa alus” adalah tingkat tutur, bukan daerah. Sistem ngoko–madya–krama membawa makna hubungan sosial dan tidak aman disimulasikan lewat substitusi kata sederhana; lihat [Errington](https://doi.org/10.1016/B978-0-12-491280-9.50018-2).
- “Ngapak” perlu diberi nama kanonis `banyumasan` dan tidak dijadikan suara komedi. Studi identitas [Nugroho dan Kusuma](https://doi.org/10.31315/jik.v21i2.4556) juga menunjukkan pemakaiannya fleksibel menurut mitra dan situasi.
- Kebumen layak menjadi profil tersendiri ketika pengguna menyebut wilayahnya, tetapi bukan karena seluruh kabupaten membentuk satu dialek yang seragam. [Pujiyatno dan Poedjosoedarmo](https://doi.org/10.30595/lks.v2i1.2252) menggambarkan Kebumen sebagai batas/percampuran dua dialek dan menemukan pengaruh bandek pada leksikon serta tingkat tutur. Penelitian 26 kecamatan oleh [Rahayu dan Munawarah](https://linguistik.fib.ui.ac.id/wp-content/uploads/sites/46/2018/01/202-207-DIA_Ratih-Rahayu-dan-Sri-Munawarah.pdf) menilai ragam Kebumen secara umum sebagai Banyumasan/Ngapak yang dominan, dengan variasi fonologis dan leksikal dari Banyumasan serta Yogyakarta; Prembun disebut daerah transisi. [Purwaningrum](https://doi.org/10.31294/w.v12i2.8096) juga menunjukkan pertukaran leksikon akibat pengaruh Banyumas dan Purworejo serta faktor mitra dan situasi tutur. Implikasi desainnya: default Kebumen condong Banyumasan, kecenderungan timur dapat lebih bandek, dan intensitas `kental` memerlukan subwilayah atau contoh pengguna.

### Profil yang belum layak menjadi satu tombol

- `jawa`: perlu dipecah setidaknya menurut kawasan dan praktik tutur, misalnya Solo–Yogyakarta dan Surabaya/Arekan. Bahasa Jawa sendiri memiliki tingkat tutur, sementara praktik bilingual Jawa–Indonesia tidak memetakan hierarki sosial secara mekanis. Lihat [Goebel tentang percakapan bilingual Jawa–Indonesia](https://doi.org/10.1017/S004740450707037X) dan [Hoogervorst tentang slang Jawa Timur](https://scholarhub.ui.ac.id/wacana/vol15/iss1/7/).
- `sunda`: untuk versi awal lebih aman memakai label berbasis lokasi `bandung`, karena bahasa Sunda memiliki dialek regional dan tingkat tutur internal. Profil bahasa Sunda penuh berbeda dari bahasa Indonesia bercorak Sunda.
- `sumatra`, `kalimantan`, dan `indonesia-timur`: wilayah ini terlalu luas dan beragam untuk menjadi satu profil yang bermakna.
- `minang`, `banjar`, `bali`, `aceh`, `palembang`, dan profil lain: layak ditambah setelah ada korpus, panduan pragmatik, serta penilaian penutur setempat.

## 5. Prinsip keselamatan budaya dan kualitas

1. **Opt-in untuk ciri regional.** Jangan menebak profil dari nama, lokasi, atau dugaan etnis pengguna.
2. **Tidak memakai “kata ikon” sebagai kostum.** Satu-dua kata seperti `bah`, `euy`, `rek`, atau `ji` tidak otomatis membuat teks autentik.
3. **Tidak menulis aksen secara fonetis secara default.** Perubahan ejaan untuk meniru bunyi mudah terasa merendahkan dan dapat merusak aksesibilitas.
4. **Tidak menyamakan kota dengan satu etnis.** Medan bukan sinonim Batak; Jakarta bukan sinonim Betawi; Makassar sebagai kota juga dihuni komunitas yang beragam.
5. **Kejelasan teknis menang.** Peringatan keamanan, instruksi destruktif, diagnosis, nama simbol, dan data terstruktur tidak boleh menjadi ambigu demi gaya.
6. **Kode dan artefak exact-match dilindungi.** Jangan mengubah code block, identifier, path, command, pesan error, nama API, atau kutipan pengguna.
7. **Satu profil tidak berarti satu pronomina.** Pengguna boleh memilih gaya Jakarta tanpa `gue/lo`, atau gaya Medan tanpa `aku/kau`.
8. **Intensitas bukan jumlah slang.** Intensitas lebih baik mengatur seberapa jauh morfologi, partikel, dan susunan kalimat regional dipakai.
9. **Jangan mencampur varietas tanpa permintaan.** Bentuk Ambon, Manado, Kupang, dan Papua yang mirip tetap memiliki sistem berbeda.
10. **Fallback harus jujur.** Jika profil belum terdokumentasi, gunakan bahasa Indonesia netral dan minta contoh gaya hanya bila pilihan itu benar-benar penting.

Risiko model bukan sekadar teoretis. [IndoRobusta](https://arxiv.org/abs/2311.12405) menemukan bias kemampuan model terhadap campur Indonesia–Inggris dibanding campur bahasa daerah. [IndoSafety](https://aclanthology.org/2025.emnlp-main.465/) menemukan kelemahan keselamatan yang lebih besar pada ragam percakapan dan bahasa lokal. [Lorax](https://research.google/pubs/lorax-a-multitask-multilingual-benchmark-suite-for-20-indonesian-languages/) juga menunjukkan bahwa tugas pada 20 bahasa Indonesia tetap menantang bagi model multibahasa. Karena itu, profil regional perlu diuji sebagai kemampuan, bukan diasumsikan benar hanya karena terdengar meyakinkan.

## 6. Audit skill sebelum refactor

Skill lama sudah punya beberapa fondasi kuat:

- melindungi kode, path, identifier, dan pesan error;
- menghindari terjemahan harfiah bahasa Inggris;
- menjelaskan beberapa aturan EYD yang relevan;
- menargetkan bahasa developer yang ringkas dan tidak kaku.

Perubahan yang kemudian diterapkan pada prototipe:

1. **Aturan istilah teknis terlalu mutlak.** “Semua jargon tetap Inggris” perlu menjadi pilihan `technical_terms`, bukan kebenaran universal.
2. **Gaya dan bahasa tercampur.** Larangan basa-basi, panjang kalimat, dan nada semi-formal adalah keputusan gaya; semuanya perlu tunduk pada `register` dan kebutuhan tugas.
3. **Belum ada router profil.** Tidak ada cara memilih wilayah, intensitas, pronomina, atau kadar campur kode.
4. **Larangan bentuk lisan terlalu luas.** Bentuk `nge-` atau afiks informal dapat sah dalam profil santai tertentu, walau tidak cocok untuk ragam baku.
5. **Aturan angka dan tanggal perlu dibatasi pada prosa.** Literal program, output command, format mesin, dan format proyek tidak boleh diubah.
6. **Pronomina belum cukup kontekstual.** Menghilangkan subjek sering efektif, tetapi bukan satu-satunya pilihan alami di semua ragam.
7. **Belum ada pengaman anti-stereotip.** Skill perlu membedakan bahasa Indonesia regional dari bahasa daerah dan varietas Melayu regional.
8. **Contoh hanya mewakili satu suara.** Perlu contoh pembanding yang sudah divalidasi penutur untuk setiap profil.

Catatan EYD: aturan tanda hubung pada bentuk seperti `di-deploy` memang sejalan dengan [EYD V](https://ejaan.kemendikdasmen.go.id/eyd/penggunaan-tanda-baca/tanda-hubung/), yang memakai tanda hubung ketika unsur bahasa Indonesia dirangkai dengan unsur asing, daerah, atau slang. Namun, pilihan antara bentuk berimbuhan, verba telanjang, atau padanan Indonesia tetap bergantung pada register dan kebiasaan repo.

## 7. Struktur skill yang diterapkan

Gunakan progressive disclosure agar semua profil tidak dimuat pada setiap jawaban.

```text
bahasa-indonesia/
├── SKILL.md
└── references/
    ├── core.md
    ├── configuration.md
    ├── evaluation.md
    ├── javanese.md
    └── profiles/
        ├── jakarta.md
        ├── jaksel.md
        ├── bandung.md
        ├── medan.md
        ├── makassar.md
        ├── surabaya.md
        ├── semarang.md
        ├── yogyakarta.md
        ├── jawa-alus.md
        ├── banyumasan.md
        └── kebumen.md
```

- `SKILL.md`: tujuan, default, cara memilih mode, aturan perlindungan kode, dan router referensi.
- `core.md`: ejaan, kalke, pronomina, istilah teknis, serta perbedaan register yang berlaku lintas profil.
- `configuration.md`: opsi, default, alias, dan aturan mengganti gaya.
- `javanese.md`: batas bersama antara dialek wilayah dan tingkat tutur Jawa.
- Satu file per profil: ciri yang boleh dipakai, fungsi pragmatik, larangan, contoh teruji, dan sumber.
- `evaluation.md`: skenario uji serta rubrik penilaian.

Profil Melayu Ambon, Manado, Kupang, atau Papua baru ditambahkan sebagai referensi terpisah saat benar-benar didukung. Belum ada kebutuhan akan script deterministik pada tahap ini.

## 8. Rencana validasi

### Uji perilaku

Uji setiap profil pada jenis tugas yang berbeda:

- menjelaskan bug;
- melaporkan perubahan kode;
- memberi peringatan sebelum tindakan destruktif;
- menulis komentar review;
- menulis README atau dokumentasi;
- mengajukan pertanyaan klarifikasi;
- menolak permintaan berbahaya tanpa kehilangan gaya yang wajar.

Untuk setiap tugas, bandingkan `tipis`, `sedang`, dan `kental`. Profil harus mempertahankan fakta, nama simbol, perintah, dan tingkat kepastian yang sama.

### Rubrik manusia

Minta penutur yang akrab dengan praktik bahasa di wilayah terkait menilai:

1. kealamian;
2. ketepatan makna partikel dan pronomina;
3. konsistensi regional;
4. kecocokan formalitas;
5. kejernihan teknis;
6. ada atau tidaknya stereotip/karikatur.

Gunakan lebih dari satu penilai jika memungkinkan. Jangan memberi tahu mereka kata regional apa yang “seharusnya” muncul; ukur keseluruhan hasil, bukan kepatuhan pada daftar slang.

### Pemeriksaan otomatis

- Code block dan inline code tidak berubah ketika gaya diganti.
- Identifier, path, command, URL, nomor versi, dan pesan error tetap identik.
- Profil tidak bocor ke commit message atau konten yang harus mengikuti konvensi repo.
- Mode tidak memasukkan pronomina/sapaan yang dilarang oleh override pengguna.
- Profil tak dikenal kembali ke `netral-profesional` tanpa mengarang ciri.

Hindari tes yang hanya mencari keberadaan kata `dong`, `mah`, `bah`, atau `ji`. Tes seperti itu justru mendorong keluaran yang karikatural.

## 9. Keputusan implementasi V1

1. Isi skill dibuat portabel sebagai Agent Skill dengan sumber kanonis di `skills/bahasa-indonesia`, bukan di direktori milik satu agent.
2. Distribusi lintas-agent memakai `npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia`; CLI menentukan lokasi instalasi Claude Code, Codex, dan agent lain.
3. Pilihan gaya dapat diberikan per permintaan maupun disimpan di instruksi proyek seperti `AGENTS.md` atau `CLAUDE.md`.
4. Intensitas `kental` boleh memperluas code-mixing dan struktur regional dalam prosa, tetapi pergantian bahasa dasar hanya dilakukan jika pengguna memintanya.
5. Semua profil regional tetap beta, dan `jawa-alus` eksperimental, sampai ada review penutur yang relevan.
6. `kebumen` dirilis sebagai profil beta tersendiri dengan default condong Banyumasan; subwilayah wajib untuk intensitas `kental` agar kontinum barat–timur tidak dipalsukan.
7. Melayu Ambon, Manado, Kupang, dan Papua belum dirilis. Masing-masing akan membutuhkan profil tersendiri, bukan payung “Indonesia Timur”.

Default tetap `netral + profesional + repo-natural + tipis`. Pekerjaan berikutnya adalah forward testing dan review penutur, bukan menambah slang.
