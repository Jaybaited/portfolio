import { average, companies, criteria, recommendation } from "@/lib/internship";
import { Bar, CompanyCard } from "./CompanyCard";
import { Reveal } from "./Reveal";

const TINT = ["bg-accent", "bg-soft", "bg-good"];
const TEXT = ["text-accent", "text-soft", "text-good"];
const BORDER = ["border-accent", "border-soft", "border-good"];

/** Company and HTE evaluation: top 3 target companies, criteria, comparison table, recommendation. */
export function Internship() {
  const ranked = [...companies].sort((a, b) => average(b) - average(a));
  return (
    <section id="internship" className="flip relative py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                <span className="text-accent">05</span> / Company &amp; HTE evaluation
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

        {/* the three companies: summaries that open into the full evaluation */}
        <div className="mt-16 grid items-start gap-6 lg:grid-cols-3">
          {companies.map((c, i) => (
            <Reveal key={c.name} delay={i * 90}>
              <CompanyCard company={c} index={i} tint={TINT[i]} text={TEXT[i]} border={BORDER[i]} />
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
