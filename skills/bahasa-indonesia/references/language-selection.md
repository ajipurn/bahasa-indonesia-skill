# Pemilihan Bahasa Daerah

Baca ini ketika pengguna meminta bahasa daerah, bahasa komunitas etnolinguistik, atau keluaran dengan `language` selain `indonesia`. Bahasa, dialek, ragam regional Indonesia, sosiolek, dan tingkat tutur adalah sumbu berbeda.

## Registry nasional

[`languages.json`](languages.json) memuat 718 bahasa yang diidentifikasi Badan Pengembangan dan Pembinaan Bahasa. Cari hanya entri yang relevan; jangan memuat seluruh registry ke konteks jika pencarian nama atau ID sudah cukup. Jika dapat menjalankan script, gunakan `node scripts/find-language.mjs <nama|alias|wilayah|provinsi>` dari folder skill.

Setiap entri mempunyai:

- `id`: kunci konfigurasi hasil normalisasi nama resmi;
- `name` dan `aliases`: nama dari sumber resmi;
- `macroregions` dan `provinces`: metadata persebaran, bukan identitas penutur;
- `source_id`: ID pada Peta Bahasa;
- `support.status`: tingkat kemampuan skill;
- `support.reference`: panduan yang harus dibaca jika tersedia.

Nama serta batas bahasa dapat berubah seiring penelitian. Provinsi hanya membantu disambiguasi dan tidak boleh dipakai untuk menebak bahasa pengguna.

## Status kemampuan

| Status | Perilaku |
|---|---|
| `catalogued` | Kenali nama dan lokasinya. Jangan mengarang kosakata, tata bahasa, pronomina, atau partikel. Tawarkan bahasa Indonesia atau minta contoh dari pengguna. |
| `beta` | Baca `support.reference`. Gunakan dengan batas intensitas dan review yang ditentukan panduan. Jangan mengklaim autentik. |
| `validated` | Gunakan panduan yang ditautkan; status ini hanya boleh diberikan setelah evaluasi penutur dicatat. |

Registry adalah katalog pengenalan, bukan klaim bahwa model fasih dalam 718 bahasa. Jika pengguna memberikan contoh untuk bahasa berstatus `catalogued`, agent boleh mengikuti pola yang terlihat secara terbatas, tetapi harus mempertahankan makna dan tidak melengkapinya dengan bentuk rekaan.

## Bahasa populer dengan panduan beta

Selain Jawa dan Sunda, panduan awal tersedia untuk 12 bahasa populer lintas wilayah:

| Wilayah | Bahasa | Panduan |
|---|---|---|
| Sumatra | Aceh, Minangkabau, Lampung | [`languages/sumatra.md`](languages/sumatra.md) |
| Jawa, Bali, Nusa Tenggara | Madura, Bali, Sasak, Bima (Mbojo) | [`languages/java-bali-nusa-tenggara.md`](languages/java-bali-nusa-tenggara.md) |
| Kalimantan | Banjar, Dayak Ngaju | [`languages/kalimantan.md`](languages/kalimantan.md) |
| Sulawesi | Bugis, Makassar, Toraja | [`languages/sulawesi.md`](languages/sulawesi.md) |

`beta` berarti panduan batas, varietas, dan sumber tersedia—bukan berarti keluaran kental sudah tervalidasi. Default-kan ke `intensity: tipis`. Naik ke `sedang` atau `kental` hanya jika pengguna memberi varietas atau contoh yang cukup, lalu nyatakan kebutuhan review penutur bila hasil akan dipublikasikan.

## Resolusi permintaan

1. Cocokkan nama atau alias dengan `languages.json` tanpa membedakan kapitalisasi.
2. Jika satu nama mengacu pada beberapa entri atau wilayah yang berbeda dan perbedaannya memengaruhi hasil, minta bahasa/varietas atau lokasi tutur yang dimaksud.
3. Baca `support.reference` hanya jika status serta entri menyediakannya. Panduan gabungan tetap harus diterapkan hanya pada bahasa yang dipilih.
4. Untuk `catalogued`, jelaskan batas secara singkat lalu tawarkan keluaran Indonesia atau adaptasi dari contoh pengguna.
5. Jika nama tidak ada, jangan menyimpulkan komunitas itu tidak ada. Sumber nasional sendiri belum merekam bahasa imigran, bahasa terpencil, dialek, dan subdialek secara menyeluruh.

Permintaan payung seperti “bahasa Dayak”, “bahasa Batak”, “bahasa Papua”, “bahasa Melayu”, “bahasa Nusa Tenggara”, atau “bahasa Indonesia Timur” dapat mencakup banyak bahasa/varietas. Jangan memilih salah satunya berdasarkan stereotip; minta nama yang lebih spesifik jika keluaran bahasa daerah benar-benar diminta.

## Sumbu konfigurasi

- `language`: bahasa utama keluaran, `indonesia` atau `id` dari registry.
- `variety`: dialek/subdialek/varietas yang diminta; default `auto` tidak menebak.
- `regional_voice`: hanya gaya regional atau sosiolek dalam prosa bahasa Indonesia.
- `speech_level`: hubungan tutur yang ditentukan oleh bahasa terkait.
- `base_language`: alias lama. `indonesia` berarti `language: indonesia`; `regional` memerlukan `language` eksplisit.

Contoh:

```yaml
bahasa_indonesia:
  language: jawa
  variety: surabaya
  speech_level: ngoko
  regional_voice: netral
```

Untuk bahasa berstatus `catalogued`:

```yaml
bahasa_indonesia:
  language: abui-aboa
  variety: auto
```

Konfigurasi kedua membuat agent mengenali permintaan Abui/Aboa, bukan mengizinkannya menciptakan tuturan Abui.

## Cakupan di luar registry

Bahasa warisan komunitas imigran dan bahasa isyarat memerlukan katalog serta panduan tersendiri. Jangan memasukkan Hokkien, Hakka, Teochew, Mandarin, Arab, Tamil, BISINDO, atau bahasa isyarat lokal ke profil bahasa daerah lisan hanya karena dipakai oleh warga Indonesia. Ketiadaan dari registry tidak mengurangi keindonesiaan komunitas penuturnya.

## Sumber

- [Peta Bahasa Badan Bahasa](https://petabahasa.kemendikdasmen.go.id/)
- [Data 718 bahasa](https://petabahasa.kemendikdasmen.go.id/databahasa.php)
- [Ihwal dan keterbatasan pemetaan](https://petabahasa.kemdikbud.go.id/sekapursirih.pdf)
