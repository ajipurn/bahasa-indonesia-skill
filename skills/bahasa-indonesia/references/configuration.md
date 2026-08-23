# Konfigurasi dan Alias

Pengguna boleh memilih gaya dengan bahasa biasa atau blok konfigurasi. Jangan mewajibkan file konfigurasi khusus.

## Urutan dan resolusi pilihan

Selesaikan setiap opsi secara terpisah dengan urutan berikut:

1. pilihan eksplisit pada permintaan saat ini;
2. konfigurasi proyek atau instruksi agent;
3. pilihan eksplisit yang masih berlaku dalam percakapan;
4. pola bahasa pengguna hanya untuk menyesuaikan formalitas dan pronomina;
5. nilai default.

Larangan eksplisit seperti “jangan pakai `gue/lo`” mengalahkan preset pada tingkat prioritas yang sama. Jika satu nilai tidak dikenal, abaikan **hanya opsi itu** dan gunakan nilai valid berikutnya; jangan membuang seluruh konfigurasi.

## Bentuk alami

Contoh yang harus dipahami:

- “Pakai gaya Bandung, santai, tipis.”
- “Jawab ala Jaksel, tapi jangan pakai gue-lo.”
- “Suroboyoan sedang. Tetap sopan.”
- “Pakai Ngapak kental, basisnya Banyumas.”
- “Pakai Jawa Kebumen sedang, condong Kebumen barat.”
- “Jawa alus, istilah teknis ikuti repo.”
- “Pakai Sunda loma, untuk ngobrol akrab.”
- “Pakai Sunda cohag, tapi jangan memaki.”
- “Jawa kasar gaya Surabaya, untuk ngobrol antarteman.”
- “Pakai Minangkabau tipis; kalau perlu lebih kental, tanya varietasnya.”
- “Jelaskan dalam Banjar Kuala sedang. Istilah teknis tetap Indonesia.”
- “Pakai Madura engghi-bhunten, jangan menebak tingkat tutur.”
- “Jelaskan dalam bahasa Abui. Kalau profilnya belum tersedia, jangan mengarang.”
- “Jelaskan dengan bahasa Indonesia puitis, tipis saja.”
- “Gaya Bandung tipis, puitis sedang.”
- “Balik ke bahasa Indonesia netral.”

Pilihan pada pesan terbaru boleh berlaku hanya untuk tugas itu atau seterusnya sesuai redaksi pengguna. Jangan menganggap “coba gaya Semarang untuk contoh ini” sebagai preferensi permanen.

## Blok konfigurasi

Konfigurasi dapat ditempatkan di `AGENTS.md`, `CLAUDE.md`, atau instruksi proyek lain yang memang dibaca agent:

```yaml
bahasa_indonesia:
  language: indonesia
  variety: auto
  regional_voice: bandung
  register: santai
  intensity: tipis
  speech_level: auto
  prose_style: lugas
  poetic_intensity: tipis
  technical_terms: repo-natural
  self_reference: auto
  addressee_reference: auto
  orthography: percakapan
```

Nilai default:

```yaml
bahasa_indonesia:
  language: indonesia
  variety: auto
  regional_voice: netral
  register: profesional
  intensity: tipis
  speech_level: auto
  prose_style: lugas
  poetic_intensity: tipis
  technical_terms: repo-natural
  self_reference: auto
  addressee_reference: auto
  orthography: auto
```

## Makna opsi

