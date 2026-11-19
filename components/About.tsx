import { profile, timeline } from "@/lib/content";
import { Reveal } from "./Reveal";

const KIND_COLOR: Record<string, string> = {
  Award: "bg-accent",
  Project: "bg-soft",
  Work: "bg-good",
  Certificate: "bg-fg/40",
  Education: "bg-fg",
};

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:px-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
              <span className="text-accent">04</span> / About
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
          <Reveal delay={320}>
            <ul className="mt-10 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
              {["English", "Filipino", "Team player", "Fast learner"].map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1.5">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:pt-24">
          <Reveal>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-muted">Timeline</h3>
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
    </section>
  );
}
