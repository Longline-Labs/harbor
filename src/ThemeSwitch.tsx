"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME_KEY } from "./theme";

type Theme = "light" | "dark";

const CHANGED = "harbor-theme-changed";

function remember(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private browsing: the choice just isn't remembered.
  }
}

/** Flip <html data-theme> and remember it. */
export function toggleTheme(storageKey = DEFAULT_THEME_KEY) {
  const d = document.documentElement;
  const next = (d.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark" ? "light" : "dark";
  d.dataset.theme = next;
  remember(storageKey, next);
  window.dispatchEvent(new Event(CHANGED));
}

/** Tells every switch on the page (and other tabs) when the mode changes: by a switch, or by the device. */
function subscribe(onChange: () => void) {
  const device = window.matchMedia("(prefers-color-scheme: dark)");
  device.addEventListener("change", onChange);
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    device.removeEventListener("change", onChange);
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The mode in use: the person's own choice if they made one (data-theme), otherwise the device's. */
function inUse(): Theme {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The light and dark switch, in the bar of every app and site (as app.coifish.com has it). The page follows the
 * device's setting until it is used; after that, this browser remembers the choice under `storageKey`. Announced to
 * screen readers as a switch named "Dark mode". Styles: .theme-switch in harbor.css.
 */
export function ThemeSwitch({ className = "", storageKey = DEFAULT_THEME_KEY }: { className?: string; storageKey?: string }) {
  // Not known while the page is built on the server; the switch appears once the browser has it.
  const theme = useSyncExternalStore<Theme | null>(subscribe, inUse, () => null);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => toggleTheme(storageKey)}
      data-unknown={theme ? undefined : ""}
      className={`theme-switch${className ? ` ${className}` : ""}`}
    >
      <span className="theme-track">
        <span className="theme-knob">
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {dark ? (
              // A crescent moon.
              <path d="M13 9.6A5.6 5.6 0 0 1 6.4 3a5.6 5.6 0 1 0 6.6 6.6Z" fill="currentColor" stroke="none" />
            ) : (
              // A sun.
              <>
                <circle cx="8" cy="8" r="2.8" fill="currentColor" stroke="none" />
                <path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M3.2 12.8l1.1-1.1M11.7 4.3l1.1-1.1" />
              </>
            )}
          </svg>
        </span>
      </span>
    </button>
  );
}
