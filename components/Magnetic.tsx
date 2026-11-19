"use client";

import { useRef, type ReactNode } from "react";

/** Pulls its child gently toward the cursor while hovered. */
export function Magnetic({ children, strength = 0.3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        ref.current.style.transitionDuration = "150ms";
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onPointerLeave={() => {
        if (!ref.current) return;
        ref.current.style.transitionDuration = "600ms";
        ref.current.style.transform = "translate(0, 0)";
      }}
    >
      {children}
    </span>
  );
}
