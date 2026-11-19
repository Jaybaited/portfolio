"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

/** Text that "decodes" from random glyphs when it scrolls into view, and again on hover. */
export function Scramble({
  text,
  className = "",
  speed = 28,
  hover = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  hover?: boolean;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [out, setOut] = useState(text);
  const timer = useRef<number | null>(null);

  const run = () => {
    if (reduced) return;
    if (timer.current) window.clearInterval(timer.current);
    let frame = 0;
    const total = text.length * 2 + 6;
    timer.current = window.setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / total) * text.length * 1.1);
      setOut(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " " || i < revealed) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (frame >= total) {
        if (timer.current) window.clearInterval(timer.current);
        setOut(text);
      }
    }, speed);
  };

  useEffect(() => {
    if (inView) run();
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  return (
    <span
      ref={ref}
      aria-label={text}
      className={className}
      onMouseEnter={hover ? run : undefined}
    >
      <span aria-hidden>{reduced ? text : out}</span>
    </span>
  );
}
