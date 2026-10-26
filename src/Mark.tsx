import { MARKS, markDataUrl, type MarkName } from "./marks";

export type { MarkName };

/**
 * A Harbor mark. The standard file shows on light grounds and the "-dark" file
 * in the dark theme; CSS (.when-light / .when-dark in harbor.css) picks one, so
 * there's no flicker. `faded` is for apps that aren't live yet: the one-ink
 * file, quieted. The SVGs are inlined from logos/, so apps need no files on disk.
 */
export function Mark({ name, size = 28, faded = false, alt = "" }: { name: MarkName; size?: number; faded?: boolean; alt?: string }) {
  if (faded) {
    return <img src={markDataUrl(name, "mono")} width={size} height={size} alt={alt} className="mark mark-faded" style={{ opacity: 0.45 }} draggable={false} />;
  }
  return (
    <span className="mark" style={{ display: "inline-flex", width: size, height: size }}>
      <img src={markDataUrl(name, "light")} width={size} height={size} alt={alt} className="when-light" draggable={false} />
      <img src={markDataUrl(name, "dark")} width={size} height={size} alt="" aria-hidden="true" className="when-dark" draggable={false} />
    </span>
  );
}

/** The raw SVG text, for emails and other places that can't use <img>. */
export function markSvg(name: MarkName, variant: "light" | "dark" | "mono" = "light"): string {
  return MARKS[name][variant];
}
