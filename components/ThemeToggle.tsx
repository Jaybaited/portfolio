"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/** Light/dark switch. Uses a circular reveal from the button where the browser supports it. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(
    (cb) => {
      window.addEventListener("themechange", cb);
      return () => window.removeEventListener("themechange", cb);
    },
    () => (document.documentElement.dataset.theme as Theme) ?? "dark",
    () => null,
  );

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      window.dispatchEvent(new Event("themechange"));
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reduced) return apply();

    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 30;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = doc.startViewTransition(apply);
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.7, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-cursor={theme === "dark" ? "Light" : "Dark"}
      className={`group relative flex h-8 w-8 items-center justify-center rounded-full border border-current/30 ${className}`}
    >
      {/* half-filled circle: rotates on switch */}
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={{ transform: `rotate(${theme === "light" ? 180 : 0}deg)` }}
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  );
}
