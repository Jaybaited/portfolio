const ITEMS = [
  "Full-stack web",
  "Android apps",
  "Sign-language recognition",
  "RFID systems",
  "UI/UX design",
  "Desktop apps in C#",
  "Databases",
];

export function Marquee() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {ITEMS.map((t, i) => (
        <span key={t} className="flex items-center">
          <span className={`px-8 text-[clamp(28px,4vw,56px)] font-semibold tracking-[-0.04em] ${i % 2 ? "font-serif font-normal italic tracking-normal text-muted" : ""}`}>
            {t}
          </span>
          <span className={`h-2.5 w-2.5 rotate-45 ${["bg-accent", "bg-soft", "bg-good"][i % 3]}`} aria-hidden />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee overflow-hidden border-y border-line py-7" role="marquee" aria-label={ITEMS.join(", ")}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
