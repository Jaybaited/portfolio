import { softSkills } from "@/lib/internship";
import { Reveal } from "./Reveal";

const DOTS = ["bg-accent", "bg-soft", "bg-good", "bg-[#7cc6fe]", "bg-[#ffd166]", "bg-[#ff8fa3]", "bg-fg/40", "bg-fg"];

/** Soft skills, each with a line of evidence from real work. Sits under the technical skills keyboard. */
export function SoftSkills() {
  return (
    <section aria-labelledby="soft-skills" className="relative pb-28 md:pb-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <h3 id="soft-skills" className="text-3xl font-semibold tracking-tight md:text-4xl">
            And the <span className="font-serif font-normal italic text-accent">people</span> skills.
          </h3>
        </Reveal>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {softSkills.map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 50} className="bg-bg p-6">
              <p className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <span className={`h-2.5 w-2.5 rounded-[3px] ${DOTS[i % DOTS.length]}`} aria-hidden />
                {s.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.proof}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
