import { careerPlan, reflection, reflectionQuestion } from "@/lib/internship";
import { Reveal } from "./Reveal";

const DOT = ["bg-accent", "bg-soft", "bg-good"];

/** Reflection on preparing for Work Immersion, plus a 3 to 5 year career plan. */
export function Reflection() {
  return (
    <section id="reflection" className="relative py-28 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:px-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
              <span className="text-accent">06</span> / Reflection
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 max-w-3xl font-serif text-[clamp(30px,3.6vw,52px)] italic leading-[1.08]">“{reflectionQuestion}”</h2>
          </Reveal>
          <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed">
            {reflection.map((p, i) => (
              <Reveal key={i} delay={120 + i * 60}>
                <p className={i === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-accent" : "text-muted"}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:pt-24">
          <Reveal>
            <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
              My next <span className="font-serif font-normal italic text-accent">five years</span>
            </h3>
            <p className="mt-2 text-muted">A career development plan.</p>
          </Reveal>
          <ol className="relative mt-8 border-l border-line">
            {careerPlan.map((step, i) => (
              <Reveal as="li" key={step.when} delay={i * 80} className="relative pb-10 pl-8 last:pb-0">
                <span aria-hidden className={`absolute -left-[6px] top-1.5 h-3 w-3 rounded-full ring-4 ring-bg ${DOT[i % DOT.length]}`} />
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{step.when}</p>
                <p className="mt-1.5 text-2xl font-semibold tracking-tight">{step.title}</p>
                <ul className="mt-3 space-y-1.5 text-muted">
                  {step.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden>—</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