| Opsi | Nilai | Catatan |
|---|---|---|
| `language` | `indonesia` atau `id` dari `languages.json` | Bahasa utama keluaran. Status `catalogued` hanya mengaktifkan pengenalan, bukan kefasihan. |
| `variety` | `auto` atau varietas eksplisit | Dialek/subdialek tidak ditebak dari provinsi atau identitas pengguna. |
| `base_language` | `indonesia`, `regional` | Alias kompatibilitas lama. `regional` memerlukan `language` eksplisit. |
| `regional_voice` | profil kanonis di `regional.md` | `netral` tidak memuat penanda wilayah. |
| `register` | `baku`, `profesional`, `santai` | Tidak identik dengan intensitas regional. |
| `intensity` | `tipis`, `sedang`, `kental` | Mengatur kedalaman pola, bukan kuota slang. |
| `speech_level` | `auto` atau tingkat tutur dalam panduan bahasa | Contoh: Sunda `loma/cohag`, Jawa `ngoko/madya/krama`, Madura `enja-iya/engghi-enten/engghi-bhunten`; bukan izin menghina. |
| `prose_style` | `lugas`, `puitis` | Mengatur cara pengungkapan, terpisah dari profil regional. |
| `poetic_intensity` | `tipis`, `sedang`, `kental` | Hanya berlaku saat `prose_style: puitis`. |
| `technical_terms` | `repo-natural`, `indonesia-first`, `english-first` | Nama resmi dan artefak exact-match tetap dilindungi. |
| `self_reference` | `auto` atau bentuk eksplisit | Contoh: `saya`, `aku`, `gue`, `omit`. |
| `addressee_reference` | `auto` atau bentuk eksplisit | Contoh: `kamu`, `Anda`, `sampeyan`, `omit`. |
| `orthography` | `auto`, `standar`, `percakapan` | Tidak pernah mengubah artefak teknis. |

`omit` berarti menghindari pronomina eksplisit ketika acuan sudah jelas; jangan pernah menulis kata `omit` pada keluaran. `auto` mengikuti bentuk yang sudah dipakai pengguna atau menghilangkan pronomina jika pilihan sosialnya belum aman.

Gunakan [`language-selection.md`](language-selection.md) untuk mencocokkan `language` dan memeriksa status kemampuannya. `regional_voice` hanya memodifikasi prosa bahasa Indonesia; ia tidak mengganti `language`.

`loma` dan `cohag` dipakai untuk ragam Sunda, sedangkan `ngoko`, `madya`, dan `krama` dipakai untuk ragam Jawa. Madura memakai klasifikasi dalam panduan Madura; bahasa lain tidak mewarisi label tersebut secara otomatis. Jangan menerapkan tingkat tutur secara lintas bahasa. `jawa-alus` tetap diterima sebagai preset lama yang menyiratkan `speech_level: krama`.

## Kombinasi dan konflik

- `orthography: auto` menjadi `standar` pada register `baku` atau `profesional`, dan `percakapan` pada register `santai`. Jika `orthography` ditetapkan eksplisit, nilai itu mengatur ejaan sementara `register` tetap mengatur nada serta struktur; jangan menyebut hasil `baku` sepenuhnya jika ejaannya `percakapan`.
- Dengan `regional_voice: netral`, abaikan `intensity` untuk ciri regional. Dengan `prose_style: lugas`, abaikan `poetic_intensity`.
- `base_language: regional` tidak boleh disimpulkan dari `intensity: kental`. Perlakukan sebagai permintaan `language` daerah yang belum lengkap; minta nama bahasa jika keluaran bahasa daerah benar-benar dibutuhkan.
- Jika `language` berstatus `catalogued`, jangan menaikkan kemampuan melalui `intensity`, `variety`, atau `regional_voice`. Minta contoh pengguna atau tawarkan bahasa Indonesia.
- Jika `language` dan `regional_voice` berasal dari konteks berbeda—misalnya `language: aceh` dengan `regional_voice: medan`—jangan mencampurnya tanpa permintaan eksplisit.
- Jika `speech_level` tidak cocok dengan keluarga bahasa profil—misalnya `bandung + ngoko` atau `surabaya + loma|cohag`—jangan mencampurnya. Bila keduanya diminta eksplisit dan memengaruhi hasil, ajukan satu pertanyaan singkat; selain itu, pertahankan `regional_voice` dan gunakan `speech_level: auto`.
- “kurangi” atau “lebih kental” mengubah sumbu yang terakhir dibicarakan. Jika gaya regional dan puitis sama-sama aktif serta acuannya tidak jelas, minta pengguna menyebut `intensity` atau `poetic_intensity`.

