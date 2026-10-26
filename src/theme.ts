// The scripts for the root layout's <head>, kept out of ThemeSwitch.tsx ("use client"), so a server-rendered layout
// receives the text itself rather than a reference to client code.

/** Where a page remembers the person's choice unless the app names its own place (Coifish: "coifish-theme"). */
export const DEFAULT_THEME_KEY = "theme";

/**
 * The inline <script> for the root layout's <head> that applies a remembered choice before the first paint, and
 * nothing else: with no choice stored, the device's setting applies through tokens.css (as on app.coifish.com).
 * Render with dangerouslySetInnerHTML.
 */
export function themeChoiceScript(storageKey = DEFAULT_THEME_KEY): string {
  return `try{var t=localStorage.getItem(${JSON.stringify(storageKey)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
}

/**
 * Harbor 0.1.0's script, kept for apps still using it: applies the remembered choice, or else marks the page with the
 * device's setting. New apps use themeChoiceScript(), which leaves the device's setting to tokens.css.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.dataset.theme="dark"}}catch(e){}})();`;
