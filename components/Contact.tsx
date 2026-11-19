"use client";

import { useState } from "react";
import { profile } from "@/lib/content";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";

export function Contact({ hasResume }: { hasResume: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <footer id="contact" className="flip relative overflow-hidden pt-28 md:pt-36">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-accent opacity-[0.12] blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-soft opacity-[0.12] blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
            <span className="text-accent">05</span> / Contact
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 text-[clamp(52px,10vw,168px)] font-semibold leading-[0.85] tracking-[-0.055em]">
            Let&apos;s build
            <br />
            <span className="font-serif font-normal italic tracking-normal">something</span>
            <span className="text-accent">.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-8 max-w-lg text-lg text-muted">
            Open to entry-level roles, internships and freelance work in web, mobile and desktop development.
          </p>
        </Reveal>

        <Reveal delay={220} className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <button
              type="button"
              onClick={copy}
              data-cursor={copied ? "Copied" : "Copy"}
              className="group inline-flex items-center gap-4 rounded-full bg-fg py-5 pl-8 pr-6 text-bg transition-colors hover:bg-accent hover:text-ink"
            >
              <span className="text-lg font-medium tracking-tight md:text-2xl">{profile.email}</span>
              <span className="rounded-full border border-current/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                {copied ? "Copied ✓" : "Copy"}
              </span>
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-3 rounded-full border border-line px-7 py-5 font-mono text-xs uppercase tracking-[0.18em] hover:border-fg"
            >
              Send an email ↗
            </a>
          </Magnetic>
        </Reveal>

        <div className="mt-24 grid gap-8 border-t border-line py-10 font-mono text-xs uppercase tracking-[0.16em] md:grid-cols-4">
          <div>
            <p className="text-muted">Elsewhere</p>
            <a href={profile.github} target="_blank" rel="noreferrer" className="u-link mt-3 inline-block pb-0.5">
              GitHub · @{profile.githubHandle} ↗
            </a>
          </div>
          <div>
            <p className="text-muted">Based in</p>
            <p className="mt-3">{profile.location}</p>
          </div>
          <div>
            <p className="text-muted">Résumé</p>
            {hasResume ? (
              <a href="/resume.pdf" download className="u-link mt-3 inline-block pb-0.5">
                Download PDF ↓
              </a>
            ) : (
              <a href={`mailto:${profile.email}?subject=Resume%20request`} className="u-link mt-3 inline-block pb-0.5">
                Available on request
              </a>
            )}
          </div>
          <div className="md:text-right">
            <p className="text-muted">© 2026 {profile.name}</p>
            <a href="#top" className="u-link mt-3 inline-block pb-0.5">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none relative -mb-[0.2em] select-none whitespace-nowrap text-center text-[21vw] font-semibold leading-[0.8] tracking-[-0.07em] text-fg/[0.06]"
      >
        CIEJAY
      </p>
    </footer>
  );
}
