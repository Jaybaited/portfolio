"use client";

import { useEffect, useRef, useState } from "react";
import { archive, featured, projects, type Project } from "@/lib/content";
import { useFinePointer } from "@/lib/hooks";
import { Reveal } from "./Reveal";
import { Shot } from "./Shot";
import { Scramble } from "./Scramble";

function Status({ status }: { status: Project["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]">
      <span className={`h-1.5 w-1.5 rounded-full ${status === "Live" ? "animate-pulse bg-good" : "bg-current opacity-40"}`} />
      {status}
    </span>
  );
}

function ExtLink({ href, label, solid = false }: { href: string; label: string; solid?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="Open"
      className={`group/l inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
        solid ? "bg-fg text-bg hover:bg-accent hover:text-ink" : "border border-line hover:border-fg"
      }`}
    >
      {label}
      <span className="transition-transform duration-300 group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5">↗</span>
    </a>
  );
}

function Featured() {
  const p = featured;
  return (
    <article className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
      <Reveal>
        <a
          href={p.links[0].href}
          target="_blank"
          rel="noreferrer"
          data-cursor="Visit"
          className="group block overflow-hidden rounded-[18px] border border-line bg-ink"
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6a3d]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#b4a7ff]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8fd3a6]" />
            <span className="ml-3 truncate font-mono text-[10px] text-white/40">safecheck-signspeak-sllf.vercel.app</span>
          </div>
          {p.image && (
            <Shot image={p.image} sizes="(min-width: 1024px) 60vw, 100vw" className="[&_img]:group-hover:scale-[1.02]" />
          )}
        </a>
      </Reveal>

      <div className="flex flex-col">
        <Reveal delay={60}>
          <div className="flex flex-wrap items-center gap-3">
            <Status status={p.status} />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {p.kind} · {p.years}
            </span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h3 className="mt-5 text-[clamp(36px,4.4vw,64px)] font-semibold leading-[0.92] tracking-[-0.045em]">
            <Scramble text={p.title} />
          </h3>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">{p.role}</p>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 text-lg leading-relaxed">{p.summary}</p>
        </Reveal>
        <Reveal delay={220}>
          <ul className="mt-6 space-y-3 border-t border-line pt-6">
            {p.points.map((pt, i) => (
              <li key={pt} className="flex gap-4 text-[15px] leading-snug">
                <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                {pt}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={260}>
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <li key={s} className="rounded-full bg-faint px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={300} className="mt-8 flex flex-wrap gap-3">
          {p.links.map((l, i) => (
            <ExtLink key={l.href} href={l.href} label={l.label} solid={i === 0} />
          ))}
        </Reveal>
        {p.research && (
          <Reveal delay={340}>
            <p className="mt-8 border-l border-line pl-4 text-[13px] italic leading-relaxed text-muted">
              <span className="mb-1 block font-mono text-[10px] not-italic uppercase tracking-[0.16em]">Research title</span>
              {p.research}
            </p>
          </Reveal>
        )}
      </div>
    </article>
  );
}

/** Placeholder art for projects without a screenshot. */
function TypeArt({ p }: { p: Project }) {
  return (
    <div className="flex aspect-[16/9] flex-col justify-between bg-ink p-6 text-paper">
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
        <span>{p.stack.join(" · ")}</span>
        <span>Desktop</span>
      </div>
      <div>
        <p className="font-mono text-[11px] text-white/40">Usage tracking · timekeeping</p>
        <p className="mt-2 text-4xl font-semibold leading-none tracking-tight">{p.title}</p>
      </div>
      <div className="grid grid-cols-8 gap-1" aria-hidden>
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className={`h-5 rounded-sm ${[1, 2, 5, 9, 10, 13].includes(i) ? "bg-white/70" : "bg-white/10"}`} />
        ))}
      </div>
    </div>
  );
}

