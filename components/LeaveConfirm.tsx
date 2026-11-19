"use client";

import { useEffect, useRef, useState } from "react";

type Pending = { href: string; host: string; kind: "tab" | "mail" };

const SKIP_KEY = "leave-confirm-skip";

/**
 * Asks before any link leaves the site: links that open a new tab, and email links.
 * One listener on the document catches every such link, so no link needs changing.
 */
export function LeaveConfirm() {
  const [pending, setPending] = useState<Pending | null>(null);
  const [skip, setSkip] = useState(false);
  const openBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const mail = href.startsWith("mailto:");
      const newTab = a.target === "_blank";
      if (!mail && !newTab) return;
      try {
        if (sessionStorage.getItem(SKIP_KEY) === "1") return;
      } catch {}
      e.preventDefault();
      lastFocus.current = a;
      setPending({
        href,
        kind: mail ? "mail" : "tab",
        host: mail ? href.slice(7).split("?")[0] : new URL(a.href).host + new URL(a.href).pathname.replace(/\/$/, ""),
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!pending) return;
    openBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPending(null);
        lastFocus.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending]);

  const close = () => {
    setPending(null);
    lastFocus.current?.focus();
  };

  const go = () => {
    if (!pending) return;
    if (skip) {
      try {
        sessionStorage.setItem(SKIP_KEY, "1");
      } catch {}
    }
    if (pending.kind === "mail") window.location.href = pending.href;
    else window.open(pending.href, "_blank", "noopener,noreferrer");
    setPending(null);
  };

  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Cancel"
        onClick={close}
        className="absolute inset-0 animate-[fadein_200ms_ease-out] bg-black/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-title"
        className="relative w-full max-w-md animate-[popin_260ms_cubic-bezier(0.2,0.9,0.3,1.2)] rounded-3xl border border-line bg-bg p-6 text-fg shadow-2xl sm:p-8"
      >
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {pending.kind === "mail" ? "Opening your email app" : "Opening a new tab"}
        </p>
        <h2 id="leave-title" className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          {pending.kind === "mail" ? "Write me an email?" : "Leave for another site?"}
        </h2>
        <p className="mt-3 break-all rounded-xl bg-faint px-4 py-3 font-mono text-[13px]">{pending.host}</p>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-muted">
          <input type="checkbox" checked={skip} onChange={(e) => setSkip(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          Don&apos;t ask again during this visit
        </label>

        <div className="mt-7 flex flex-col-reverse gap-3 font-mono text-[11px] uppercase tracking-[0.16em] sm:flex-row sm:justify-end">
          <button type="button" onClick={close} className="rounded-full border border-line px-6 py-3 hover:border-fg">
            Stay here
          </button>
          <button
            ref={openBtn}
            type="button"
            onClick={go}
            className="rounded-full bg-fg px-6 py-3 text-bg transition-colors hover:bg-accent hover:text-ink"
          >
            {pending.kind === "mail" ? "Open email ↗" : "Open link ↗"}
          </button>
        </div>
      </div>
    </div>
  );
}
