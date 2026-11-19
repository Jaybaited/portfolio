"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { typingRecord } from "@/lib/content";
import { Reveal } from "./Reveal";

const WORDS = typingRecord.words; // the exact 25 words from my run
const WORD_COUNT = WORDS.length;
const REPLAY = typingRecord.replay;
const JAY_MS = REPLAY[REPLAY.length - 1][0];

/** How many characters I had typed this many milliseconds into my run. */
function ghostChars(ms: number) {
  if (ms <= 0) return 0;
  if (ms >= JAY_MS) return REPLAY[REPLAY.length - 1][1];
  let i = 1;
  while (REPLAY[i][0] < ms) i++;
  const [t0, c0] = REPLAY[i - 1];
  const [t1, c1] = REPLAY[i];
  return c0 + ((c1 - c0) * (ms - t0)) / (t1 - t0);
}

/** My WPM curve from the replay, sampled once a second, for the results chart. */
const JAY_CURVE = Array.from({ length: Math.ceil(JAY_MS / 1000) }, (_, k) => {
  const t = Math.min(JAY_MS, (k + 1) * 1000) / 1000;
  return { t, wpm: ghostChars(t * 1000) / 5 / (t / 60) };
});
const MAX_EXTRA = 8;
const SENTINEL = ".."; // keeps mobile keyboards firing delete events

type Phase = "idle" | "running" | "done";
type Sample = { t: number; wpm: number };
type Result = {
  wpm: number;
  raw: number;
  acc: number;
  seconds: number;
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  samples: Sample[];
};

function charStats(words: string[], typed: string[]) {
  let correct = 0, incorrect = 0, extra = 0, missed = 0, correctWordChars = 0, rawChars = 0;
  const last = typed.length - 1;
  typed.forEach((t, i) => {
    const w = words[i];
    for (let c = 0; c < Math.max(w.length, t.length); c++) {
      if (c >= t.length) {
        if (i < last) missed++;
      } else if (c >= w.length) extra++;
      else if (t[c] === w[c]) correct++;
      else incorrect++;
    }
    rawChars += t.length + (i < last ? 1 : 0);
    if (t === w) correctWordChars += w.length + (i < last ? 1 : 0);
  });
  return { correct, incorrect, extra, missed, correctWordChars, rawChars };
}

