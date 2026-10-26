import { Check, Clock, X } from "lucide-react";
import type { ReactNode } from "react";

export type Tone = "ok" | "warn" | "danger" | "neutral";

/**
 * Harbor's StatusBadge: always a word, on its tone's tint, with the tone's
 * default icon (check, clock, x; none for neutral) unless `icon={false}`.
 */
export function StatusBadge({ tone, children, icon = true, live = false }: { tone: Tone; children: ReactNode; icon?: boolean; live?: boolean }) {
  const Icon = tone === "ok" ? Check : tone === "warn" ? Clock : tone === "danger" ? X : null;
  return (
    <span className={`pill${tone === "neutral" ? "" : ` ${tone}`}`} {...(live ? { role: "status", "aria-live": "polite" as const } : {})}>
      {icon && Icon ? <Icon aria-hidden="true" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}
