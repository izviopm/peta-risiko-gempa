"use client";

import { useState } from "react";

const id = (n: number, d = 3) => n.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
const pos = (v: number, [a, b]: [number, number]) => `${((v - a) / (b - a)) * 100}%`;

/** Dot plot satu seri: titik per indeks, garis acuan (0 atau 0,5). */
export function DotPlot({
  judul,
  baris,
  domain,
  acuan,
  acuanLabel,
}: {
  judul: string;
  baris: { label: string; nilai: number; sorot?: boolean }[];
  domain: [number, number];
  acuan: number;
  acuanLabel: string;
}) {
  return (
    <figure className="rounded-[1.25rem] bg-base-200/60 p-5">
      <figcaption className="font-medium">{judul}</figcaption>
      <div className="mt-4 space-y-1">
        {baris.map((b) => (
          <div key={b.label} className="grid grid-cols-[130px_1fr_52px] items-center gap-3 text-sm">
            <span className={b.sorot ? "font-semibold" : "text-base-content/75"}>{b.label}</span>
            <div className="relative h-8">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--viz-grid)]" />
              <div className="absolute inset-y-0 w-px bg-[var(--viz-axis)]" style={{ left: pos(acuan, domain) }} />
              <div className="absolute top-1/2 h-0.5 bg-[var(--viz-1)] opacity-40" style={{ left: `min(${pos(acuan, domain)}, ${pos(b.nilai, domain)})`, width: `${(Math.abs(b.nilai - acuan) / (domain[1] - domain[0])) * 100}%` }} />
              <span
                className="group absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: pos(b.nilai, domain) }}
                tabIndex={0}
                aria-label={`${b.label}: ${id(b.nilai)}`}
              >
                <span className={`block rounded-full ring-2 ring-[var(--viz-surface)] ${b.sorot ? "h-3.5 w-3.5 bg-[var(--viz-2)]" : "h-3 w-3 bg-[var(--viz-1)]"}`} />
                <span className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded bg-neutral px-2 py-1 text-xs text-neutral-content group-hover:block group-focus:block">
                  {b.label}: {id(b.nilai)}
                </span>
              </span>
            </div>
            <span className="text-right tabular-nums">{id(b.nilai)}</span>
          </div>
        ))}
        <div className="grid grid-cols-[130px_1fr_52px] gap-3 text-xs text-[var(--viz-muted)]">
          <span />
          <div className="relative h-4">
            <span className="absolute -translate-x-1/2" style={{ left: pos(acuan, domain) }}>
              {acuanLabel}
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}

/** Forest plot selisih bootstrap: titik + IK 95%, dua skema per pembanding. */
export function Forest({
  judul,
  baris,
  domain,
}: {
  judul: string;
  baris: { grup: string; skema: string; est: number; lo: number; hi: number; sig: boolean }[];
  domain: [number, number];
}) {
  return (
    <figure className="rounded-[1.25rem] bg-base-200/60 p-5">
      <figcaption className="font-medium">{judul}</figcaption>
      <div className="mt-4">
        {baris.map((b, i) => (
          <div key={b.grup + b.skema} className={`grid grid-cols-[150px_1fr_110px] items-center gap-3 text-sm ${i % 2 === 0 && i > 0 ? "mt-2" : ""}`}>
            <span className="text-base-content/75">
              {i % 2 === 0 ? <span className="font-medium text-base-content">{b.grup}</span> : null}
              <span className="block text-xs text-base-content/60">{b.skema}</span>
            </span>
            <div className="relative h-7">
              <div className="absolute inset-y-0 w-px bg-[var(--viz-axis)]" style={{ left: pos(0, domain) }} />
              <div className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded bg-[var(--viz-1)]" style={{ left: pos(b.lo, domain), width: `${((b.hi - b.lo) / (domain[1] - domain[0])) * 100}%` }} />
              <span
                className="group absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: pos(b.est, domain) }}
                tabIndex={0}
                aria-label={`${b.grup}, ${b.skema}: ${id(b.est)} (${id(b.lo)} sampai ${id(b.hi)})`}
              >
                <span className={`block h-3 w-3 rounded-full ring-2 ring-[var(--viz-surface)] ${b.sig ? "bg-[var(--viz-1)]" : "border-2 border-[var(--viz-1)] bg-[var(--viz-surface)]"}`} />
                <span className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded bg-neutral px-2 py-1 text-xs text-neutral-content group-hover:block group-focus:block">
                  {id(b.est)} [{id(b.lo)}; {id(b.hi)}]
                </span>
              </span>
            </div>
            <span className="text-right text-xs tabular-nums">
              {id(b.est)}
              {b.sig ? " *" : ""}
            </span>
          </div>
        ))}
        <div className="grid grid-cols-[150px_1fr_110px] gap-3 text-xs text-[var(--viz-muted)]">
          <span />
          <div className="relative h-4">
            <span className="absolute -translate-x-1/2" style={{ left: pos(0, domain) }}>
              0 (tidak ada selisih)
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-base-content/60">Titik penuh dan * = IK 95% tidak mencakup 0. Titik kosong = tidak signifikan.</p>
      </div>
    </figure>
  );
}