export function TypingGame() {
  const words = WORDS;
  const [typed, setTyped] = useState<string[]>([""]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [focused, setFocused] = useState(false);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [showProof, setShowProof] = useState(false);
  const [copied, setCopied] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const caret = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const startAt = useRef(0);
  const keys = useRef({ total: 0, correct: 0 });
  const samples = useRef<Sample[]>([]);
  const lastSample = useRef(0);
  const typedRef = useRef<string[]>([""]);
  const phaseRef = useRef<Phase>("idle");
  const commit = (next: string[]) => {
    typedRef.current = next;
    setTyped(next);
  };
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const v = Number(localStorage.getItem("typing-pb"));
      if (v > 0) setBest(v);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const jaySeconds = JAY_MS / 1000;
  const elapsed = phase === "running" ? Math.max(0, now - startTime) / 1000 : 0;
  const ghostExact = phase === "running" ? ghostChars(elapsed * 1000) : 0;
  const ghostIndex = Math.floor(ghostExact);

  const restart = useCallback(() => {
    commit([""]);
    phaseRef.current = "idle";
    setPhase("idle");
    setResult(null);
    keys.current = { total: 0, correct: 0 };
    samples.current = [];
    lastSample.current = 0;
    if (input.current) input.current.value = SENTINEL;
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  }, []);

  const finish = useCallback(
    (finalTyped: string[]) => {
      const end = performance.now();
      const seconds = Math.max(0.001, (end - startAt.current) / 1000);
      const s = charStats(words, finalTyped);
      const wpm = s.correctWordChars / 5 / (seconds / 60);
      const raw = s.rawChars / 5 / (seconds / 60);
      const acc = keys.current.total ? (keys.current.correct / keys.current.total) * 100 : 0;
      const out: Result = {
        wpm,
        raw,
        acc,
        seconds,
        correct: s.correct,
        incorrect: s.incorrect,
        extra: s.extra,
        missed: s.missed,
        samples: [...samples.current, { t: seconds, wpm }],
      };
      setResult(out);
      phaseRef.current = "done";
      setPhase("done");
      const rounded = Math.round(wpm);
      if (acc >= 75 && (best === null || rounded > best)) {
        setBest(rounded);
        try {
          localStorage.setItem("typing-pb", String(rounded));
        } catch {}
      }
    },
    [words, best],
  );

  // animation clock while a run is going
  useEffect(() => {
    if (phase !== "running") return;
    let raf = 0;
    const loop = () => {
      const t = performance.now();
      setNow(t);
      const sec = (t - startAt.current) / 1000;
      if (sec - lastSample.current >= 1) {
        lastSample.current = Math.floor(sec);
        const st = charStats(words, typedRef.current);
        samples.current.push({ t: sec, wpm: st.correctWordChars / 5 / (sec / 60) });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, words]);

  // ---- input handling -------------------------------------------------------
  const typeChar = (ch: string) => {
    if (phaseRef.current === "done") return;
    const cur = typedRef.current;
    const next = [...cur];
    const i = next.length - 1;
    const target = words[i];
    if (ch === " ") {
      if (next[i].length === 0) return; // no empty words
      keys.current.total++;
      if (next[i] === target) keys.current.correct++;
      if (i === words.length - 1) {
        commit(next);
        finish(next);
        return;
      }
      next.push("");
      commit(next);
      return;
    }
    if (next[i].length >= target.length + MAX_EXTRA) return;
    if (phaseRef.current === "idle") {
      startAt.current = performance.now();
      setStartTime(startAt.current);
      setNow(startAt.current);
      phaseRef.current = "running";
      setPhase("running");
    }
    keys.current.total++;
    if (target[next[i].length] === ch) keys.current.correct++;
    next[i] = next[i] + ch;
    commit(next);
    // last word typed correctly ends the test, like Monkeytype
    if (i === words.length - 1 && next[i] === target) finish(next);
  };

  const backspace = (wholeWord: boolean) => {
    if (phaseRef.current === "done") return;
    const next = [...typedRef.current];
    let i = next.length - 1;
    if (next[i].length === 0) {
      // step back only into a word that was wrong
      if (i > 0 && next[i - 1] !== words[i - 1]) {
        next.pop();
        i--;
        if (wholeWord) next[i] = "";
        commit(next);
      }
      return;
    }
    next[i] = wholeWord ? "" : next[i].slice(0, -1);
    commit(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" || e.key === "Escape") {
      e.preventDefault();
      restart();
      return;
    }
    if (e.key === "Enter" && phase === "done") {
      e.preventDefault();
      restart();
      return;
    }
    if (e.metaKey || (e.ctrlKey && e.key !== "Backspace")) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      backspace(e.ctrlKey || e.altKey);
      return;
    }
    if (e.key.length === 1) {
      e.preventDefault();
      typeChar(e.key === " " ? " " : e.key);
    }
    // anything else (mobile "Unidentified" keys) falls through to onInput
  };

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const ne = e.nativeEvent as InputEvent;
    if (ne.inputType?.startsWith("delete")) backspace(ne.inputType === "deleteWordBackward");
    else if (ne.data) for (const ch of ne.data) typeChar(ch);
    e.currentTarget.value = SENTINEL;
  };

  // ---- caret + ghost + line scrolling ----------------------------------------
  useLayoutEffect(() => {
    const root = inner.current;
    const wrap = box.current;
    if (!root || !wrap) return;
    // Measure on screen, relative to the text block, so nothing depends on which
    // element the browser treats as the offset parent.
    const rr = root.getBoundingClientRect();
    const pos = (wordIdx: number, charIdx: number) => {
      const w = root.children[wordIdx] as HTMLElement | undefined;
      if (!w) return null;
      const wr = w.getBoundingClientRect();
      const chars = w.children;
      const y = wr.top - rr.top;
      if (charIdx < chars.length) {
        const cr = (chars[charIdx] as HTMLElement).getBoundingClientRect();
        return { x: cr.left - rr.left, y, h: wr.height };
      }
      const lr = (chars[chars.length - 1] as HTMLElement).getBoundingClientRect();
      return { x: lr.right - rr.left, y, h: wr.height };
    };

    const ci = typed.length - 1;
    const p = pos(ci, typed[ci].length);
    const lineH = p?.h ?? 40;
    const scroll = p ? Math.max(0, p.y - lineH) : 0;
    root.style.transform = `translateY(${-scroll}px)`;
    if (p && caret.current) caret.current.style.transform = `translate(${p.x}px, ${p.y - scroll}px)`;

    if (ghost.current) {
      if (phase !== "running") {
        ghost.current.style.opacity = "0";
      } else {
        // character index -> (word, char); the space after a word belongs to its end
        const locate = (index: number) => {
          let rem = index, wi = 0;
          while (wi < words.length - 1 && rem > words[wi].length) {
            rem -= words[wi].length + 1;
            wi++;
          }
          return pos(wi, Math.min(rem, words[wi].length));
        };
        const a = locate(ghostIndex);
        const b = locate(ghostIndex + 1);
        if (a) {
          // glide between characters on the same line, so the caret moves like a real one
          const f = ghostExact - ghostIndex;
          const x = b && b.y === a.y ? a.x + (b.x - a.x) * f : a.x;
          ghost.current.style.opacity = "1";
          ghost.current.style.transform = `translate(${x}px, ${a.y - scroll}px)`;
        }
      }
    }
  });

  // ---- live numbers ----------------------------------------------------------
  const live = phase === "running" && elapsed > 0.5 ? charStats(words, typed).correctWordChars / 5 / (elapsed / 60) : 0;
  const myChars = typed.slice(0, -1).reduce((n, t) => n + t.length + 1, 0) + typed[typed.length - 1].length;
  const gap = ghostIndex - myChars;

  return (
    <section id="challenge" className="flip relative py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                <span className="text-accent">03</span> / Challenge
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[clamp(44px,7vw,108px)] font-semibold leading-[0.88] tracking-[-0.05em]">
                Can you out-type <span className="font-serif font-normal italic tracking-normal text-accent">me?</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-muted">
                The same {WORD_COUNT} words from my personal best on Monkeytype. The faint caret replays that run
                keystroke for keystroke, so you are racing exactly what I typed. Reach the last word first.
              </p>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="rounded-2xl border border-line p-5 font-mono">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">My personal best</p>
              <p className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight text-soft">{typingRecord.wpm}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-muted">wpm</span>
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                {typingRecord.accuracy}% acc · {typingRecord.seconds}s · {WORD_COUNT} words
              </p>
              <button
                type="button"
                onClick={() => setShowProof((s) => !s)}
                className="mt-4 text-[11px] uppercase tracking-[0.16em] underline decoration-line underline-offset-4 hover:decoration-fg"
                aria-expanded={showProof}
              >
                {showProof ? "Hide result" : "See the result"}
              </button>
            </div>
          </Reveal>
        </div>

        {showProof && (
          <figure className="mt-8 overflow-hidden rounded-2xl border border-line">
            <Image
              src={typingRecord.proof}
              alt={`Monkeytype result: ${typingRecord.wpm} WPM, ${typingRecord.accuracy}% accuracy, 25 words, ${typingRecord.seconds} seconds`}
              width={1686}
              height={480}
              sizes="(min-width: 1200px) 1100px, 100vw"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              My Monkeytype result · words 25 · english
            </figcaption>
          </figure>
        )}

        {/* the test */}
        <div className="mt-12 rounded-3xl border border-line bg-faint p-5 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.16em]">
            <div className="flex items-center gap-6">
              <span>
                <span className="text-accent">{Math.min(typed.length - (phase === "done" ? 0 : 1), WORD_COUNT)}</span>
                <span className="text-muted">/{WORD_COUNT}</span>
              </span>
              <span className="tabular-nums text-muted">{phase === "running" ? `${elapsed.toFixed(1)}s` : "0.0s"}</span>
              <span className="tabular-nums">
                {Math.round(live)} <span className="text-muted">wpm</span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted">
              {phase === "running" && (
                <span className="tabular-nums">
                  {elapsed >= jaySeconds ? (
                    <span className="text-soft">I finished in {jaySeconds.toFixed(1)}s</span>
                  ) : gap > 0 ? (
                    <>I&apos;m {gap} chars ahead</>
                  ) : (
                    <span className="text-good">You lead by {-gap}</span>
                  )}
                </span>
              )}
              {best !== null && <span>Your best · {best}</span>}
            </div>
          </div>

          {phase !== "done" ? (
            <div
              ref={box}
              className="relative mt-8 cursor-text overflow-hidden font-mono text-[22px] leading-[1.7] md:text-[28px]"
              style={{ height: "calc(3 * 1.7em)" }}
              onClick={() => input.current?.focus({ preventScroll: true })}
              data-cursor="Type"
            >
              <input
                ref={input}
                defaultValue={SENTINEL}
                onKeyDown={onKeyDown}
                onInput={onInput}
                onPaste={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label="Typing test input. Type the words shown."
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                className="absolute left-0 top-0 h-px w-px opacity-0"
              />

              <div ref={inner} className={`relative flex flex-wrap transition-[transform,filter] duration-200 ${focused ? "" : "blur-[5px]"}`}>
                {words.map((w, wi) => {
                  const t = typed[wi];
                  const isPast = wi < typed.length - 1;
                  const wrong = isPast && t !== w;
                  return (
                    <span
                      key={wi}
                      className={`mr-[0.55em] inline-block ${wrong ? "underline decoration-bad decoration-2 underline-offset-[6px]" : ""}`}
                    >
                      {Array.from({ length: Math.max(w.length, t?.length ?? 0) }).map((_, ci) => {
                        const ch = w[ci];
                        const tc = t?.[ci];
                        let cls = "text-muted opacity-60";
                        if (tc !== undefined) {
                          if (ch === undefined) cls = "text-bad opacity-70";
                          else cls = tc === ch ? "text-fg" : "text-bad";
                        }
                        return (
                          <span key={ci} className={cls}>
                            {ch ?? tc}
                          </span>
                        );
                      })}
                    </span>
                  );
                })}
              </div>

              <div
                ref={ghost}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-[1.7em] w-[2px] opacity-0 transition-[transform] duration-75 ease-linear"
              >
                <div className="absolute inset-y-[0.3em] left-0 w-[2px] rounded-full bg-soft/70" />
                <span className="absolute -top-1 left-1 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-soft">CF</span>
              </div>
              <div
                ref={caret}
                aria-hidden
                className={`pointer-events-none absolute left-0 top-0 h-[1.7em] w-[2px] transition-[transform] duration-100 ease-out ${
                  focused ? "" : "opacity-0"
                }`}
              >
                <div className={`absolute inset-y-[0.3em] left-0 w-[3px] rounded-full bg-accent ${phase === "idle" ? "caret-blink" : ""}`} />
              </div>

              {!focused && (
                <button
                  type="button"
                  onClick={() => input.current?.focus({ preventScroll: true })}
                  className="absolute inset-0 flex items-center justify-center font-mono text-sm uppercase tracking-[0.2em]"
                >
                  <span className="rounded-full border border-line bg-bg px-5 py-3">Click here, then start typing</span>
                </button>
              )}
            </div>
          ) : (
            result && <Results result={result} onRestart={restart} copied={copied} setCopied={setCopied} />
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            <span>
              <kbd className="rounded border border-line px-1.5 py-0.5">tab</kbd> or <kbd className="rounded border border-line px-1.5 py-0.5">esc</kbd> new test
            </span>
            <button type="button" onClick={restart} className="u-link pb-0.5 text-fg">
              ↻ Restart
            </button>
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Best on a physical keyboard. Pasting is disabled.
        </p>
      </div>
    </section>
  );
}

function Results({
  result,
  onRestart,
  copied,
  setCopied,
}: {
  result: Result;
  onRestart: () => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  const wpm = Math.round(result.wpm);
  const diff = wpm - typingRecord.wpm;
  const verdict =
    diff > 0
      ? { big: "You beat me.", small: `By ${diff} WPM, on my best day. Nicely done.`, tone: "text-good" }
      : diff === 0
        ? { big: "Dead heat.", small: "Exactly my best run. Rematch?", tone: "text-soft" }
        : diff > -20
          ? { big: "So close.", small: `${-diff} WPM behind my best run. One more try?`, tone: "text-accent" }
          : { big: "My run got there first.", small: `${-diff} WPM behind. Press Tab to try again.`, tone: "text-accent" };

  const copy = async () => {
    const text = `I typed ${wpm} WPM (${Math.round(result.acc)}% acc) racing Ciejay Fortu's best run. ${location.origin}/#challenge`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[auto_1fr]" aria-live="polite">
      <div className="font-mono">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">wpm</p>
        <p className={`text-7xl font-semibold leading-none tracking-tight md:text-8xl ${verdict.tone}`}>{wpm}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">acc</p>
        <p className="text-4xl font-semibold tracking-tight">{Math.round(result.acc)}%</p>
      </div>
      <div className="flex flex-col">
        <p className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">{verdict.big}</p>
        <p className="mt-2 text-muted">{verdict.small}</p>
        <Chart samples={result.samples} />
        <dl className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
          {[
            ["raw", Math.round(result.raw)],
            ["characters", `${result.correct}/${result.incorrect}/${result.extra}/${result.missed}`],
            ["time", `${result.seconds.toFixed(1)}s`],
            ["my run", `${(JAY_MS / 1000).toFixed(1)}s`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="uppercase tracking-[0.16em] text-muted">{k}</dt>
              <dd className="mt-1 text-lg">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
          <button type="button" onClick={onRestart} className="rounded-full bg-fg px-5 py-3 text-bg transition-colors hover:bg-accent hover:text-ink">
            Try again
          </button>
          <button type="button" onClick={copy} className="rounded-full border border-line px-5 py-3 hover:border-fg">
            {copied ? "Copied" : "Copy result"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** WPM over time: your run against my recorded run. */
function Chart({ samples }: { samples: Sample[] }) {
  const W = 600, H = 140, P = 6;
  const pts = samples.filter((s) => s.t > 0.4);
  const mine = JAY_CURVE;
  const maxT = Math.max(1, ...pts.map((s) => s.t), ...mine.map((s) => s.t));
  const maxW = Math.max(200, ...pts.map((s) => s.wpm), ...mine.map((s) => s.wpm)) * 1.05;
  const x = (t: number) => P + (t / maxT) * (W - P * 2);
  const y = (w: number) => H - P - (w / maxW) * (H - P * 2);
  const line = (arr: Sample[]) => arr.map((s, i) => `${i ? "L" : "M"} ${x(s.t).toFixed(1)} ${y(s.wpm).toFixed(1)}`).join(" ");
  const d = line(pts);
  const last = mine[mine.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-36 w-full" role="img" aria-label="Your words per minute over time compared to my run">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={P} x2={W - P} y1={H * f} y2={H * f} stroke="currentColor" strokeOpacity="0.07" />
      ))}
      <path d={line(mine)} fill="none" className="stroke-soft" strokeWidth="1.5" strokeDasharray="5 5" />
      <text x={x(last.t)} y={y(last.wpm) - 8} textAnchor="end" className="fill-soft font-mono text-[10px]">
        my run
      </text>
      {pts.length > 1 && <path d={d} fill="none" className="stroke-accent" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {pts.map((s) => (
        <circle key={s.t} cx={x(s.t)} cy={y(s.wpm)} r="3" className="fill-accent" />
      ))}
    </svg>
  );
}
