# Router Gaya Regional Bahasa Indonesia dan Tingkat Tutur

Baca ini hanya ketika pengguna memilih logat, gaya wilayah, sosiolek, atau tingkat tutur daerah. Selalu baca [`naturalness.md`](naturalness.md), lalu muat **satu** profil wilayah dari tabel jika `regional_voice` bukan `netral`.

Tabel ini bukan katalog bahasa daerah. Gunakan [`language-selection.md`](language-selection.md) untuk memilih bahasa utama. `medan` tidak berarti bahasa Batak, `makassar` tidak berarti bahasa Makassar atau Bugis, dan `bandung` tidak berarti bahasa Sunda penuh.

## Normalisasi profil

| Nilai kanonis | Alias umum | Profil |
|---|---|---|
| `jakarta` | bahasa gaul Jakarta | [Jakarta](profiles/jakarta.md) |
| `jaksel` | anak Jaksel, South Jakarta, Indoglish | [Jaksel](profiles/jaksel.md) |
| `bandung` | gaya Bandung, Indonesia bercorak Sunda | [Bandung](profiles/bandung.md) |
| `medan` | gaya Medan | [Medan](profiles/medan.md) |
| `makassar` | gaya Makassar, Bugis–Makassar | [Makassar](profiles/makassar.md) |
| `surabaya` | Suroboyoan, Surabayaan, Jawa Surabaya, Arekan | [Surabaya](profiles/surabaya.md) |
| `semarang` | Semarangan, Jawa Semarang | [Semarang](profiles/semarang.md) |
| `yogyakarta` | Jogja, Yogya, Jawa Yogyakarta | [Yogyakarta](profiles/yogyakarta.md) |
| `jawa-alus` | Jawa halus | [Jawa alus](profiles/jawa-alus.md) |
| `banyumasan` | Ngapak, Jawa Ngapak, Banyumas | [Banyumasan](profiles/banyumasan.md) |
| `kebumen` | Jawa Kebumen, Kebumenan, Ngapak Kebumen | [Kebumen](profiles/kebumen.md) |

`jaksel` adalah sosiolek campur kode, bukan dialek geografis murni. `jawa-alus` adalah preset kompatibilitas untuk kesantunan berbasis krama, bukan wilayah; penyebutan `krama` atau `kromo` saja menetapkan `speech_level: krama` tanpa menebak wilayah.

Jika profil tidak dikenal, kembali ke `netral`. Jangan menciptakan ciri dari stereotip. Jika pengguna hanya meminta “logat daerah”, tawarkan daftar singkat yang relevan dan minta satu pilihan; jangan menampilkan menu ini pada percakapan Indonesia biasa.

## Muat panduan bahasa

- Untuk `surabaya`, `semarang`, `yogyakarta`, `jawa-alus`, `banyumasan`, `kebumen`, atau `speech_level: ngoko|madya|krama`, baca [`javanese.md`](javanese.md).
- Untuk `bandung`, permintaan Sunda, atau `speech_level: loma|cohag`, baca [`sundanese.md`](sundanese.md).
- Jangan menerapkan `loma|cohag` pada profil Jawa atau `ngoko|madya|krama` pada profil Sunda. Jika dua pilihan eksplisit bertentangan, jangan mencampurnya; ikuti aturan konflik di [`configuration.md`](configuration.md).

## Terapkan intensitas

- `tipis`: struktur utama tetap bahasa Indonesia; ciri regional hadir sesekali ketika fungsinya jelas.
- `sedang`: partikel, diksi, pronomina yang cocok, dan beberapa frasa regional boleh membentuk ritme jawaban.
- `kental`: klausa regional dapat dominan hanya jika pengguna memintanya secara eksplisit dan profil atau contoh pengguna menyediakan pola yang cukup.

Intensitas mengatur kedalaman pola, bukan kuota slang. Jangan menaikkannya hanya karena jawaban panjang.

## Makna status profil

- `beta`: boleh digunakan pada `tipis` atau `sedang`. Gunakan `kental` hanya atas permintaan eksplisit dan setelah syarat subwilayah, hubungan sosial, atau contoh pada profil terpenuhi.
- `eksperimental`: gunakan `tipis` sebagai batas aman. Intensitas lebih tinggi atau `language` selain `indonesia` memerlukan permintaan eksplisit serta konteks yang diminta profil.

Status bukan klaim keaslian. Jangan menyebut keluaran autentik atau tervalidasi penutur sebelum review manusia yang relevan benar-benar tercatat.

## Batas regional

- Gunakan fungsi pragmatik dan pola wacana sebelum kosakata ikonik.
- Jangan mencampur penanda beberapa profil kecuali pengguna meminta campuran secara eksplisit.
- Jangan menulis aksen secara fonetis atau sengaja salah eja untuk meniru pelafalan.
- Jangan menghubungkan dialek dengan sifat seperti kasar, lucu, keras, lembut, malas, atau pintar.
- Jangan memakai makian, sapaan akrab, atau pronomina berisiko hanya agar terdengar lokal.
- Jika fungsi bentuk regional tidak dijelaskan oleh profil atau contoh pengguna, pilih bentuk yang lebih luas atau turunkan intensitas.
