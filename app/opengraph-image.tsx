import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

// The link preview shown when the site is shared (Messenger, Facebook, LinkedIn, X, Discord).
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0d0d0c";
const PAPER = "#f3f1ec";
const ACCENT = "#ff6a3d";

/** Load a Google font for the image renderer; fall back to the built-in font if offline. */
async function googleFont(family: string, axis: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axis}&display=swap`, {
        // an older browser string makes Google serve WOFF/TTF (not WOFF2), which the renderer can read
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.30 (KHTML, like Gecko) Safari/534.30" },
      })
    ).text();
    // Google splits fonts into language subsets; use the basic Latin one
    const latin = css.split("/*").find((block) => block.startsWith(" latin */")) ?? css;
    const url = latin.match(/src: url\((.+?)\) format\('(?:woff|truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const [photo, bold, serif] = await Promise.all([
    readFile(new URL("../public/img/ciejay.jpg", import.meta.url), "base64"),
    googleFont("Geist", "wght@700"),
    googleFont("Instrument+Serif", "ital@1"),
  ]);
  const fonts = [
    ...(bold ? [{ name: "Geist", data: bold, weight: 700 as const, style: "normal" as const }] : []),
    ...(serif ? [{ name: "Instrument Serif", data: serif, weight: 400 as const, style: "italic" as const }] : []),
  ];
  const site = new URL(profile.site).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
          color: PAPER,
          ...(bold ? { fontFamily: "Geist" } : {}),
          position: "relative",
          backgroundImage: "radial-gradient(circle, rgba(243,241,236,0.10) 1.5px, transparent 1.5px)",
          backgroundSize: "30px 30px",
        }}
      >
        {/* warm glow behind the card */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -140,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(255,106,61,0.35), rgba(255,106,61,0) 70%)",
          }}
        />

        {/* left: name and role */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 60px 72px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 4, color: "rgba(243,241,236,0.6)" }}>
            <div style={{ width: 56, height: 3, background: ACCENT }} />
            PORTFOLIO · 2026
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 150, lineHeight: 0.86, letterSpacing: -7, fontWeight: 700 }}>CIEJAY</div>
            <div style={{ display: "flex", alignItems: "flex-end", fontSize: 150, lineHeight: 0.86, letterSpacing: -7, fontWeight: 700 }}>
              FORTU
              <div style={{ width: 26, height: 26, background: ACCENT, marginLeft: 10, marginBottom: 14 }} />
            </div>
            <div
              style={{
                marginTop: 34,
                fontSize: 46,
                ...(serif ? { fontFamily: "Instrument Serif" } : {}),
                fontStyle: "italic",
                color: "rgba(243,241,236,0.85)",
              }}
            >
              Full-Stack Developer
            </div>
            <div style={{ marginTop: 8, fontSize: 24, color: "rgba(243,241,236,0.55)" }}>
              Web · Mobile · Desktop · Computer vision
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "rgba(243,241,236,0.7)" }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: ACCENT }} />
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#b4a7ff" }} />
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#8fd3a6" }} />
            <div style={{ marginLeft: 8 }}>{site}</div>
          </div>
        </div>

        {/* right: the ID card, tilted, hanging from a strap */}
        <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "flex-start", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 196, width: 12, height: 92, background: "#3a3b40", borderRadius: 6 }} />
          <div
            style={{
              marginTop: 78,
              display: "flex",
              flexDirection: "column",
              width: 300,
              padding: 16,
              borderRadius: 26,
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              transform: "rotate(5deg)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, letterSpacing: 2, color: "rgba(255,255,255,0.5)" }}>
              <div>DEVELOPER ID</div>
              <div>BSIT · 2026</div>
            </div>
            <div style={{ display: "flex", marginTop: 12, width: 268, height: 282, borderRadius: 16, overflow: "hidden", background: "#fff" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- the image renderer needs a plain img */}
              <img
                src={`data:image/jpeg;base64,${photo}`}
                width={296}
                height={296}
                style={{ marginLeft: -14, objectFit: "cover" }}
                alt=""
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 14 }}>
              <div style={{ fontSize: 30, ...(serif ? { fontFamily: "Instrument Serif" } : {}), lineHeight: 1 }}>Ciejay</div>
              <div
                style={{
                  fontSize: 30,
                  ...(serif ? { fontFamily: "Instrument Serif" } : {}),
                  fontStyle: "italic",
                  lineHeight: 1,
                  color: "rgba(243,241,236,0.7)",
                }}
              >
                Fortu
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    // with no downloaded fonts, leave the renderer on its built-in font
    fonts.length ? { ...size, fonts } : size,
  );
}
