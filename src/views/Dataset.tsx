import { Bagian, Halaman } from "@/components/Halaman";
import type { Lang } from "@/lib/i18n";

type Sumber = { nama: string; penyedia: string; url: string; periode: string; jumlah: string; guna: string; ambil: string; sebar: string };

const T: Record<Lang, { label: string; judul: string; pengantar: string; sumber: string; kol: string[]; akses: string; data: Sumber[]; dikeluarkanJudul: string; kolKeluar: string[]; dikeluarkan: string[][]; fileJudul: string; file: [string, string, string, string, string] }> = {
  id: {
    label: "Tentang",
    judul: "Dataset",
    pengantar:
      "Semua data berasal dari sumber publik. Situs ini hanya menampilkan hasil olahan penelitian ini (skor risiko, zona, dan perbandingannya) serta batas wilayah yang disederhanakan. Data mentahnya tidak disebarkan ulang. Tautan dan cara mengambilnya ada di bawah.",
    sumber: "Sumber data",
    kol: ["Periode", "Jumlah", "Dipakai untuk", "Cara ambil", "Dibagikan?"],
    akses: "Data versi penelitian diakses atau diunduh 30–31 Oktober 2026.",
    data: [
      { nama: "Data Informasi Bencana Indonesia (DIBI)", penyedia: "BNPB", url: "https://dibi.bnpb.go.id", periode: "2008–2026", jumlah: "725 catatan, 243 kabupaten, 32 provinsi", guna: "Jumlah rumah rusak berat, sedang, dan ringan per kejadian dan kabupaten. Ini yang ingin diperkirakan.", ambil: "Diunduh manual sebagai CSV dari tab Tabular, filter Kategori = Gempabumi dan Is Bencana = TRUE (30 Okt 2026).", sebar: "Tidak. Ambil langsung dari portal DIBI; isinya terus diperbarui." },
      { nama: "Katalog gempa USGS (ComCat)", penyedia: "U.S. Geological Survey", url: "https://earthquake.usgs.gov/fdsnws/event/1/", periode: "M ≥ 4: 2008–2026 · M ≥ 5: 1973–2026", jumlah: "36.870 gempa M ≥ 4 · 12.727 gempa M ≥ 5 (6.596 gempa utama)", guna: "Mencocokkan kerusakan dengan gempanya dan menghitung riwayat guncangan, wilayah 11°LS–6°LU, 95–141°BT.", ambil: "Diunduh otomatis lewat API.", sebar: "Tidak. Datanya domain publik, tetapi mudah diunduh ulang dan kadang direvisi USGS." },
      { nama: "Batas kabupaten/kota", penyedia: "geoBoundaries (sumber BPS/OCHA, 2020)", url: "https://www.geoboundaries.org", periode: "2020", jumlah: "514 kabupaten/kota", guna: "Satuan wilayah, jarak ke gempa, dan luas.", ambil: "Diunduh otomatis.", sebar: "Ya, versi yang disederhanakan (±1 km) untuk peta di situs ini, dengan atribusi sesuai lisensi CC BY 4.0." },
      { nama: "WebAPI BPS (variabel 619 dan 621)", penyedia: "Badan Pusat Statistik", url: "https://webapi.bps.go.id", periode: "2004–2025", jumlah: "514 kabupaten/kota", guna: "Persentase penduduk miskin sebagai ukuran kerentanan. Jumlah penduduk dihitung dari jumlah penduduk miskin dibagi persentasenya.", ambil: "Lewat API dengan kunci gratis (perlu daftar akun BPS).", sebar: "Tidak. Akses lewat API resmi BPS." },
      { nama: "Buku Indeks Risiko Bencana Indonesia (IRBI) 2024", penyedia: "BNPB", url: "https://inarisk.bnpb.go.id", periode: "2024", jumlah: "514 skor gempa (512 dipakai)", guna: "Pembanding: skor risiko gempa resmi per kabupaten, halaman 226–243.", ambil: "PDF dari menu Unduhan InaRISK, lalu tabelnya dibaca dengan skrip.", sebar: "PDF-nya tidak. Skornya ditampilkan di peta sebagai pembanding, dengan sumber." },
      { nama: "SEOJK No. 6/SEOJK.05/2017, Lampiran III Tabel III.D", penyedia: "Otoritas Jasa Keuangan", url: "https://ojk.go.id", periode: "2017 (masih berlaku)", jumlah: "511 kabupaten/kota dengan zona gempa I–V", guna: "Pembanding dan analisis kesesuaian zona tarif.", ambil: "Lampiran diunduh dari halaman regulasi OJK, lalu tabelnya dibaca dengan skrip.", sebar: "Dokumennya tidak. Zonanya ditampilkan di peta, dengan sumber." },
    ],
    dikeluarkanJudul: "Data yang dikurangi atau tidak dipakai",
    kolKeluar: ["Yang dikeluarkan", "Jumlah", "Alasan"],
    dikeluarkan: [
      ["Catatan DIBI yang tidak ketemu gempanya", "20 dari 725", "Tidak ada gempa USGS dalam 300 km pada rentang tanggalnya"],
      ["Catatan DIBI dengan guncangan sangat lemah (dari data latih)", "39", "Kemungkinan salah pasang; penyebab sebenarnya gempa lokal kecil yang tidak tercatat USGS"],
      ["Samosir dan Toba Samosir", "2 kabupaten", "Tabel IRBI 2024 menulis \"Toba Samosir\" dua kali"],
      ["PDRB kabupaten", "seluruh variabel", "Hanya ada 2022–2025, jadi berisiko membocorkan informasi masa depan ke data latih 2008–2019"],
      ["Penetrasi asuransi per kabupaten", "–", "Tidak tersedia untuk publik"],
      ["Data eksposur, polis, dan klaim perusahaan", "–", "Sengaja tidak dipakai; penelitian ini 100% data publik"],
    ],
    fileJudul: "File yang dipakai situs ini",
    file: ["/data/kabupaten.geojson", " berisi batas wilayah yang disederhanakan beserta hasil per kabupaten, dan ", "/data/ringkasan.json", " berisi tabel hasil uji, uji ulang, dan pengelompokan zona.", " Keduanya hasil olahan penelitian ini; batas wilayahnya tetap mengikuti lisensi CC BY 4.0 geoBoundaries."],
  },
  en: {
    label: "About",
    judul: "Data",
    pengantar:
      "All data come from public sources. This site only shows the derived results of this study (risk scores, zones, and comparisons) and simplified district boundaries. The raw data are not redistributed here; links and instructions for getting them are below.",
    sumber: "Data sources",
    kol: ["Period", "Size", "Used for", "How to get it", "Shared here?"],
    akses: "The research version of the data was accessed or downloaded on 30-31 October 2026.",
    data: [
      { nama: "Indonesian Disaster Information Data (DIBI)", penyedia: "BNPB", url: "https://dibi.bnpb.go.id", periode: "2008-2026", jumlah: "725 records, 243 districts, 32 provinces", guna: "Counts of heavily, moderately, and lightly damaged houses per event and district. This is what the index tries to predict.", ambil: "Manual CSV export from the Tabular tab, filtered to Category = Earthquake and Is Disaster = TRUE (30 Oct 2026).", sebar: "No. Get it from the DIBI portal, which is updated continuously." },
      { nama: "USGS earthquake catalogue (ComCat)", penyedia: "U.S. Geological Survey", url: "https://earthquake.usgs.gov/fdsnws/event/1/", periode: "M ≥ 4: 2008-2026 · M ≥ 5: 1973-2026", jumlah: "36,870 events M ≥ 4 · 12,727 events M ≥ 5 (6,596 main shocks)", guna: "Matching damage to earthquakes and building the shaking history, covering 11°S-6°N, 95-141°E.", ambil: "Downloaded automatically through the API.", sebar: "No. The data are public domain, but easy to download again and sometimes revised by USGS." },
      { nama: "District boundaries", penyedia: "geoBoundaries (source: BPS/OCHA, 2020)", url: "https://www.geoboundaries.org", periode: "2020", jumlah: "514 districts", guna: "The spatial unit, distance to earthquakes, and area.", ambil: "Downloaded automatically.", sebar: "Yes, a simplified version (about 1 km) for the map on this site, with attribution under CC BY 4.0." },
      { nama: "BPS WebAPI (variables 619 and 621)", penyedia: "Statistics Indonesia (BPS)", url: "https://webapi.bps.go.id", periode: "2004-2025", jumlah: "514 districts", guna: "Poverty rate as a measure of vulnerability. Population is derived as the number of poor people divided by the poverty rate.", ambil: "Through the API with a free key (requires a BPS account).", sebar: "No. Use the official BPS API." },
      { nama: "Indonesian Disaster Risk Index (IRBI) 2024", penyedia: "BNPB", url: "https://inarisk.bnpb.go.id", periode: "2024", jumlah: "514 earthquake scores (512 used)", guna: "Benchmark: the official earthquake risk score per district, pages 226-243.", ambil: "PDF from the InaRISK Downloads menu; the table is read with a script.", sebar: "Not the PDF. The scores appear on the map as a benchmark, with the source cited." },
      { nama: "OJK Circular No. 6/SEOJK.05/2017, Appendix III Table III.D", penyedia: "Financial Services Authority (OJK)", url: "https://ojk.go.id", periode: "2017 (still in force)", jumlah: "511 districts with earthquake zones I-V", guna: "Benchmark and agreement analysis of tariff zones.", ambil: "Appendix downloaded from the OJK regulations page; the table is read with a script.", sebar: "Not the document. The zones appear on the map, with the source cited." },
    ],
    dikeluarkanJudul: "Data reduced or left out",
    kolKeluar: ["Excluded", "Amount", "Reason"],
    dikeluarkan: [
      ["DIBI records with no matching earthquake", "20 of 725", "No USGS earthquake within 300 km in the date window"],
      ["DIBI records with very weak shaking (training data only)", "39", "Probably mismatched; the real cause was likely a small local earthquake missing from USGS"],
      ["Samosir and Toba Samosir", "2 districts", "The IRBI 2024 table lists \"Toba Samosir\" twice"],
      ["District GDP", "entire variable", "Only available for 2022-2025, which would leak future information into the 2008-2019 training data"],
      ["Insurance penetration by district", "–", "Not publicly available"],
      ["Company exposure, policy, and claims data", "–", "Deliberately excluded; the study uses public data only"],
    ],
    fileJudul: "Files used by this site",
    file: ["/data/kabupaten.geojson", " holds the simplified boundaries with the results for each district, and ", "/data/ringkasan.json", " holds the test, resampling, and zoning tables.", " Both are outputs of this research; the boundaries remain under the geoBoundaries CC BY 4.0 licence."],
  },
};

