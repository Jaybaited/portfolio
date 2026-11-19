"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { certificates, type Certificate } from "@/lib/internship";
import { Reveal } from "./Reveal";

const KIND_STYLE: Record<Certificate["kind"], string> = {
  Award: "bg-accent text-ink",
  "National Certificate": "bg-good text-ink",
  Course: "bg-soft text-ink",
};

/** Certificates and awards, with a full-size viewer. */
export function Certificates() {
  const [open, setOpen] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="achievements" className="flip relative py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                <span className="text-accent">05</span> / Achievements
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[clamp(40px,6vw,96px)] font-semibold leading-[0.9] tracking-[-0.045em]">
                Certificates <span className="font-serif font-normal italic tracking-normal text-accent">&amp;</span> awards
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <p className="max-w-sm text-muted">An award, a national certification and a course completion. Click one to see the full certificate.</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {certificates.map((c, i) => (
            <Reveal as="li" key={c.title} delay={i * 90}>
              <button
                type="button"
                onClick={() => setOpen(c)}
                data-cursor="View"
                className="group block w-full overflow-hidden rounded-2xl border border-line bg-faint text-left"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#e9e6df] p-5">
                  <Image
                    src={c.image}
                    alt={`${c.title} certificate`}
                    width={c.w}
                    height={c.h}
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="h-full w-auto max-w-full rounded-sm object-contain shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <span className={`inline-block rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${KIND_STYLE[c.kind]}`}>
                    {c.kind}
                  </span>
                  <p className="mt-3 text-lg font-semibold leading-snug tracking-tight">{c.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {c.issuer} · {c.date}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={open.title}>
          <button type="button" aria-label="Close" onClick={() => setOpen(null)} className="absolute inset-0 animate-[fadein_200ms_ease-out] bg-black/80 backdrop-blur-sm" />
          <figure className="relative max-h-full w-full max-w-4xl animate-[popin_260ms_cubic-bezier(0.2,0.9,0.3,1.2)]">
            <Image
              src={open.image}
              alt={`${open.title} certificate`}
              width={open.w}
              height={open.h}
              sizes="90vw"
              className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">
              <span>
                {open.issuer} · {open.date}
                {open.note ? ` · ${open.note}` : ""}
              </span>
              <button type="button" onClick={() => setOpen(null)} className="rounded-full border border-white/30 px-4 py-2 text-white hover:border-white">
                Close
              </button>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
