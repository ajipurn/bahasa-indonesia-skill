Bug `API_TOKEN`-nya bukan di logika kodenya, tapi di environment. `loadConfig` di `src/config.ts:42` balikin `undefined` karena `API_TOKEN` nggak ada di `.env`. Jadi begitu config dibaca, nilai tokennya kosong, dan apa pun yang bergantung ke token itu ikut gagal.

Cara ceknya:

1. Buka `.env`, pastikan ada baris `API_TOKEN=...` dengan nilai yang valid. Kalau belum ada, tambahin dulu.
2. Setelah itu jalanin ulang tes config-nya:

```bash
npm test -- config
```

Kalau tesnya lolos, berarti `loadConfig` udah dapet tokennya. Kalau masih gagal, kemungkinan `.env` nggak kebaca dari lokasi yang benar, atau nama variabelnya beda sama yang dicek di `src/config.ts:42`.

Satu saran tambahan, sifatnya dugaan: biar kasus kayak gini nggak lolos diam-diam lagi, `loadConfig` sebaiknya lempar error eksplisit kalau `API_TOKEN` kosong, bukan balikin `undefined`.
