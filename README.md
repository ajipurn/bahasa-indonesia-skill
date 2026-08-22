# bahasa-indonesia untuk coding agent

[![skills.sh](https://skills.sh/b/ajipurn/bahasa-indonesia-skill)](https://skills.sh/ajipurn/bahasa-indonesia-skill/bahasa-indonesia)

Agent Skill agar coding agent berbicara dalam bahasa Indonesia yang alami dan dapat mengikuti gaya regional pilihan pengguna tanpa mengubah kode atau fakta teknis.

Format skill-nya mengikuti standar Agent Skills: satu `SKILL.md` sebagai router dan referensi yang dibaca hanya saat diperlukan. Sumber kanonis berada di [`skills/bahasa-indonesia`](skills/bahasa-indonesia), jadi paket ini tidak terikat pada Claude Code.

## Profil V1

| Profil | Alias/contoh permintaan | Jenis |
|---|---|---|
| `netral` | “pakai Indonesia netral” | lintas daerah |
| `jakarta` | “bahasa gaul Jakarta” | ragam perkotaan |
| `jaksel` | “ala anak Jaksel” | sosiolek Indonesia–Inggris |
| `bandung` | “logat Bandung” | Indonesia bercorak Sunda |
| `medan` | “gaya Medan” | ragam regional |
| `makassar` | “gaya Makassar” | dialek Bugis–Makassar |
| `surabaya` | “Suroboyoan” | Jawa Arekan/Surabayaan |
| `semarang` | “Semarangan” | Jawa Semarangan |
| `yogyakarta` | “gaya Jogja” | Jawa Yogyakarta |
| `jawa-alus` | “pakai Jawa halus” | laras krama, bukan wilayah |
| `banyumasan` | “pakai Ngapak” | Jawa Banyumasan |

Profil regional masih berstatus beta sampai dinilai penutur yang akrab dengan varietasnya. `jawa-alus` berstatus eksperimental karena sistem honorifik Jawa tidak dapat dimodelkan sebagai penggantian kosakata sederhana.

## Memilih gaya

Cukup tulis pilihan dalam prompt:

```text
Jelaskan bug ini pakai gaya Bandung, santai, intensitas sedang.
```

```text
Jawab ala Jaksel, tapi jangan pakai gue-lo. Istilah teknis ikuti repo.
```

```text
Pakai Suroboyoan tipis. Kode dan command tetap persis.
```

Pilihan lengkap dapat disimpan di instruksi proyek seperti `AGENTS.md` atau `CLAUDE.md`:

```yaml
bahasa_indonesia:
  base_language: indonesia
  regional_voice: semarang
  register: santai
  intensity: tipis
  technical_terms: repo-natural
  self_reference: auto
  addressee_reference: auto
  orthography: percakapan
```

Detail opsi ada di [`references/configuration.md`](skills/bahasa-indonesia/references/configuration.md).

## Instalasi dengan `npx skills`

CLI [`skills`](https://skills.sh/) mendeteksi coding agent yang tersedia dan memasang satu sumber skill ke lokasi yang sesuai untuk setiap agent.

### Coba langsung dari checkout lokal

Dari root repo ini:

```bash
npx skills add . --skill bahasa-indonesia
```

Pilih agent saat diminta. Untuk langsung menargetkan Codex:

```bash
npx skills add . --skill bahasa-indonesia --agent codex
```

### Instal dari GitHub

Gunakan sumber GitHub repo ini:

```bash
npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia
```

Argumen setelah `add` adalah sumber repo, sedangkan nama skill dipilih dengan `--skill`. Halaman detail skills.sh juga menghasilkan pola perintah ini.

Contoh instalasi noninteraktif:

```bash
# Codex, hanya untuk proyek saat ini
npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia --agent codex --yes

# Codex, tersedia di semua proyek
npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia --agent codex --global --yes

# Claude Code
npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia --agent claude-code --yes

# Beberapa agent sekaligus
npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia --agent codex --agent claude-code --agent cursor
```

Tanpa `--global`, instalasi bersifat project-level. Untuk melihat skill yang ditemukan tanpa memasang:

```bash
npx skills add ajipurn/bahasa-indonesia-skill --list
```

### Memakai skill

Di Codex, buka pemilih lewat `/skills` atau sebut `$bahasa-indonesia`. Di Claude Code, gunakan `/bahasa-indonesia`. Agent juga dapat mengaktifkannya otomatis ketika permintaan cocok dengan deskripsi skill.

Contoh Codex:

```text
$bahasa-indonesia Jelaskan penyebab test ini gagal dengan gaya Bandung tipis.
```

Untuk menjadikannya preferensi proyek, tambahkan instruksi berikut ke `AGENTS.md`, `CLAUDE.md`, atau file instruksi agent yang relevan:

```markdown
Balas dalam bahasa Indonesia dan ikuti skill `bahasa-indonesia`.
```

Jika skill baru belum muncul, mulai sesi agent baru atau restart agent.

## Publikasi ke skills.sh

1. Pastikan [`skills/bahasa-indonesia/SKILL.md`](skills/bahasa-indonesia/SKILL.md) tersedia di branch utama repo publik.
2. Jalankan `npx skills add ajipurn/bahasa-indonesia-skill --skill bahasa-indonesia` dari proyek uji.
3. Instalasi publik dengan telemetry bawaan membuat skill terdeteksi dan masuk ke direktori skills.sh secara otomatis.

Halaman publiknya tersedia di [skills.sh/ajipurn/bahasa-indonesia-skill/bahasa-indonesia](https://skills.sh/ajipurn/bahasa-indonesia-skill/bahasa-indonesia).

## Struktur paket

```text
skills/bahasa-indonesia/
├── SKILL.md
├── agents/openai.yaml
└── references/
    ├── core.md
    ├── configuration.md
    ├── javanese.md
    ├── evaluation.md
    └── profiles/*.md
```

`agents/openai.yaml` menambahkan nama tampilan dan prompt awal untuk Codex/ChatGPT. Agent lain tetap memakai `SKILL.md` dan referensi yang sama.

## Prinsip desain

- “Logat” teks dimodelkan lewat register, diksi, partikel, pronomina, morfologi, dan campur kode—bukan tiruan bunyi.
- Profil regional hanya aktif jika dipilih; skill tidak menebak asal atau suku pengguna.
- `tipis`, `sedang`, dan `kental` mengatur kedalaman pola, bukan jumlah slang.
- Code block, identifier, path, command, URL, pesan error, dan data terstruktur harus tetap persis.
- Profil kota tidak dianggap mewakili satu etnis atau satu cara bicara.

Landasan desain dan sumber awal tersedia di [`docs/riset-ragam-bahasa-indonesia.md`](docs/riset-ragam-bahasa-indonesia.md). Skenario pengujian ada di [`references/evaluation.md`](skills/bahasa-indonesia/references/evaluation.md).
