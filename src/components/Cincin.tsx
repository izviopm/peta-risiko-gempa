/** Cincin progres SVG (server component). Warna dari token tema agar senada di mode terang dan gelap. */
export default function Cincin({ nilai, label, teks, ukuran = 168 }: { nilai: number; label: string; teks: string; ukuran?: number }) {
  const r = 70;
  const keliling = 2 * Math.PI * r;
  const isi = Math.max(0, Math.min(1, nilai)) * keliling;
  return (
    <div className="relative grid shrink-0 place-items-center rounded-full bg-base-200" style={{ width: ukuran, height: ukuran }} role="img" aria-label={`${label}: ${teks}`}>
      <svg viewBox="0 0 168 168" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="84" cy="84" r={r} fill="none" stroke="var(--color-base-300)" strokeWidth="10" />
        <circle cx="84" cy="84" r={r} fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${isi} ${keliling}`} />
      </svg>
      <div className="text-center">
        <p className="text-3xl font-semibold tracking-tight">{teks}</p>
        <p className="text-xs text-base-content/65">{label}</p>
      </div>
    </div>
  );
}
