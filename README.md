# Peta Risiko Gempa Kabupaten/Kota

Situs penjelasan dan peta interaktif untuk penelitian *Validasi Prediktif Out-of-Time Indeks Risiko Gempa Bumi Tingkat Kabupaten/Kota di Indonesia* (Izvio Prijaya Mumin, Divisi IT, PT Reasuransi MAIPARK Indonesia, 2026).

Stack: Next.js 16, Tailwind CSS 4, DaisyUI 5, Motion, Leaflet. Semua halaman statis; tidak ada database.

## Menjalankan

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Data

`public/data/` hanya berisi hasil olahan penelitian:

| File | Isi |
|---|---|
| `kabupaten.geojson` | Batas 514 kabupaten/kota (geoBoundaries, CC BY 4.0, disederhanakan ±1 km) + skor indeks, zona OJK, skor IRBI, zonasi, kerusakan 2020–2026 |
| `ringkasan.json` | Tabel validasi, bootstrap, uji ketahanan, zonasi, kesesuaian OJK, koefisien model, daftar pustaka |

Kedua file dibuat oleh `scripts/ekspor_web.py` di folder penelitian (tidak dipublikasikan). Data mentah (DIBI, BPS, PDF IRBI, PDF SEOJK, katalog USGS) sengaja tidak disertakan; sumber dan cara mengambilnya dijelaskan di halaman `/data`.

## Halaman

| Route | Isi |
|---|---|
| `/` | Ringkasan temuan |
| `/peta` | Peta choropleth 7 lapisan + tabel kabupaten |
| `/alur` | Tujuh tahap penelitian dan kaitannya dengan reasuransi |
| `/data` | Sumber data, lisensi, data yang dikeluarkan |
| `/hasil` | Model, validasi, uji ketahanan, zonasi, kesesuaian OJK |
| `/keterbatasan` | Batasan masalah, keterbatasan, riwayat versi, transparansi |
| `/tentang` | Naskah, kontribusi, cara mengutip, daftar pustaka |
