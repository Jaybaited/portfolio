"use client";

/**
 * On hover, a scan line sweeps down the photo and reveals "Claude in a suit":
 * a figure whose head is a spark in the style of Claude's logo, dressed like
 * the ID photo (dark jacket, white shirt, tie). A drawn homage, not the
 * official logo file. Coordinates match the photo frame (200 x 210).
 */
const HEAD = { x: 100, y: 84, r: 44 };
const RAYS = [
  { a: -90, l: 1 }, { a: -62, l: 0.8 }, { a: -35, l: 0.94 }, { a: -8, l: 0.74 },
  { a: 20, l: 0.98 }, { a: 47, l: 0.8 }, { a: 73, l: 0.9 }, { a: 100, l: 0.76 },
  { a: 128, l: 1 }, { a: 155, l: 0.82 }, { a: 182, l: 0.94 }, { a: 210, l: 0.72 },
  { a: 237, l: 0.88 },
];
const ray = (a: number, l: number) => {
  const rad = (a * Math.PI) / 180;
  return {
    x2: (HEAD.x + Math.cos(rad) * HEAD.r * l).toFixed(2),
    y2: (HEAD.y + Math.sin(rad) * HEAD.r * l).toFixed(2),
  };
};

const TERRACOTTA = "#d97757";
const JACKET = "#1d1e23";
const LAPEL = "#2c2d34";
const SHIRT = "#fbfaf6";

export function SparkPortrait({ active }: { active: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={{ clipPath: active ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", background: "#f0eee6" }}
      >
        <svg viewBox="0 0 200 210" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
          {/* soft backdrop circle */}
          <circle cx="100" cy="92" r="70" fill="#e8e4d8" />

          {/* neck */}
          <rect x="92" y="112" width="16" height="40" rx="6" fill="#c4674a" />

          {/* jacket */}
          <path d="M8 210 C 12 182, 26 166, 62 156 L 88 148 L 100 168 L 112 148 L 138 156 C 174 166, 188 182, 192 210 Z" fill={JACKET} />
          {/* shirt */}
          <path d="M84 150 L 100 208 L 116 150 L 108 144 L 100 160 L 92 144 Z" fill={SHIRT} />
          {/* collar points */}
          <path d="M92 144 L 100 160 L 86 162 Z" fill={SHIRT} stroke="#d9d6cc" strokeWidth="0.8" />
          <path d="M108 144 L 100 160 L 114 162 Z" fill={SHIRT} stroke="#d9d6cc" strokeWidth="0.8" />
          {/* lapels */}
          <path d="M86 150 L 66 160 L 80 174 L 72 182 L 100 210 L 92 172 Z" fill={LAPEL} />
          <path d="M114 150 L 134 160 L 120 174 L 128 182 L 100 210 L 108 172 Z" fill={LAPEL} />
          {/* tie */}
          <path d="M95 160 L 105 160 L 103 168 L 97 168 Z" fill="#b8573a" />
          <path d="M97 168 L 103 168 L 108 196 L 100 206 L 92 196 Z" fill={TERRACOTTA} />
          {/* pocket square */}
          <path d="M40 182 L 54 182 L 50 174 L 46 178 L 43 173 Z" fill={TERRACOTTA} />
          <rect x="38" y="182" width="18" height="2" rx="1" fill={LAPEL} />
          {/* button */}
          <circle cx="94" cy="200" r="1.6" fill="#0f1013" />

          {/* the spark head */}
          <g
            className={active ? "motion-safe:animate-[sparkhead_4s_ease-in-out_infinite]" : ""}
            style={{ transformOrigin: `${HEAD.x}px ${HEAD.y}px`, transformBox: "view-box" }}
          >
            <g
              className={active ? "motion-safe:animate-[sparkpop_700ms_cubic-bezier(0.3,1.5,0.5,1)_both]" : ""}
              style={{ transformOrigin: `${HEAD.x}px ${HEAD.y}px`, transformBox: "view-box" }}
            >
              {RAYS.map(({ a, l }) => {
                const { x2, y2 } = ray(a, l);
                return (
                  <line
                    key={a}
                    x1={HEAD.x}
                    y1={HEAD.y}
                    x2={x2}
                    y2={y2}
                    stroke={TERRACOTTA}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          </g>
        </svg>
      </div>
      {active && (
        <div className="absolute inset-x-0 top-0 h-[2px] animate-[robotscan_700ms_cubic-bezier(0.7,0,0.2,1)_forwards] bg-[#d97757] shadow-[0_0_14px_3px_rgba(217,119,87,0.7)]" />
      )}
    </div>
  );
}
