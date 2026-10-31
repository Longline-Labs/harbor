import type { ReactNode } from "react";

/** ok: current, done. warn: expiring soon, due. danger: expired, failed. neutral: nothing yet. info: waiting on the team. */
export type Tone = "ok" | "warn" | "danger" | "neutral" | "info";

/** The three status glyphs, drawn on a 16 grid with round ends to sit with the small capitals (as app.coifish.com draws them). */
function ToneIcon({ tone }: { tone: Tone }) {
  if (tone !== "ok" && tone !== "warn" && tone !== "danger") return null;
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {tone === "ok" && <path d="M3.5 8.5l3 3 6-7" />}
      {tone === "danger" && <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />}
      {tone === "warn" && (
        <>
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 5.2V8l1.9 1.3" />
        </>
      )}
    </svg>
  );
}

/**
 * Harbor's StatusBadge: always a word, in small capitals on its tone's tint, with the tone's icon (a check, a clock,
 * a cross; none for neutral and info) unless `icon={false}`. `wrap` lets a long label break onto a second line.
 * Styles: .pill in harbor.css.
 */
export function StatusBadge({ tone, children, icon = true, wrap = false, live = false }: { tone: Tone; children: ReactNode; icon?: boolean; wrap?: boolean; live?: boolean }) {
  return (
    <span className={`pill${tone === "neutral" ? "" : ` ${tone}`}${wrap ? " wrap" : ""}`} {...(live ? { role: "status", "aria-live": "polite" as const } : {})}>
      {icon ? <ToneIcon tone={tone} /> : null}
      {children}
    </span>
  );
}
