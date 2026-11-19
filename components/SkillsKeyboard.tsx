"use client";

import { useEffect, useRef, useState } from "react";
import { skills, type Skill } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks";
import { Reveal } from "./Reveal";
import { Scramble } from "./Scramble";

const COLS = 6;
const KEY = 74; // keycap size, px
const GAP = 10;
const H = 20; // keycap height, px
const PAD = 28; // plate padding
const TOP = 46; // plate strip above the keys (badge, LED)
const LAYERS = 8; // slices per keycap body

/** Each skill group gets a keycap colourway. */
type Colorway = { name: string; top: string; text: string };
const COLORWAYS: Record<string, Colorway> = {
  Language: { name: "Languages", top: "#ff6a3d", text: "#1a0a03" },
  Framework: { name: "Frameworks", top: "#b4a7ff", text: "#140f33" },
  Mobile: { name: "Mobile", top: "#8fd3a6", text: "#0a1c11" },
  Database: { name: "Databases", top: "#7cc6fe", text: "#06182a" },
  ML: { name: "Vision & hardware", top: "#ffd166", text: "#241a00" },
  Hardware: { name: "Vision & hardware", top: "#ffd166", text: "#241a00" },
  Tools: { name: "Tools", top: "#2b2b30", text: "#f3f1ec" },
  Design: { name: "Design", top: "#ff8fa3", text: "#2b0710" },
  IT: { name: "IT", top: "#efe9dc", text: "#151412" },
};
const LEGEND = ["Language", "Framework", "Mobile", "Database", "ML", "Tools", "Design", "IT"];

// Key layout (by label), arranged so the colours mix across the board.
const LAYOUT = [
  "TS", "Re", "Pg", "Ex", "Git", "Fg",
  "N", "JS", "Sb", "CV", "Vc", "UX",
  "Py", "~", "My", "RF", "PC", "Net",
  "C#", "Ne", "Jv", "▲", "Fa", "</>",
];
const KEYS: Skill[] = LAYOUT.map((l) => skills.find((s) => s.label === l)).filter((s): s is Skill => !!s);

/** Mix a hex colour toward black (amt < 0) or white (amt > 0). */
function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt),
  );
  return `rgb(${ch.join(",")})`;
}

const colorOf = (s: Skill) => COLORWAYS[s.group] ?? COLORWAYS.IT;
const sameGroup = (a: string, b: string) => colorOf({ group: a } as Skill).name === colorOf({ group: b } as Skill).name;

