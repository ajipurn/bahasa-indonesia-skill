# Evaluasi Perilaku Skill

Gunakan panduan ini saat menguji perubahan aturan inti, router, atau profil. Jangan menilai skill hanya dari keberadaan kata daerah tertentu.

## Tujuan evaluasi

Skill dianggap bekerja jika:

1. fakta dan tindakan teknis tetap sama ketika hanya gaya yang diganti;
2. artefak terlindungi yang bukan target tugas tetap identik;
3. gaya terasa wajar bagi penutur yang mengenal varietas tersebut;
4. register, intensitas, tingkat tutur, gaya puitis, pronomina, dan larangan pengguna dipatuhi;
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

Untuk profil regional, nilai pula apakah keluaran tetap wajar ketika tidak memakai kata ikonik. Ketiadaan `rek`, `mah`, `ik`, atau bentuk serupa bukan kegagalan jika pola wacana dan relasi sosialnya tepat.

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

Tambahkan pula kasus yang **memang meminta perubahan kode atau identifier**. Skill gagal jika aturan bahasa membekukan artefak target; hanya artefak rujukan yang tidak ditargetkan yang harus tetap identik.

## Uji router dan override

Verifikasi setidaknya:

- registry memuat 718 entri dengan `id`, nama, wilayah, provinsi, ID sumber, dan status kemampuan yang valid;
- tepat 14 bahasa populer berstatus `beta` dan setiap entri menunjuk panduan yang tersedia;
- bahasa beta baru default ke intensitas tipis; permintaan sedang/kental tanpa varietas atau contoh tidak dipenuhi dengan bentuk rekaan;
- “bahasa Aboa” ditemukan sebagai alias Abui, tetapi tidak menghasilkan tuturan rekaan selama statusnya `catalogued`;
- permintaan bahasa berstatus `catalogued` menawarkan bahasa Indonesia atau meminta contoh pengguna;
- label payung seperti “bahasa Dayak” atau “bahasa Papua” meminta pilihan yang lebih spesifik jika bahasa dominan dibutuhkan;
- `language: dayak-ngaju` memuat panduan Kalimantan, sedangkan “bahasa Dayak” tetap meminta pilihan;
- `language: makassar` memuat panduan bahasa Sulawesi dan tidak diselesaikan sebagai `regional_voice: makassar`;
- bahasa yang tidak tercatat tidak dinyatakan tidak ada atau bukan bagian dari komunitas Indonesia;
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
- “balik netral” menghapus penanda regional pada jawaban berikutnya;
- “Sunda loma” memuat panduan Sunda dengan `speech_level: loma`;
- “Sunda kasar” tanpa penjelas memuat panduan Sunda lalu meminta pilihan antara loma/akrab dan cohag/kasar pisan;
- “Sunda kasar pisan” atau “Sunda cohag” memuat panduan Sunda dengan `speech_level: cohag`;
- “Jawa kasar gaya Surabaya” memuat `surabaya`, panduan Jawa, dan `speech_level: ngoko`;
- “Jawa kasar” pada intensitas sedang/kental tidak mengarang campuran wilayah;
- “bahasa puitis” memuat `poetic.md` tanpa mengubah `regional_voice`;
- “balik lugas” menghapus gaya puitis tetapi mempertahankan profil regional.

## Uji gaya puitis

Gunakan fakta dan artefak yang sama pada `poetic_intensity: tipis|sedang|kental`. Verifikasi:

- hasil atau diagnosis literal muncul sebelum hiasan yang berpotensi ambigu;
- citraan membingkai makna dan tidak menggantikan penyebab, lokasi, atau tindakan;
- satu paragraf tidak mencampur banyak medan metafora;
- prosa tidak berubah menjadi puisi berbait kecuali diminta;
- tidak ada kata arkais, rima, atau personifikasi yang dipaksakan;
- gaya puitis tidak bocor ke commit message, kode, data, atau artefak berformat ketat;
- kombinasi `regional_voice` dan `prose_style: puitis` tetap terasa seperti satu suara, bukan dua kostum bahasa.

Tambahkan skenario peringatan destruktif. Target, akibat, dan kebutuhan izin harus tetap gamblang pada kalimat pertama; keluaran gagal jika pembaca harus menafsirkan metafora untuk mengetahui risikonya.

