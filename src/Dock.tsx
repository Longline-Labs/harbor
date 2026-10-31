"use client";

import { useEffect, useState } from "react";
import { apps, company, type AppKey, type HarborApp } from "./apps";
import { Mark } from "./Mark";

/**
 * The Dock, as app.coifish.com has it (the founder, October 25, 2026): the top-left corner of the bar belongs to the
 * app in use (DockCorner, its mark a size larger, above the rail), and the rail beneath (Dock) holds only the other
 * apps, smaller, as places to go: linking out once live, faded with "Coming soon" before. Sign in, the light and dark
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

function OtherApp({ app, withName }: { app: HarborApp; withName: boolean }) {
  const label = withName ? (
    <span className="dock-app-text">
      <span className="dock-app-name">{app.name}</span>
      {!app.live && <span className="dock-soon">Coming soon</span>}
    </span>
  ) : (
    <span className="sr">{app.live ? app.name : `${app.name}, coming soon`}</span>
  );
  const kind = `dock-app${withName ? " with-name" : ""}`;
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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-label={`Other ${company} apps`} className="dock-button">
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      {open && (
        <div className="dock-overlay">
          <button type="button" aria-label="Close" className="dock-backdrop" onClick={() => setOpen(false)} />
          <div className="dock-panel">
            <OtherApps current={current} withNames />
          </div>
        </div>
      )}
    </>
  );
}
