# bahasa-indonesia untuk coding agent

[![skills.sh](https://skills.sh/b/ajipurn/bahasa-indonesia-skill)](https://skills.sh/ajipurn/bahasa-indonesia-skill/bahasa-indonesia)

Skill ini dibuat agar agent berbicara dalam bahasa Indonesia yang natural.

Kamu dapat menggunakan bahasa Indonesia netral, memilih gaya regional, mengatur tingkat tutur, atau meminta prosa puitis. Istilah teknis seperti `commit`, `prompt`, `test`, dan `output` juga dapat dipertahankan dalam bahasa Inggris agar selaras dengan codebase dan dokumentasi yang digunakan.

## Instalasi

```bash
npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia
```

CLI akan meminta kamu memilih coding agent. Secara default, skill dipasang untuk proyek yang sedang dibuka. Tambahkan `--global` agar skill tersedia di semua proyek:

```bash
npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia --global
```

## Cara menggunakan

Pada Codex:

```text
$bahasa-indonesia Jelaskan mengapa test ini gagal.
```

Pada Claude Code:

```text
/bahasa-indonesia Jelaskan mengapa test ini gagal.
```

Pada coding agent lain, pilih skill `bahasa-indonesia` dari skill picker atau sebutkan namanya di prompt. Agent juga dapat mengaktifkannya secara otomatis ketika kamu menggunakan bahasa Indonesia.

## Pilih gaya dengan kalimat biasa

Tidak perlu menulis konfigurasi. Cukup jelaskan gaya yang diinginkan langsung di prompt:

```text
Jelaskan bug ini dengan bahasa Indonesia santai. Pertahankan istilah teknis dalam bahasa Inggris.
```

```text
Pakai gaya Bandung tipis.
```

```text
Jawab ala Jaksel, tetapi jangan gunakan gue-lo.
```

```text
Pakai Jawa Kebumen sedang, condong Kebumen barat.
```

```text
Pakai Sunda loma untuk ngobrol akrab, jangan memaki.
```

```text
Pakai Minangkabau tipis. Jika perlu lebih kental, tanyakan varietasnya.
```

```text
Jelaskan hasil refactor ini dengan prosa puitis tipis.
```

Jika ingin mengurangi atau mengganti gaya di tengah percakapan, cukup katakan “kurangi logatnya”, “kembali netral”, atau “jangan puitis”.

## Pilihan konfigurasi

- **Nada:** baku, profesional, atau santai.
- **Gaya regional:** Jakarta, Jaksel, Bandung, Medan, Makassar, Surabaya, Semarang, Yogyakarta, Jawa alus, Banyumasan/Ngapak, dan Kebumen.
- **Bahasa daerah beta:** Jawa, Sunda, Aceh, Minangkabau, Lampung, Madura, Bali, Sasak, Bima/Mbojo, Banjar, Dayak Ngaju, Bugis, Makassar, dan Toraja.
- **Tingkat tutur:** `loma` atau `cohag` untuk Sunda; `ngoko`, `madya`, atau `krama` untuk Jawa.
- **Intensitas:** tipis, sedang, atau kental.
- **Gaya prosa:** lugas atau puitis.

## Jadikan default

Tambahkan instruksi berikut ke `AGENTS.md`, `CLAUDE.md`, atau file instruksi proyek yang digunakan coding agent:

```markdown
Gunakan skill `bahasa-indonesia`. Balas dalam bahasa Indonesia santai dan pertahankan istilah teknis dalam bahasa Inggris.
```

## Kontribusi

Profil regional dan 14 bahasa populer masih berstatus beta. Skill ini juga mengenali 718 nama bahasa dari [Peta Bahasa](https://petabahasa.kemendikdasmen.go.id/databahasa.php) tanpa mengarang tuturan yang belum memiliki panduan.

Ingin ikut mengembangkan profil, registry bahasa, atau evaluasi? Lihat [panduan pengembangan](docs/development.md) dan [catatan riset](docs/riset-ragam-bahasa-indonesia.md).
