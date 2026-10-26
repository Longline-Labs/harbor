"use client";

import { Moon, Sun } from "lucide-react";

function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private browsing: the choice just isn't remembered.
  }
}

/** Flip <html data-theme> and remember it. Shared by the Dock and the public switch. */
export function toggleTheme() {
  const d = document.documentElement;
  const next = d.dataset.theme === "dark" ? "light" : "dark";
  d.dataset.theme = next;
  remember("theme", next);
}

/** Flip the Dock between marks-only and marks-with-names. */
export function toggleDock() {
  const d = document.documentElement;
  const next = d.dataset.dock === "expanded" ? "collapsed" : "expanded";
  d.dataset.dock = next;
  remember("dock", next);
}

/**
 * The public site's light/dark switch (the Dock has its own). The knob's side
 * and icon follow <html data-theme> through CSS, so nothing flickers.
 */
export function ThemeSwitch() {
  return (
    <button type="button" className="theme-switch" title="Light or dark" onClick={toggleTheme}>
      <span className="sr when-light">Use dark theme</span>
      <span className="sr when-dark">Use light theme</span>
      <span className="theme-knob" aria-hidden="true">
        <Sun className="when-light" />
        <Moon className="when-dark" />
      </span>
    </button>
  );
}

/**
 * The inline <script> for the root layout's <head>, so the saved theme and
 * Dock state apply before the first paint. Render with dangerouslySetInnerHTML.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}else if(window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.dataset.theme="dark"}var d=localStorage.getItem("dock");if(d==="expanded"||d==="collapsed"){document.documentElement.dataset.dock=d}}catch(e){}})();`;