## Invarian otomatis

Test harness memeriksa secara struktural:

- isi fenced code block dan inline code yang ditandai terlindungi tetap identik;
- identifier, path, command, URL, versi, hash, dan pesan error yang bukan target tugas tetap ada secara identik;
- JSON/YAML yang diminta sebagai data tidak disisipi partikel;
- nama profil lain tidak bocor melalui penanda ikoniknya;
- status `catalogued` tidak berubah menjadi kemampuan generatif karena intensitas atau profil regional;
- keluaran tidak mengarang kosakata untuk bahasa yang hanya dikenali registry;
- tingkat tutur `loma` atau `ngoko` tidak memperkenalkan makian yang tidak diminta;
- tingkat tutur `cohag` tidak memperkenalkan makian atau penghinaan yang melampaui permintaan pengguna;
- gaya puitis tidak mengubah fakta, tingkat kepastian, tindakan, atau format keluaran;
- commit message tetap mengikuti konvensi repo;
- klaim seperti “tes lulus” tidak muncul jika prompt tidak menyatakan tes dijalankan.

Jangan membuat tes yang hanya mewajibkan kemunculan `rek`, `mah`, `ik`, `je`, `ningkan`, `bah`, atau `ji`. Tes semacam itu mendorong karikatur dan tidak membuktikan ketepatan fungsi.

## Menjalankan harness

Dari folder skill:

```bash
node scripts/validate-skill.mjs
node --test tests/*.test.mjs
node scripts/evaluate-output.mjs <id-kasus> <file-keluaran>
```

Untuk menyegarkan katalog dari Peta Bahasa, jalankan `node scripts/sync-language-registry.mjs`. Tes parser memakai fixture lokal; test suite biasa tidak memerlukan jaringan.

[`evals/cases.json`](../evals/cases.json) menyimpan prompt, substring yang harus dipertahankan, pola yang dilarang, dan kriteria review manusia. Pemeriksaan otomatis sengaja tidak mewajibkan kata daerah atau mencocokkan seluruh jawaban. Tambahkan kasus baru ketika ada invarian atau kegagalan perilaku yang berbeda; jangan membuat fixture hanya untuk satu redaksi keluaran.

## Rubrik penutur

Minta penutur yang akrab dengan varietas terkait memberi skor 1–5 untuk:

1. kealamian keseluruhan;
2. ketepatan partikel dan morfologi;
3. ketepatan pronomina serta jarak sosial;
4. konsistensi wilayah;
5. kejelasan teknis;
6. bebas stereotip atau efek parodi.

Untuk `prose_style: puitis`, tambahkan skor kejelasan citraan, koherensi metafora, ketepatan diksi, dan keseimbangan estetika dengan fungsi teknis.

Reviewer juga menandai bagian yang “secara tata bahasa mungkin benar, tetapi tidak akan diucapkan dalam situasi itu.” Umpan balik tersebut lebih bernilai daripada koreksi daftar kosakata.

Untuk profil `kental`, gunakan setidaknya dua reviewer jika memungkinkan. Jangan naikkan status profil dari beta hanya berdasarkan penilaian pembuat skill atau keluaran model lain.

Sebelum mengubah status profil, catat profil/subwilayah yang dinilai, tanggal, model dan versi skill, ID kasus, jumlah reviewer, skor per dimensi, serta contoh kegagalan yang berulang. Jangan mencatat identitas pribadi reviewer tanpa kebutuhan dan persetujuan; yang diperlukan adalah hubungan mereka dengan varietas yang dinilai.

## Gerbang rilis yang disarankan

- Tidak ada perubahan pada artefak terlindungi yang bukan target tugas.
- Tidak ada fakta, izin, atau peringatan yang hilang.
- Tidak ada penanda dari profil lain tanpa permintaan campuran.
- Override pronomina, tingkat tutur, intensitas, dan gaya prosa dipatuhi.
- Reviewer regional tidak menemukan kesalahan pragmatik berulang.
- Profil yang belum lolos review tetap diberi label beta/eksperimental dan default-nya tidak `kental`.

Catat kegagalan sebagai contoh perilaku, lalu perbaiki aturan yang paling sempit. Jangan menambah larangan global berdasarkan satu kalimat yang kebetulan buruk.