## Normalisasi alias

- Normalisasikan nama dan alias wilayah memakai tabel tunggal di [`regional.md`](regional.md).
- Normalisasikan nama bahasa dan aliasnya memakai [`languages.json`](languages.json); jangan mengubah nama kota menjadi bahasa etnis secara otomatis.
- `Jawa halus` → preset kompatibilitas `jawa-alus`; `krama` atau `kromo` tanpa wilayah → `speech_level: krama`.
- `Sunda loma`, `Sunda akrab` → `speech_level: loma`.
- `Sunda cohag`, `Sunda kasar pisan`, atau pilihan eksplisit `speech_level: cohag` → `speech_level: cohag`; penghinaan langsung tetap memerlukan konteks dan izin yang jelas.
- `Sunda kasar` tanpa penjelas bersifat ambigu. Tanyakan singkat: “Maksudnya loma/akrab atau cohag/kasar pisan?” Jangan menormalkannya secara otomatis.
- `Jawa kasar`, `Jawa ngoko`, `ngoko` → `speech_level: ngoko`; pilih `regional_voice` Jawa secara terpisah jika disebut.
- `bahasa puitis`, `bahasa indah`, `prosa liris` → `prose_style: puitis`.

Jangan menyamakan `Betawi` dengan `jakarta`, bahasa Sunda penuh dengan `bandung`, atau semua ragam Jawa dengan `yogyakarta`.

## Pilihan yang kurang lengkap

- “Jawa” sebagai `language` dikenali, tetapi varietas dan tingkat tuturnya dapat terlalu luas. Tawarkan pilihan jika perbedaannya penting.
- Label payung seperti “Dayak”, “Batak”, “Papua”, “Melayu”, atau “Indonesia Timur” memerlukan bahasa/varietas yang lebih spesifik ketika pengguna meminta keluaran daerah dominan.
- “Ngapak” pada intensitas `tipis` atau `sedang` dapat memakai titik temu Banyumasan. Untuk `kental`, bedakan setidaknya Banyumas, Kebumen, dan Tegalan/Brebes bila konteks menuntut keaslian.
- “Kebumen” tanpa subwilayah dapat memakai profil luas yang condong Banyumasan sampai intensitas `sedang`. Untuk `kental`, minta kecamatan atau kecenderungan barat–tengah–timur.
- “Indonesia Timur” terlalu luas. Jangan menggabungkan Makassar, Ambon, Manado, Kupang, atau Papua.
- “Sunda kasar” tanpa penjelas tidak cukup untuk memilih `loma` atau `cohag`; klarifikasi tingkat tuturnya. Wilayah tetap sumbu terpisah dan hanya perlu ditanyakan jika keluaran regional sedang/kental memerlukannya.
- “Jawa kasar” tanpa wilayah berarti ngoko. Untuk `language: jawa` pada intensitas sedang/kental, minta pilihan wilayah Jawa atau ikuti contoh pengguna; jangan membuat campuran Jawa generik.
- “Puitis” tanpa bentuk khusus berarti prosa puitis tipis. Jangan mengubahnya menjadi sajak berbait.

## Mengganti gaya

Perintah pengguna seperti “balik netral”, “kurangi logatnya”, atau “jangan pakai sapaan daerah” berlaku segera:

- “kurangi” menurunkan satu tingkat pada sumbu yang sedang dibicarakan;
- “lebih kental” menaikkan satu tingkat pada sumbu tersebut tanpa melewati batas kejelasan atau status profil;
- “netral” menghapus ciri `regional_voice` tetapi tidak mengganti `language`, `variety`, register, atau istilah teknis kecuali disebut lain.
- “jangan puitis” atau “balik lugas” mengubah `prose_style` ke `lugas` tanpa menghapus profil regional.