export default function Dataset({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <Halaman label={t.label} judul={t.judul} pengantar={<p>{t.pengantar}</p>}>
      <Bagian judul={t.sumber}>
        <div className="grid gap-4 md:grid-cols-2">
          {t.data.map((d) => (
            <article key={d.nama} className="rounded-[1.25rem] border border-base-300 p-5">
              <h3 className="font-semibold">{d.nama}</h3>
              <p className="text-sm text-base-content/60">
                {d.penyedia} ·{" "}
                <a href={d.url} className="link" target="_blank" rel="noreferrer">
                  {d.url.replace(/^https:\/\//, "")}
                </a>
              </p>
              <dl className="mt-4 grid grid-cols-[120px_1fr] gap-x-3 gap-y-2 text-sm">
                {[d.periode, d.jumlah, d.guna, d.ambil, d.sebar].map((v, i) => (
                  <div key={i} className="contents">
                    <dt className="text-base-content/60">{t.kol[i]}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-base-content/60">{t.akses}</p>
      </Bagian>

      <Bagian judul={t.dikeluarkanJudul}>
        <div className="overflow-x-auto rounded-[1.25rem] border border-base-300">
          <table className="table">
            <thead>
              <tr>
                {t.kolKeluar.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.dikeluarkan.map(([a, b, c]) => (
                <tr key={a}>
                  <td>{a}</td>
                  <td className="whitespace-nowrap">{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Bagian>

      <Bagian judul={t.fileJudul}>
        <p className="max-w-3xl text-base-content/75">
          <code className="rounded bg-base-200 px-1">{t.file[0]}</code>
          {t.file[1]}
          <code className="rounded bg-base-200 px-1">{t.file[2]}</code>
          {t.file[3]}
          {t.file[4]}
        </p>
      </Bagian>
    </Halaman>
  );
}
