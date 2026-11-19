"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks";

/** A field of dots that swell and drift away from the cursor. */
export function DotGrid({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gap = 26;
    const radius = 160;
    let w = 0, h = 0, dpr = 1;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let raf = 0;
    let visible = true;
    let base = "#888", accent = "#888";
    const readColors = () => {
      const cs = getComputedStyle(canvas);
      base = cs.color;
      accent = cs.getPropertyValue("--accent").trim() || base;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.15;
      mouse.y += (mouse.ty - mouse.y) * 0.15;
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          const f = Math.max(0, 1 - d / radius);
          const wave = reduced ? 0 : Math.sin(time / 1400 + x / 140 + y / 210) * 0.5 + 0.5;
          const push = f * f * 14;
          const px = x + (d ? (dx / d) * push : 0);
          const py = y + (d ? (dy / d) * push : 0);
          const size = 0.7 + f * 2.2;
          ctx.fillStyle = f > 0.3 ? accent : base;
          ctx.globalAlpha = 0.1 + wave * 0.08 + f * 0.75;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (reduced) draw(0);
    };
    const leave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
    };

    resize();
    readColors();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    const onResize = () => {
      resize();
      readColors();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);
    const onTheme = () => {
      readColors();
      if (reduced) draw(0);
    };
    window.addEventListener("themechange", onTheme);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("themechange", onTheme);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
