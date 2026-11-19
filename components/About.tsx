import { profile, timeline } from "@/lib/content";
import { careerObjective, immersionGoals, personalInfo } from "@/lib/internship";
import { Reveal } from "./Reveal";

const KIND_COLOR: Record<string, string> = {
  Award: "bg-accent",
  Project: "bg-soft",
  Work: "bg-good",
  Certificate: "bg-fg/40",
  Education: "bg-fg",
};

/** Professional profile and résumé: intro, career objective, immersion goals, personal info, timeline. */
export function About({ hasResume }: { hasResume: boolean }) {
  return (
    <section id="about" className="flip relative py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                <span className="text-accent">03</span> / Profile &amp; résumé
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[clamp(40px,5.5vw,84px)] font-semibold leading-[0.9] tracking-[-0.045em]">
                End to end,
                <br />
                <span className="font-serif font-normal italic tracking-normal text-muted">front to back.</span>
              </h2>
            </Reveal>
            <div className="mt-10 max-w-xl space-y-5 text-lg leading-relaxed">
              {profile.about.map((p, i) => (
                <Reveal key={i} delay={120 + i * 60}>
                  <p className={i === 0 ? "" : "text-muted"}>{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-10 max-w-xl rounded-2xl border border-line p-6">
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Career objective
                </p>
                <p className="mt-3 font-serif text-2xl italic leading-snug">{careerObjective}</p>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <dl className="mt-8 grid max-w-xl gap-x-8 gap-y-4 sm:grid-cols-2">
                {personalInfo.map((p) => (
                  <div key={p.label} className="border-t border-line pt-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{p.label}</dt>
                    <dd className="mt-1">{p.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {hasResume && (
              <Reveal delay={280}>
                <a
                  href="/resume.pdf"
                  download="Ciejay-Fortu-Resume.pdf"
                  data-cursor="Download"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors hover:bg-accent hover:text-ink"
                >
                  Download résumé (PDF)
                  <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
                </a>
              </Reveal>
            )}
          </div>

          <div className="lg:pt-24">
            <Reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-muted">Education, work &amp; achievements</h3>
            </Reveal>
            <ol className="relative mt-6 border-l border-line">
              {timeline.map((t, i) => (
                <Reveal as="li" key={t.title} delay={i * 60} className="group relative py-5 pl-8">
                  <span
                    aria-hidden
                    className={`absolute -left-[5px] top-7 h-2.5 w-2.5 rounded-full ring-4 ring-bg transition-transform duration-300 group-hover:scale-150 ${KIND_COLOR[t.kind] ?? "bg-fg"}`}
                  />
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {t.year} · {t.kind}
                  </p>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight md:text-2xl">{t.title}</p>
                  <p className="mt-1 text-muted">{t.place}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        {/* work immersion goals */}
        <div className="mt-24">
          <Reveal>
            <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Work immersion <span className="font-serif font-normal italic text-accent">goals</span>
            </h3>
          </Reveal>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {immersionGoals.map((g, i) => (
              <Reveal as="li" key={g.title} delay={i * 70} className="rounded-2xl border border-line p-5">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <p className="mt-3 text-lg font-semibold leading-tight tracking-tight">{g.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{g.detail}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
