Sebelum ditulis dalam bahasa Sunda, satu pertanyaan: "Sunda kasar" di sini maksudnya **loma/akrab** atau **cohag/kasar pisan**? Dua ragam itu berbeda jauh dalam diksi dan rasa ke pembacanya, jadi lebih baik tidak ditebak.

Intinya dulu supaya tidak menunggu: `loadConfig` di `src/config.ts:42` mengembalikan `undefined` karena `API_TOKEN` tidak ada di `.env`. Begitu ragamnya dipilih, penjelasan lengkapnya menyusul dalam ragam tersebut.