/** Garis R² antar-zona terhadap k untuk SKATER dan K-Means. */
export function GarisK({ data }: { data: { k: number; R2_skater: number; R2_kmeans: number }[] }) {
  const [aktif, setAktif] = useState<number | null>(null);
  const W = 560,
    H = 260,
    m = { l: 44, r: 84, t: 12, b: 36 };
  const ks = data.map((d) => d.k);
  const x = (k: number) => m.l + ((k - ks[0]) / (ks.at(-1)! - ks[0])) * (W - m.l - m.r);
  const y = (v: number) => m.t + (1 - (v - 0.5) / 0.5) * (H - m.t - m.b);
  const garis = (key: "R2_skater" | "R2_kmeans") => data.map((d, i) => `${i ? "L" : "M"}${x(d.k)},${y(d[key])}`).join("");
  const seri = [
    { key: "R2_kmeans" as const, label: "K-Means", warna: "var(--viz-1)" },
    { key: "R2_skater" as const, label: "SKATER", warna: "var(--viz-2)" },
  ];
  const a = aktif == null ? null : data[aktif];
  return (
    <figure className="rounded-[1.25rem] bg-base-200/60 p-5">
      <figcaption className="font-medium">Homogenitas zona (R² antar-zona) menurut jumlah zona k</figcaption>
      <div className="mt-2 flex gap-4 text-sm">
        {seri.map((s) => (
          <span key={s.key} className="flex items-center gap-2">
            <span className="inline-block h-0.5 w-5" style={{ background: s.warna }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="R² antar-zona SKATER dan K-Means untuk k 5 sampai 40" onMouseLeave={() => setAktif(null)}>
          {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((t) => (
            <g key={t}>
              <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="var(--viz-grid)" />
              <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--viz-muted)">
                {id(t, 1)}
              </text>
            </g>
          ))}
          {ks.map((k) => (
            <text key={k} x={x(k)} y={H - m.b + 18} textAnchor="middle" fontSize="11" fill="var(--viz-muted)">
              {k}
            </text>
          ))}
          <text x={(W - m.r + m.l) / 2} y={H - 4} textAnchor="middle" fontSize="11" fill="var(--viz-muted)">
            jumlah zona k
          </text>
          {a && <line x1={x(a.k)} x2={x(a.k)} y1={m.t} y2={H - m.b} stroke="var(--viz-axis)" />}
          {seri.map((s) => (
            <g key={s.key}>
              <path d={garis(s.key)} fill="none" stroke={s.warna} strokeWidth="2" />
              {data.map((d) => (
                <circle key={d.k} cx={x(d.k)} cy={y(d[s.key])} r="4" fill={s.warna} stroke="var(--viz-surface)" strokeWidth="2" />
              ))}
              <text x={W - m.r + 8} y={y(data.at(-1)![s.key]) + 4} fontSize="12" fill="currentColor">
                {s.label}
              </text>
            </g>
          ))}
          {data.map((d, i) => (
            <rect key={d.k} x={x(d.k) - 20} y={m.t} width="40" height={H - m.t - m.b} fill="transparent" onMouseEnter={() => setAktif(i)} />
          ))}
        </svg>
        {a && (
          <div className="pointer-events-none absolute top-2 rounded bg-neutral px-2 py-1 text-xs text-neutral-content" style={{ left: `${(x(a.k) / W) * 100}%`, transform: "translateX(-50%)" }}>
            k = {a.k}: K-Means {id(a.R2_kmeans)} · SKATER {id(a.R2_skater)}
          </div>
        )}
      </div>
    </figure>
  );
}
