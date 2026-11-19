"use client";

import { useEffect, useState } from "react";

const WORDS = ["Full-stack", "Web", "Mobile", "Desktop", "Ciejay Fortu"];
const DURATION = 1600; // ms for the counter to reach 100

/**
 * Intro screen on first open: a counter runs to 100 while words flick past,
 * then the screen lifts away. Shown once per browser tab session; skipped
 * instantly on later visits (see the theme script in layout.tsx) and kept
 * short with reduced motion.
 */
export function Loader() {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "done") {
      const id = requestAnimationFrame(() => setGone(true));
      return () => cancelAnimationFrame(id);
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = reduced ? 300 : DURATION;
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    let t1 = 0, t2 = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      // ease out, so the last numbers slow down
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        t1 = window.setTimeout(() => {
          setLeaving(true);
          window.dispatchEvent(new Event("introdone"));
        }, reduced ? 0 : 250);
        t2 = window.setTimeout(() => {
          setGone(true);
          document.documentElement.style.overflow = "";
          document.documentElement.dataset.intro = "done";
          try {
            sessionStorage.setItem("intro", "1");
          } catch {}
        }, reduced ? 200 : 1150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  const word = WORDS[Math.min(WORDS.length - 1, Math.floor((count / 100) * WORDS.length))];

  return (
    <div
      aria-hidden
      className="loader fixed inset-0 z-[90] flex flex-col justify-between bg-[#0d0d0c] p-6 text-[#f3f1ec] md:p-10"
      style={{
        clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transition: "clip-path 900ms cubic-bezier(0.8, 0, 0.2, 1)",
      }}
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.22em] text-white/50">
        <span>
          CF<span className="opacity-50">/</span>26
        </span>
        <span>Portfolio · 2026</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-end text-[clamp(72px,16vw,200px)] font-semibold leading-[0.8] tracking-[-0.06em]">
          CF
          <span className="mb-[0.08em] ml-[0.06em] inline-block h-[0.16em] w-[0.16em] animate-pulse bg-[#ff6a3d]" />
        </div>
        <p key={word} className="mt-6 animate-[loaderword_300ms_ease-out] font-serif text-2xl italic text-white/70 md:text-3xl">
          {word}
        </p>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/50">Loading</span>
          <span className="text-[clamp(40px,7vw,96px)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
            {String(count).padStart(3, "0")}
          </span>
        </div>
        <div className="mt-4 h-px w-full bg-white/15">
          <div
            className="h-px bg-gradient-to-r from-[#ff6a3d] via-[#b4a7ff] to-[#8fd3a6]"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </div>
  );
}
