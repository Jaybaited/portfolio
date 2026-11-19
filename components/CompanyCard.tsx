"use client";

import { useState } from "react";
import { average, criteria, type Company } from "@/lib/internship";

export function Bar({ value, tint }: { value: number; tint: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`h-1.5 w-4 rounded-full ${n <= value ? tint : "bg-line"}`} />
        ))}
      </span>
      <span className="font-mono text-xs tabular-nums">{value}/5</span>
    </span>
  );
}

/** One company: a short summary that opens into the full evaluation. */
export function CompanyCard({
  company: c,
  index: i,
  tint,
  text,
  border,
}: {
  company: Company;
  index: number;
  tint: string;
  text: string;
  border: string;
}) {
  const [open, setOpen] = useState(false);
  const id = `company-${i}`;

  return (
    <article className="flex flex-col rounded-3xl border border-line p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${text}`}>Choice 0{i + 1} · {c.industry}</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight">{c.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tabular-nums tracking-tight">{average(c).toFixed(2)}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">of 5</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Location · </span>
        {c.location}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed">{c.growth}</p>

      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Background</p>
          <p className="mt-1 text-[15px] leading-relaxed">{c.background}</p>

          <blockquote className={`mt-5 border-l-2 pl-4 font-serif text-lg italic leading-snug ${border}`}>“{c.why}”</blockquote>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Learning &amp; training</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {c.learning.map((l) => (
              <li key={l} className="flex gap-2">
                <span aria-hidden className="text-muted">—</span>
                {l}
              </li>
            ))}
          </ul>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-good">Advantages</p>
              <ul className="mt-2 space-y-1.5">
                {c.pros.map((p) => (
                  <li key={p}>+ {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bad">Disadvantages</p>
              <ul className="mt-2 space-y-1.5">
                {c.cons.map((p) => (
                  <li key={p}>− {p}</li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="mt-6 space-y-2 border-t border-line pt-5">
            {criteria.map((k) => (
              <li key={k.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">{k.label}</span>
                <Bar value={c.scores[k.key]} tint={tint} />
              </li>
            ))}
          </ul>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Sources</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            {c.sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="u-link pb-0.5 text-muted hover:text-fg">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="group mt-6 flex items-center justify-between gap-3 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.16em]"
      >
        {open ? "Hide the evaluation" : "Read the full evaluation"}
        <span
          aria-hidden
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-line text-base transition-transform duration-500 group-hover:border-fg ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
    </article>
  );
}
