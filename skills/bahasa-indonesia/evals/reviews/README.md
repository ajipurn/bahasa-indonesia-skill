# Catatan review penutur

Folder ini menyimpan bukti review penutur yang menjadi syarat untuk menaikkan status profil regional (`beta`/`eksperimental` → `stabil`) atau bahasa (`beta` → `validated`). Validator menolak status `stabil` atau `validated` yang tidak mempunyai catatan dengan `decision: naik-status` di sini.

Satu file JSON per sesi review, misalnya `2026-10-06-kebumen-sedang.json`. Jangan mencatat identitas pribadi reviewer; yang diperlukan hanya hubungan mereka dengan varietas yang dinilai.

## Skema

```json
{
  "schema_version": 1,
  "subject": { "kind": "profile", "id": "kebumen", "variety": "barat" },
  "date": "2026-10-06",
  "skill_commit": "09b6ed0",
  "model": "claude-fable-5-1",
  "intensity": "sedang",
  "case_ids": ["kebumen-intensity-cap", "netral-bug-explanation"],
  "reviewers": { "count": 2, "relationship": "penutur yang tumbuh di Kebumen bagian barat" },
  "scores": {
    "kealamian": 4,
    "partikel_morfologi": 3,
    "pronomina_jarak_sosial": 4,
    "konsistensi_wilayah": 4,
    "kejelasan_teknis": 5,
    "bebas_stereotip": 4
  },
  "recurring_failures": ["`ningkan` dipakai sebagai filler tanpa hubungan pertentangan."],
  "decision": "tetap-beta",
  "notes": "Reviewer menandai dua kalimat yang gramatikal tetapi tidak akan diucapkan dalam laporan kerja."
}
```

Aturan:

- `subject.kind` adalah `profile` (ID profil di `references/profiles/`) atau `language` (ID di `references/languages.json`). `variety` opsional.
- `date` memakai format `YYYY-MM-DD`; `skill_commit` adalah hash atau tag commit yang direview.
- `case_ids` harus ada di `evals/cases.json`.
- `scores` memuat enam dimensi rubrik di `references/evaluation.md`, masing-masing bilangan bulat 1–5. Untuk `prose_style: puitis`, tambahkan `kejelasan_citraan`, `koherensi_metafora`, `ketepatan_diksi`, dan `keseimbangan_estetika` secara opsional.
- `reviewers.count` minimal 1; untuk intensitas `kental`, minimal 2.
- `decision` adalah `tetap-beta`, `naik-status`, atau `turun-status`.
- `naik-status` hanya sah dengan minimal 2 reviewer dan skor minimal 4 pada keenam dimensi. Validator menolak catatan `naik-status` yang tidak memenuhinya.
- Untuk satu subjek, catatan dengan `date` terbaru yang berlaku. Catatan `turun-status` atau `tetap-beta` yang lebih baru membatalkan `naik-status` sebelumnya, sehingga status `stabil` atau `validated` harus diturunkan kembali.

Catatan dengan skor tinggi dari pembuat skill sendiri atau dari model lain tidak dihitung sebagai review penutur.
