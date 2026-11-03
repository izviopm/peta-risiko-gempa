import Reveal from "./Reveal";

export function Halaman({ judul, pengantar, children }: { judul: string; pengantar?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{judul}</h1>
        {pengantar && <div className="mt-4 max-w-3xl text-lg text-base-content/75">{pengantar}</div>}
      </Reveal>
      <div className="mt-10 space-y-14">{children}</div>
    </div>
  );
}

export function Bagian({ id, judul, children }: { id?: string; judul: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section id={id} className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{judul}</h2>
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  );
}