function Keycap({
  skill,
  pressed,
  dimmed,
  onEnter,
  onLeave,
}: {
  skill: Skill;
  pressed: boolean;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const c = colorOf(skill);
  const h = pressed ? 7 : H;
  return (
    <button
      type="button"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onEnter}
      aria-label={`${skill.name}: ${skill.note}`}
      className="relative outline-none transition-opacity duration-300 [transform-style:preserve-3d]"
      style={{ width: KEY, height: KEY, opacity: dimmed ? 0.35 : 1 }}
    >
      {/* coloured glow on the plate when pressed */}
      <span
        aria-hidden
        className="absolute -inset-3 rounded-[18px] blur-xl transition-opacity duration-200"
        style={{ background: c.top, opacity: pressed ? 0.55 : 0 }}
      />
      {/* body: stacked rounded slices make a solid cap with no gaps at the corners */}
      {Array.from({ length: LAYERS }).map((_, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-[12px] transition-transform duration-150"
          style={{
            background: shade(c.top, -0.5 + (i / LAYERS) * 0.3),
            transform: `translateZ(${(i * h) / LAYERS}px)`,
          }}
        />
      ))}
      {/* skirt: the outer rim of the cap */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[12px] transition-transform duration-150"
        style={{ background: shade(c.top, -0.12), transform: `translateZ(${h}px)` }}
      />
      {/* sculpted top surface */}
      <span
        className="absolute inset-[6px] flex items-center justify-center rounded-[9px] font-mono text-[17px] font-semibold tracking-tight transition-transform duration-150"
        style={{
          background: `radial-gradient(130% 120% at 28% 18%, ${shade(c.top, 0.28)} 0%, ${c.top} 45%, ${shade(c.top, -0.08)} 100%)`,
          color: c.text,
          transform: `translateZ(${h + 1}px)`,
          boxShadow: `inset 0 1px 0 ${shade(c.top, 0.45)}, inset 0 -3px 6px ${shade(c.top, -0.2)}`,
        }}
      >
        {skill.label}
      </span>
    </button>
  );
}

export function SkillsKeyboard() {
  const reduced = useReducedMotion();
  const area = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(LAYOUT.indexOf("N"));
  const [hovering, setHovering] = useState<number | null>(null);
  const [focusGroup, setFocusGroup] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [demo, setDemo] = useState<number | null>(null);

  // fit the board to narrow screens
  useEffect(() => {
    const fit = () => {
      const w = area.current?.clientWidth ?? 700;
      setScale(Math.min(1, w / 780));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // tilt the board toward the cursor
  useEffect(() => {
    const el = area.current;
    const b = board.current;
    if (!el || !b) return;
    const cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tgt.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tgt.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const leave = () => { tgt.x = 0; tgt.y = 0; };
    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.07;
      cur.y += (tgt.y - cur.y) * 0.07;
      b.style.transform = `rotateX(${52 - cur.y * 8}deg) rotateZ(${-34 + cur.x * 10}deg)`;
      raf = requestAnimationFrame(loop);
    };
    if (!reduced) {
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      raf = requestAnimationFrame(loop);
    } else {
      b.style.transform = "rotateX(52deg) rotateZ(-34deg)";
    }
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduced]);

  // idle demo: a random key taps itself now and then, so the board feels alive
  useEffect(() => {
    if (reduced || hovering !== null || focusGroup) return;
    const id = window.setInterval(() => {
      const i = Math.floor(Math.random() * KEYS.length);
      setDemo(i);
      window.setTimeout(() => setDemo(null), 220);
    }, 1100);
    return () => window.clearInterval(id);
  }, [reduced, hovering, focusGroup]);

  const shown = KEYS[hovering ?? active];
  const shownColor = colorOf(shown);
  const glow = colorOf(KEYS[hovering ?? demo ?? active]).top;
  const rows = Math.ceil(KEYS.length / COLS);
  const boardW = COLS * KEY + (COLS - 1) * GAP + PAD * 2;
  const boardH = rows * KEY + (rows - 1) * GAP + PAD * 2 + TOP;

  return (
    <section id="skills" className="relative overflow-hidden py-28 text-fg md:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="relative z-10">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-fg/50">
              <span className="text-accent">02</span> / Skills
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 text-[clamp(44px,6vw,88px)] font-semibold leading-[0.9] tracking-[-0.045em]">
              My stack,
              <br />
              <span className="font-serif font-normal italic tracking-normal text-fg/70">one key at a time.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-md text-fg/60">
              Hover or tap a key. The colour tells you the kind of tool; pick a colour below to light up that group.
            </p>
          </Reveal>

          <div className="mt-10 min-h-[150px] border-t border-fg/10 pt-6" aria-live="polite">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg/50">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: shownColor.top }} />
              {shownColor.name}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              <Scramble key={shown.name} text={shown.name} hover={false} speed={18} />
            </p>
            <p className="mt-3 max-w-md text-fg/60">{shown.note}</p>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Skill groups">
            {LEGEND.map((g) => {
              const c = COLORWAYS[g];
              const on = focusGroup === g;
              return (
                <li key={g}>
                  <button
                    type="button"
                    onPointerEnter={() => setFocusGroup(g)}
                    onPointerLeave={() => setFocusGroup(null)}
                    onFocus={() => setFocusGroup(g)}
                    onBlur={() => setFocusGroup(null)}
                    onClick={() => setFocusGroup((cur) => (cur === g ? null : g))}
                    aria-pressed={on}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                      on ? "border-fg" : "border-line hover:border-fg/40"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-[3px] ring-1 ring-black/10" style={{ background: c.top }} />
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div ref={area} className="relative min-w-0" style={{ height: 600 * scale + 40 }}>
          <div
            style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
            className="absolute left-1/2 top-1/2 [perspective:1600px]"
          >
            <div
              ref={board}
              className="relative [transform-style:preserve-3d]"
              style={{ width: boardW, height: boardH, transform: "rotateX(52deg) rotateZ(-34deg)" }}
            >
              {/* coloured underglow, follows the key in use */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[40px] blur-3xl transition-[background-color] duration-500"
                style={{ backgroundColor: glow, opacity: 0.35, transform: "translateZ(-40px)" }}
              />
              {/* plate body: stacked slices, darker toward the bottom */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden
                  className="absolute inset-0 rounded-[28px]"
                  style={{
                    background: shade("#3b3e45", -0.75 + i * 0.045),
                    transform: `translateZ(${-24 + i * 2.4}px)`,
                  }}
                />
              ))}
              {/* plate top: brushed aluminium */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-[28px]"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px), linear-gradient(135deg,#3b3e45 0%,#24262b 45%,#17181c 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              />
              {/* screws */}
              {[[14, 14], [boardW - 14, 14], [14, boardH - 14], [boardW - 14, boardH - 14]].map(([x, y]) => (
                <span
                  key={`${x}-${y}`}
                  aria-hidden
                  className="absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: x, top: y, background: "radial-gradient(circle at 35% 35%, #9aa0aa, #3a3d44 70%)", transform: "translateZ(0.5px)" }}
                />
              ))}
              {/* top strip: badge + status LED + knob */}
              <div aria-hidden className="absolute flex items-center gap-3" style={{ left: PAD + 4, top: 16, transform: "translateZ(0.5px)" }}>
                <span className="rounded-[5px] bg-black/50 px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.2em] text-white/70">CF·24</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">skills edition</span>
              </div>
              <div aria-hidden className="absolute flex items-center gap-3" style={{ right: PAD + 4, top: 14, transform: "translateZ(0.5px)" }}>
                <span
                  className="h-2 w-2 rounded-full transition-[background-color,box-shadow] duration-300"
                  style={{ backgroundColor: glow, boxShadow: `0 0 10px 2px ${glow}` }}
                />
                <span
                  className="h-7 w-7 rounded-full"
                  style={{ background: "conic-gradient(from 200deg, #5b5f68, #2a2c31, #5b5f68, #2a2c31, #5b5f68)", boxShadow: "0 0 0 2px #111, inset 0 0 0 4px rgba(0,0,0,0.25)" }}
                />
              </div>
              {/* recess under the keys */}
              <div
                aria-hidden
                className="absolute rounded-[16px] bg-black/70"
                style={{ left: PAD - 10, top: PAD + TOP - 10, right: PAD - 10, bottom: PAD - 10, transform: "translateZ(0.5px)", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)" }}
              />

              <div
                className="absolute grid [transform-style:preserve-3d]"
                style={{ left: PAD, top: PAD + TOP, gridTemplateColumns: `repeat(${COLS}, ${KEY}px)`, gap: GAP, transform: "translateZ(1px)" }}
                onPointerLeave={() => setHovering(null)}
              >
                {KEYS.map((s, i) => (
                  <Keycap
                    key={s.name}
                    skill={s}
                    pressed={hovering === i || demo === i}
                    dimmed={!!focusGroup && !sameGroup(s.group, focusGroup)}
                    onEnter={() => {
                      setHovering(i);
                      setActive(i);
                    }}
                    onLeave={() => setHovering((h) => (h === i ? null : h))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
