"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { SparkPortrait } from "./SparkPortrait";

/**
 * An ID card hanging from a strap. Drag it and let go: it swings back on a spring.
 * Hover tilts it in 3D with a moving sheen. Click (without dragging) flips it.
 */
export function ProfileCard() {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const strap = useRef<SVGPathElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [spark, setSpark] = useState(false);

  // physics state kept in refs so the animation loop never re-renders React
  const s = useRef({
    x: 0, y: 0, vx: 0, vy: 0, // offset from rest position
    rot: 0, vrot: 0,
    tiltX: 0, tiltY: 0, tTiltX: 0, tTiltY: 0,
    dragging: false, px: 0, py: 0, gx: 0, gy: 0, moved: 0,
    t: 0,
  });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const st = s.current;
      st.t += dt;

      if (!st.dragging) {
        // spring back to rest, with a gentle idle sway so the card is never fully still
        const idleX = reduced ? 0 : Math.sin(st.t * 0.9) * 6;
        const idleY = reduced ? 0 : Math.sin(st.t * 1.3) * 3;
        const k = 90, damp = 9;
        st.vx += (-(st.x - idleX) * k - st.vx * damp) * dt;
        st.vy += (-(st.y - idleY) * k - st.vy * damp) * dt;
        st.x += st.vx * dt;
        st.y += st.vy * dt;
      }
      // rotation follows sideways velocity and offset, like a pendulum
      const targetRot = Math.max(-28, Math.min(28, st.x * 0.09 + st.vx * 0.02));
      st.vrot += ((targetRot - st.rot) * 60 - st.vrot * 8) * dt;
      st.rot += st.vrot * dt;

      st.tiltX += (st.tTiltX - st.tiltX) * 0.12;
      st.tiltY += (st.tTiltY - st.tiltY) * 0.12;

      if (card.current) {
        card.current.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) rotate(${st.rot}deg) rotateX(${st.tiltX}deg) rotateY(${st.tiltY}deg)`;
      }
      if (strap.current && stage.current && card.current) {
        // strap from the anchor at the top to the card's clip, which moves with the card
        const w = stage.current.clientWidth;
        const ax = w / 2;
        const cx = w / 2 + st.x;
        const cy = 100 + st.y; // where the card clip sits at rest
        const midY = cy * 0.55;
        strap.current.setAttribute("d", `M ${ax} -10 Q ${ax + st.x * 0.35} ${midY} ${cx} ${cy}`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const onPointerDown = (e: React.PointerEvent) => {
    const st = s.current;
    st.dragging = true;
    st.moved = 0;
    st.px = e.clientX;
    st.py = e.clientY;
    st.gx = st.x;
    st.gy = st.y;
    st.vx = 0;
    st.vy = 0;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const st = s.current;
    const el = card.current;
    if (el && !st.dragging && e.pointerType === "mouse") {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      st.tTiltY = nx * 18;
      st.tTiltX = -ny * 18;
      if (sheen.current) {
        sheen.current.style.background = `radial-gradient(circle at ${(nx + 0.5) * 100}% ${(ny + 0.5) * 100}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%)`;
        sheen.current.style.opacity = "1";
      }
    }
    if (!st.dragging) return;
    const dx = e.clientX - st.px;
    const dy = e.clientY - st.py;
    st.moved = Math.max(st.moved, Math.hypot(dx, dy));
    const nx = st.gx + dx;
    // the strap has a length: you can lift the card but not pull it far down
    const ny = Math.min(st.gy + dy, 140);
    st.vx = (nx - st.x) * 60;
    st.vy = (ny - st.y) * 60;
    st.x = nx;
    st.y = ny;
  };

  const endDrag = () => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    setDragging(false);
    if (st.moved < 5) setFlipped((f) => !f);
  };

  const onLeave = () => {
    const st = s.current;
    st.tTiltX = 0;
    st.tTiltY = 0;
    if (sheen.current) sheen.current.style.opacity = "0";
  };

  // The stage sits above the hero text so the card passes over it, never under it.
  // The stage ignores the mouse; only the card itself catches it, so the text and
  // buttons beneath stay clickable.
  return (
    <div ref={stage} className="pointer-events-none relative z-20 h-[560px] w-full select-none sm:h-[600px]" aria-label="Profile card">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <path ref={strap} stroke="currentColor" strokeOpacity="0.55" strokeWidth="14" fill="none" strokeLinecap="round" />
      </svg>

      <div className="absolute left-1/2 top-[110px] -ml-[150px] w-[300px] [perspective:1100px] sm:-ml-[160px] sm:w-[320px]">
        <div
          ref={card}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={`${profile.name} ID card. Press to flip.`}
          data-cursor={dragging ? "" : "Drag"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={onLeave}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
          className="pointer-events-auto relative touch-none [transform-style:preserve-3d]"
          style={{ transformOrigin: "50% 0%" }}
        >
          {/* clip that the strap hooks into */}
          <div className="absolute -top-4 left-1/2 z-10 h-7 w-12 -translate-x-1/2 rounded-md border border-white/30 bg-neutral-800 shadow-lg" aria-hidden>
            <div className="mx-auto mt-2 h-1.5 w-6 rounded-full bg-black" />
          </div>

          <div
            className="relative transition-transform duration-700 ease-[cubic-bezier(0.3,1.4,0.5,1)] [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
          >
            {/* FRONT */}
            <div className="relative overflow-hidden rounded-[22px] border border-white/15 bg-[#111] p-4 text-paper shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] [backface-visibility:hidden]">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                <span>Developer ID</span>
                <span>BSIT · 2026</span>
              </div>
              <div
                className="relative mt-3 aspect-[4/4.2] overflow-hidden rounded-[14px] bg-white"
                onPointerEnter={(e) => e.pointerType === "mouse" && setSpark(true)}
                onPointerLeave={() => setSpark(false)}
              >
                <Image
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}`}
                  fill
                  sizes="320px"
                  draggable={false}
                  loading="eager"
                  className="object-cover object-[50%_25%]"
                />
                <SparkPortrait active={spark} />
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="font-serif text-[34px] leading-none">{profile.firstName}</p>
                  <p className="font-serif text-[34px] italic leading-none text-white/70">{profile.lastName}</p>
                </div>
                <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/50">
                  Full-stack
                  <br />
                  Web · Mobile
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                {/* decorative barcode */}
                <div className="flex h-7 items-stretch gap-[2px]" aria-hidden>
                  {"1101001110100110111001011010011101".split("").map((b, i) => (
                    <span key={i} className={b === "1" ? "w-[2px] bg-white/80" : "w-[1px] bg-white/30"} />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">Tap to flip</span>
              </div>
              <div ref={sheen} className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300" />
            </div>

            {/* BACK */}
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] border border-black/10 bg-paper p-6 text-ink [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
                <span>Quick facts</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" /> Open to work
                </span>
              </div>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">Based in</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">Studying</dt>
                  <dd>{profile.school}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">Building</dt>
                  <dd>SignSpeak-SafeCheck, as lead developer</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45">Speaks</dt>
                  <dd>English, Filipino</dd>
                </div>
              </dl>
              <div className="mt-auto flex gap-2 pt-6 font-mono text-[11px] uppercase tracking-[0.14em]">
                <a
                  href={`mailto:${profile.email}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 rounded-full bg-ink py-2.5 text-center text-paper"
                >
                  Email
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex-1 rounded-full border border-black/20 py-2.5 text-center"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
