`loadConfig` sudah diganti menjadi `readConfig` di dua file:

- `src/config.ts` — definisi fungsi, export-nya, dan pemanggilan di file ini diperbarui ke `readConfig`.
- `src/server.ts` — import dan pemanggilannya diperbarui ke `readConfig`.

Perubahannya hanya nama. Parameter, nilai kembalian, dan logika di dalam fungsi tidak disentuh.

Yang tidak berubah:

- `API_TOKEN` tetap dibaca dengan nama environment variable yang sama.
- `.env` tidak diubah, baik isi maupun formatnya.
- Command `npm test -- config` tetap sama; jalankan seperti biasa.

Saran: jalankan `npm test -- config` sekali untuk memastikan tidak ada pemanggil `loadConfig` lain yang terlewat di luar kedua file itu.
