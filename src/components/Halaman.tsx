import Reveal from "./Reveal";

export function Halaman({ label, judul, pengantar, children }: { label?: string; judul: string; pengantar?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-3 pb-6 sm:px-5">
      <Reveal className="py-10 sm:py-12">
        {label && <span className="pil">{label}</span>}
        <h1 className="prosa mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{judul}</h1>
        {pengantar && <div className="prosa mt-4 max-w-3xl text-lg text-base-content/70">{pengantar}</div>}
      </Reveal>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

/** Satu blok konten dalam kartu bento. */
export function Bagian({ id, judul, keterangan, children, className = "" }: { id?: string; judul: string; keterangan?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Reveal className={className}>
      <section id={id} className="kartu scroll-mt-24 p-5 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{judul}</h2>
        {keterangan && <div className="prosa mt-2 max-w-3xl text-base-content/70">{keterangan}</div>}
        <div className="mt-5">{children}</div>
      </section>
    </Reveal>
  );
}