function ProjectRow({
  p,
  i,
  open,
  onToggle,
  onHover,
}: {
  p: Project;
  i: number;
  open: boolean;
  onToggle: () => void;
  onHover: (p: Project | null) => void;
}) {
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        onPointerEnter={() => onHover(p)}
        onPointerLeave={() => onHover(null)}
        aria-expanded={open}
        aria-controls={`proj-${p.slug}`}
        data-cursor={open ? "Close" : "Open"}
        className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 text-left md:grid-cols-[4rem_1.4fr_1fr_auto] md:py-9"
      >
        <span className="font-mono text-xs text-muted">0{i + 2}</span>
        <span className="text-[clamp(26px,3.6vw,52px)] font-semibold leading-none tracking-[-0.04em] transition-[transform,color] duration-500 ease-out group-hover:translate-x-3 group-hover:text-accent">
          {p.title}
        </span>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:block">{p.role}</span>
        <span className="flex items-center gap-3">
          <span className="hidden sm:inline-flex">
            <Status status={p.status} />
          </span>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg transition-transform duration-500 ${
              open ? "rotate-45 bg-fg text-bg" : ""
            }`}
            aria-hidden
          >
            +
          </span>
        </span>
      </button>

      <div
        id={`proj-${p.slug}`}
        className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="grid gap-8 pb-10 md:grid-cols-[4rem_1fr_1fr] md:gap-10">
            <span className="hidden md:block" />
            <div className="group overflow-hidden rounded-[14px] border border-line">
              {p.image ? <Shot image={p.image} sizes="(min-width: 768px) 45vw, 100vw" /> : <TypeArt p={p} />}
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {p.kind}
                {p.years ? ` · ${p.years}` : ""}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] md:hidden">{p.role}</p>
              <p className="mt-4 text-[17px] leading-relaxed">{p.summary}</p>
              <ul className="mt-5 space-y-2 text-[15px] text-muted">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span aria-hidden>—</span>
                    {pt}
                  </li>
                ))}
              </ul>
              {p.research && (
                <p className="mt-5 border-l border-line pl-4 text-[13px] italic leading-relaxed text-muted">{p.research}</p>
              )}
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li key={s} className="rounded-full bg-faint px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                    {s}
                  </li>
                ))}
              </ul>
              {p.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {p.links.map((l) => (
                    <ExtLink key={l.href} href={l.href} label={l.label} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Floating screenshot that follows the cursor over the project list (desktop only). */
function HoverPreview({ project }: { project: Project | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<Project | null>(null);
  if (project && project !== shown) setShown(project);
  useEffect(() => {
    const pos = { x: -2000, y: -2000 }, tgt = { x: -2000, y: -2000 };
    let raf = 0;
    const move = (e: PointerEvent) => {
      tgt.x = e.clientX;
      tgt.y = e.clientY;
    };
    const loop = () => {
      pos.x += (tgt.x - pos.x) * 0.12;
      pos.y += (tgt.y - pos.y) * 0.12;
      const tilt = Math.max(-8, Math.min(8, (tgt.x - pos.x) * 0.06));
      if (ref.current) ref.current.style.transform = `translate3d(${pos.x + 28}px, ${pos.y - 110}px, 0) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 w-[340px]">
      <div
        className="overflow-hidden rounded-xl border border-black/10 shadow-2xl transition-[opacity,transform] duration-300"
        style={{ opacity: project ? 1 : 0, transform: project ? "scale(1)" : "scale(0.85)" }}
      >
        {shown && (shown.image ? <Shot image={shown.image} sizes="340px" color /> : <TypeArt p={shown} />)}
      </div>
    </div>
  );
}

export function Projects() {
  const fine = useFinePointer();
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<Project | null>(null);

  return (
    <section id="work" className="flip relative py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                <span className="text-accent">01</span> / Selected work
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[clamp(44px,7vw,112px)] font-semibold leading-[0.88] tracking-[-0.05em]">
                Things I&apos;ve <span className="font-serif font-normal italic tracking-normal text-accent">built</span>
                <br />
                and designed.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-sm text-muted">
              School, thesis, freelance and capstone work. Every role below is the part I actually did.
            </p>
          </Reveal>
        </div>

        <Featured />

        <ul className="mt-24 border-t border-line">
          {projects.map((p, i) => (
            <ProjectRow
              key={p.slug}
              p={p}
              i={i}
              open={open === p.slug}
              onToggle={() => setOpen((o) => (o === p.slug ? null : p.slug))}
              onHover={(proj) => setHover(proj && open !== proj.slug ? proj : null)}
            />
          ))}
        </ul>

        <div className="mt-20 grid gap-8 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-muted">Archive · school systems</h3>
            <p className="mt-3 max-w-xs text-sm text-muted">Earlier C# and JavaScript projects from my third year at STI. Source code on GitHub.</p>
          </Reveal>
          <ul>
            {archive.map((a, i) => (
              <Reveal as="li" key={a.href} delay={i * 50}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Code"
                  className="group flex items-baseline justify-between gap-4 border-b border-line py-4"
                >
                  <span className="text-lg font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                    {a.title}
                  </span>
                  <span className="flex shrink-0 items-baseline gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <span className="hidden sm:inline">{a.note}</span>
                    <span>{a.stack}</span>
                    <span aria-hidden>↗</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
      {fine && <HoverPreview project={hover} />}
    </section>
  );
}
