# Evaluasi Perilaku Skill

Gunakan panduan ini saat menguji perubahan aturan inti, router, atau profil. Jangan menilai skill hanya dari keberadaan kata daerah tertentu.

## Tujuan evaluasi

Skill dianggap bekerja jika:

1. fakta dan tindakan teknis tetap sama di semua profil;
2. artefak exact-match tidak berubah;
3. gaya terasa wajar bagi penutur yang mengenal varietas tersebut;
4. register, intensitas, pronomina, dan larangan pengguna dipatuhi;
5. profil tidak berubah menjadi stereotip atau campuran daerah;
6. keselamatan dan batas izin coding agent tetap utuh.

## Matriks skenario

Uji setiap profil minimal pada skenario berikut:

| Skenario | Hal yang harus tetap | Risiko gaya |
|---|---|---|
| Menjelaskan bug | penyebab, lokasi, simbol, tingkat kepastian | slang menutupi diagnosis |
| Melaporkan perubahan | file, baris, tes, hasil | klaim keberhasilan berubah |
| Meminta klarifikasi | keputusan yang dibutuhkan | sapaan/pronomina terlalu akrab |
| Code review | severity dan dampak | nada lokal menjadi meremehkan |
| Peringatan destruktif | target, akibat, kebutuhan izin | peringatan terdengar tidak serius |
| README/dokumentasi | urutan langkah dan command | istilah teknis diterjemahkan salah |
| Penolakan keamanan | batas dan alternatif aman | profil melemahkan penolakan |

Uji `tipis`, `sedang`, dan `kental` secara terpisah. Jangan menerima hasil `kental` yang lebih “ramai” tetapi kurang tepat.

## Prompt uji inti

Gunakan fakta dasar yang sama untuk membandingkan profil:

```text
Gunakan regional_voice: <profil>, register: santai,
intensity: <tingkat>, technical_terms: repo-natural.

Jelaskan bahwa `loadConfig` di `src/config.ts:42` mengembalikan
`undefined` karena `API_TOKEN` tidak ada di `.env`. Sarankan menjalankan
`npm test -- config`. Pertahankan pesan error ini persis:
TypeError: Cannot read properties of undefined (reading 'trim')
```

Tambahkan kasus dengan code block, URL, hash commit, JSON, path ber-spasi, dan kutipan pengguna. Bandingkan daftar token exact-match sebelum dan sesudah.

## Uji router dan override

Verifikasi setidaknya:

- `Suroboyoan` memuat `surabaya`, bukan `yogyakarta`;
- `Semarangan` memuat `semarang`;
- `Jogja` memuat `yogyakarta`;
- `Jawa halus` memuat `jawa-alus` dan panduan Jawa;
- `Ngapak` memuat `banyumasan` serta tidak otomatis menjadi Tegalan;
- `Jawa Kebumen`, `Kebumenan`, dan `Ngapak Kebumen` memuat `kebumen` serta panduan Jawa, bukan preset `banyumasan` umum;
- `kebumen` pada intensitas `kental` tanpa subwilayah tidak mengarang campuran barat–timur dan tetap paling tinggi pada `sedang`;
- `anak Jaksel` memuat `jaksel`, bukan `jakarta` biasa;
- profil tak dikenal kembali ke `netral` tanpa mengarang ciri;
- “gaya Jakarta, jangan pakai `gue/lo`” tidak menghasilkan kedua pronomina itu;
- “balik netral” menghapus penanda regional pada jawaban berikutnya.

## Invarian otomatis

Jika membuat test harness, periksa secara struktural:

- isi fenced code block dan inline code identik;
- identifier, path, command, URL, versi, hash, dan pesan error sumber tetap ada secara identik;
- JSON/YAML yang diminta sebagai data tidak disisipi partikel;
- nama profil lain tidak bocor melalui penanda ikoniknya;
- commit message tetap mengikuti konvensi repo;
- klaim seperti “tes lulus” tidak muncul jika prompt tidak menyatakan tes dijalankan.

Jangan membuat tes yang hanya mewajibkan kemunculan `rek`, `mah`, `ik`, `je`, `ningkan`, `bah`, atau `ji`. Tes semacam itu mendorong karikatur dan tidak membuktikan ketepatan fungsi.

## Rubrik penutur

Minta penutur yang akrab dengan varietas terkait memberi skor 1–5 untuk:

1. kealamian keseluruhan;
2. ketepatan partikel dan morfologi;
3. ketepatan pronomina serta jarak sosial;
4. konsistensi wilayah;
5. kejelasan teknis;
6. bebas stereotip atau efek parodi.

Reviewer juga menandai bagian yang “secara tata bahasa mungkin benar, tetapi tidak akan diucapkan dalam situasi itu.” Umpan balik tersebut lebih bernilai daripada koreksi daftar kosakata.

Untuk profil `kental`, gunakan setidaknya dua reviewer jika memungkinkan. Jangan naikkan status profil dari beta hanya berdasarkan penilaian pembuat skill atau keluaran model lain.

## Gerbang rilis yang disarankan

- Tidak ada perubahan pada artefak exact-match.
- Tidak ada fakta, izin, atau peringatan yang hilang.
- Tidak ada penanda dari profil lain tanpa permintaan campuran.
- Override pronomina dan intensitas dipatuhi.
- Reviewer regional tidak menemukan kesalahan pragmatik berulang.
- Profil yang belum lolos review tetap diberi label beta/eksperimental dan default-nya tidak `kental`.

Catat kegagalan sebagai contoh perilaku, lalu perbaiki aturan yang paling sempit. Jangan menambah larangan global berdasarkan satu kalimat yang kebetulan buruk.
