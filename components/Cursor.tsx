"use client";

import { useEffect, useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

/**
 * A small dot with a thin trailing ring. Over links the ring grows a little;
 * where an element sets data-cursor, a short label sits beside the dot.
 * The ring is never filled, so it never inverts what is underneath.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      setHidden(false);
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const el = (e.target as Element | null)?.closest?.("[data-cursor], a, button, input, [role=button]");
      setHovering(!!el);
      setLabel(el?.getAttribute("data-cursor") ?? "");
    };
    const tick = () => {
      const k = reduced ? 1 : 0.2;
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const leave = () => setHidden(true);
    const pd = () => setDown(true);
    const pu = () => setDown(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", pd);
    window.addEventListener("pointerup", pu);
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointerup", pu);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [fine, reduced]);

  if (!fine) return null;

  const size = (hovering ? 34 : 24) * (down ? 0.8 : 1);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference" style={{ opacity: hidden ? 0 : 1 }}>
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 transition-[width,height] duration-300 ease-out"
          style={{ width: size, height: size }}
        />
      </div>
      <div ref={dot} className="absolute left-0 top-0">
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        <span
          className="absolute left-4 top-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-opacity duration-200"
          style={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
