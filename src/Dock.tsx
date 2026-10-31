"use client";

import { useEffect, useRef, useState } from "react";
import { apps, company, type AppKey, type HarborApp } from "./apps";
import { Mark } from "./Mark";

/**
 * The Dock, as app.coifish.com has it (the founder, October 25, 2026): the top-left corner of the bar belongs to the
 * app in use (DockCorner, its mark a size larger, above the rail), and the rail beneath (Dock) holds only the other
 * apps, smaller, as places to go, each with its name under the mark: linking out once live, faded and marked "Soon"
 * before. The names are on the page, not in a tooltip, so a touch tablet shows them too. Sign in, the light and dark
 * switch and the account sit in the app's own bar, never in the rail. On a phone the rail is hidden and DockButton, in
 * the bar, opens the other apps over the page. Styles: .dock* in harbor.css.
 */

function AppMark({ app, size }: { app: HarborApp; size: number }) {
  return (
    <span className="dock-mark" style={{ width: size, height: size }} aria-hidden="true">
      <Mark name={app.key} size={size} />
    </span>
  );
}

/** The name under a mark in the rail, stacked at its capitals (Packet, Skipper) to fit 56px. Read as one word by .sr. */
function RailName({ app }: { app: HarborApp }) {
  return (
    <span className="dock-rail-name" aria-hidden="true">
      {(app.name.match(/[A-Z]?[^A-Z]+/g) ?? [app.name]).map((word) => (
        <span key={word}>{word}</span>
      ))}
      {!app.live && <span className="dock-rail-soon">Soon</span>}
    </span>
  );
}

function OtherApp({ app, withName }: { app: HarborApp; withName: boolean }) {
  const label = withName ? (
    <span className="dock-app-text">
      <span className="dock-app-name">{app.name}</span>
      {!app.live && <span className="dock-soon">Coming soon</span>}
    </span>
  ) : (
    <>
      <RailName app={app} />
      <span className="sr">{app.live ? app.name : `${app.name}, coming soon`}</span>
    </>
  );
  const kind = `dock-app ${withName ? "with-name" : "in-rail"}`;
  if (!app.live || !app.url)
    return (
      <span title={`${app.name}: coming soon`} className={`${kind} dock-off`}>
        <span className="dock-faded">
          <AppMark app={app} size={26} />
        </span>
        {label}
      </span>
    );
  return (
    <a href={app.url} title={app.name} className={kind}>
      <AppMark app={app} size={26} />
      {label}
    </a>
  );
}

function OtherApps({ current, withNames }: { current: AppKey; withNames: boolean }) {
  return (
    <nav aria-label={`Other ${company} apps`} className="dock-apps">
      {withNames && <p className="dock-heading">Other apps</p>}
      {apps
        .filter((app) => app.key !== current)
        .map((app) => (
          <OtherApp key={app.key} app={app} withName={withNames} />
        ))}
    </nav>
  );
}

/** The corner of the bar above the rail: this app's mark at 38px, leading home. Hidden on a phone. */
export function DockCorner({ current, href = "/" }: { current: AppKey; href?: string }) {
  const app = apps.find((a) => a.key === current)!;
  return (
    <a href={href} title={app.name} className="dock-corner">
      <AppMark app={app} size={38} />
      <span className="sr">{app.name}</span>
    </a>
  );
}

/** The rail at the left on a computer or tablet, under the bar. `belowBar`: under a 64px bar that stays at the top. */
export function Dock({ current, belowBar = false }: { current: AppKey; belowBar?: boolean }) {
  return (
    <aside className={`dock${belowBar ? " below-bar" : ""}`}>
      <OtherApps current={current} withNames={false} />
    </aside>
  );
}

/** On a phone: a button in the bar that opens the other apps over the page. */
export function DockButton({ current }: { current: AppKey }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    opener.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    closer.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button ref={opener} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-label={`Other ${company} apps`} className="dock-button">
        {/* Four tiles, not three lines: the three lines are an app's own menu, in the same bar. */}
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
          <path d="M3.5 3.5h5v5h-5zM11.5 3.5h5v5h-5zM3.5 11.5h5v5h-5zM11.5 11.5h5v5h-5z" />
        </svg>
      </button>
      {open && (
        <div
          className="dock-overlay"
          onBlur={(e) => {
            if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
          }}
        >
          {/* For the pointer only: the Close button in the panel is the one for the keyboard and for screen readers. */}
          <button type="button" tabIndex={-1} aria-hidden="true" className="dock-backdrop" onClick={close} />
          <div role="dialog" aria-label="Other apps" className="dock-panel">
            <button ref={closer} type="button" aria-label="Close" className="dock-close" onClick={close}>
              <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
            <OtherApps current={current} withNames />
          </div>
        </div>
      )}
    </>
  );
}
