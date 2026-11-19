"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#challenge", label: "Challenge" },
  { href: "#about", label: "About" },
  { href: "#internship", label: "Internship" },
  { href: "#contact", label: "Contact" },
];

function ManilaClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:-- --"}
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${open ? "text-fg" : "text-white mix-blend-difference"}`}>
      <nav
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-[padding] duration-500 md:px-10 ${
          scrolled ? "py-3" : "py-6"
        }`}
        aria-label="Main"
      >
        <a href="#top" className="font-mono text-sm tracking-tight" data-cursor="Top">
          CF<span className="opacity-50">/</span>26
        </a>

        <ul className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="u-link pb-0.5">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <div className="hidden font-mono text-xs uppercase tracking-[0.18em] md:block">
            <span className="opacity-50">Manila </span>
            <ManilaClock />
          </div>
          <ThemeToggle />

        <button
          type="button"
          className="font-mono text-xs uppercase tracking-[0.18em] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-0 -z-10 flex flex-col justify-end bg-bg px-5 pb-16 text-fg transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] md:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="space-y-2">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block font-serif text-6xl italic"
                tabIndex={open ? 0 : -1}
              >
                <span className="mr-3 align-top font-mono text-xs not-italic opacity-50">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.18em] opacity-60">
          Manila <ManilaClock />
        </p>
      </div>
    </header>
  );
}
