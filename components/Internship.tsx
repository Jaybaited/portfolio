import { average, companies, criteria, recommendation } from "@/lib/internship";
import { Reveal } from "./Reveal";

const TINT = ["bg-accent", "bg-soft", "bg-good"];
const TEXT = ["text-accent", "text-soft", "text-good"];

function Bar({ value, tint }: { value: number; tint: string }) {
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

/** Company and HTE evaluation: top 3 target companies, criteria, comparison table, recommendation. */
export function Internship() {
  const ranked = [...companies].sort((a, b) => average(b) - average(a));
  return (
    <section id="internship" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                <span className="text-accent">06</span> / Company &amp; HTE evaluation
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[clamp(40px,6vw,96px)] font-semibold leading-[0.9] tracking-[-0.045em]">
                Where I want to <span className="font-serif font-normal italic tracking-normal text-accent">start.</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-muted">
                My top three Host Training Establishments, rated 1 to 5 on six criteria. I am not just looking for a place to finish my hours,
                but for a place where I can learn, grow and take my first step toward the career I want.
              </p>
            </Reveal>
          </div>
          <Reveal delay={180}>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {criteria.map((c) => (
                <li key={c.key} className="border-t border-line pt-2">
                  <p className="font-semibold">{c.label}</p>
                  <p className="text-muted">{c.hint}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* the three companies */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {companies.map((c, i) => (
            <Reveal key={c.name} delay={i * 90} className="flex flex-col rounded-3xl border border-line p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${TEXT[i]}`}>Choice 0{i + 1} · {c.industry}</p>
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
              <p className="mt-4 text-[15px] leading-relaxed">{c.background}</p>

              <blockquote className={`mt-5 border-l-2 pl-4 font-serif text-lg italic leading-snug ${["border-accent", "border-soft", "border-good"][i]}`}>
                “{c.why}”
              </blockquote>

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

              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Career growth</p>
              <p className="mt-1 text-sm">{c.growth}</p>

              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {criteria.map((k) => (
                  <li key={k.key} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted">{k.label}</span>
                    <Bar value={c.scores[k.key]} tint={TINT[i]} />
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
            </Reveal>
          ))}
        </div>

        {/* comparative table */}
        <Reveal className="mt-16">
          <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Side by <span className="font-serif font-normal italic text-accent">side</span>
          </h3>
        </Reveal>
        <Reveal delay={80} className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Comparative evaluation of the three companies, scored 1 to 5</caption>
            <thead className="bg-faint">
              <tr>
                <th scope="col" className="px-5 py-4 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-muted">Criteria</th>
                {companies.map((c, i) => (
                  <th key={c.name} scope="col" className={`px-5 py-4 text-base font-semibold ${TEXT[i]}`}>
                    {c.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <th scope="row" className="px-5 py-3 font-medium">Industry</th>
                {companies.map((c) => (
                  <td key={c.name} className="px-5 py-3 text-muted">{c.industry}</td>
                ))}
              </tr>
              {criteria.map((k) => (
                <tr key={k.key} className="border-t border-line">
                  <th scope="row" className="px-5 py-3 font-medium">{k.label}</th>
                  {companies.map((c, i) => (
                    <td key={c.name} className="px-5 py-3">
                      <Bar value={c.scores[k.key]} tint={TINT[i]} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line bg-faint">
                <th scope="row" className="px-5 py-4 font-semibold">Overall rating</th>
                {companies.map((c) => (
                  <td key={c.name} className="px-5 py-4 text-2xl font-semibold tabular-nums tracking-tight">
                    {average(c).toFixed(2)}
                    {c.name === ranked[0].name && <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-[0.16em] text-accent">Top pick</span>}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Reveal>

        {/* recommendation */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-fg p-8 text-bg md:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent opacity-30 blur-3xl" />
            <p className="relative font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">Final recommendation</p>
            <p className="relative mt-4 text-[clamp(32px,5vw,64px)] font-semibold leading-[0.95] tracking-[-0.04em]">
              {recommendation.pick}
              <span className="text-accent">.</span>
            </p>
            <p className="relative mt-6 max-w-3xl text-lg leading-relaxed opacity-85">{recommendation.summary}</p>
            <p className="relative mt-4 max-w-3xl leading-relaxed opacity-70">{recommendation.prepares}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
