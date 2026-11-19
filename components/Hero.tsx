import { profile } from "@/lib/content";
import { DotGrid } from "./DotGrid";
import { Magnetic } from "./Magnetic";
import { ProfileCard } from "./ProfileCard";
import { Scramble } from "./Scramble";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden text-fg">
      <DotGrid className="text-fg" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-6 px-5 pb-16 pt-28 md:px-10 lg:min-h-[100svh] lg:grid-cols-[1.25fr_1fr] lg:pt-20">
        <div className="relative z-10">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-fg/60">
            <span className="inline-block h-px w-10 bg-accent" />
            Portfolio · 2026
          </p>

          <h1 className="mt-6 text-[clamp(64px,13vw,184px)] font-semibold uppercase leading-[0.82] tracking-[-0.055em]">
            <Scramble text={profile.firstName.toUpperCase()} className="block" />
            <span className="flex items-baseline gap-4">
              <span>
                <Scramble text={profile.lastName.toUpperCase()} />
                <span className="text-accent">.</span>
              </span>
              <span className="font-serif text-[0.38em] font-normal normal-case italic tracking-normal text-fg/60">
                (dev)
              </span>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg/70 md:text-xl">
            <span className="text-fg">{profile.role}.</span> {profile.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-colors hover:bg-accent hover:text-ink"
              >
                See my work
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full border border-fg/25 px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] transition-colors hover:border-accent hover:text-accent"
              >
                Get in touch
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </Magnetic>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-fg/10 pt-6">
            {[
              ["Lead dev", "Capstone"],
              ["6", "Featured projects"],
              ["3", "Platforms: web, mobile, desktop"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="sr-only">{v}</dt>
                <dd className="text-2xl font-semibold tracking-tight md:text-3xl">{k}</dd>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg/50">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative -mt-6 lg:mt-0">
          <ProfileCard />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-fg/40 md:flex">
        Scroll
        <span className="relative block h-10 w-px overflow-hidden bg-fg/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-fg" />
        </span>
      </div>
    </section>
  );
}
