"use client";

import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { apps, company, type AppKey } from "./apps";
import { Mark } from "./Mark";
import { toggleDock, toggleTheme } from "./ThemeSwitch";

export interface DockUser {
  initials: string;
  name: string;
  email: string;
  company: string;
}

export interface DockProps {
  /** Which of the three apps this is. Its tile gets the accent ring. */
  current: AppKey;
  user: DockUser;
  /** Where the current app's tile links (its home page). */
  homeHref?: string;
  /** "Your account" link; omit to hide. */
  accountHref?: string;
  /** Founder admin link; pass only for the founder. */
  adminHref?: string;
  /**
   * The sign-out control, supplied by the app (a <form action={signOutAction}>
   * with a `btn quiet w-full justify-start` button), so the package needs no
   * server actions of its own.
   */
  signOut?: ReactNode;
  /**
   * Link component for in-app links (pass Next's Link). Defaults to <a>.
   */
  Link?: React.ComponentType<{ href: string; className?: string; children: ReactNode; title?: string; "aria-current"?: "true" }>;
  /** The current pathname, if the app wants the account menu to close on navigation. */
  pathname?: string;
}

function ThemeToggle() {
  return (
    <button type="button" className="dock-tile" title="Light or dark" onClick={toggleTheme}>
      <span className="dock-icon">
        <Moon className="when-light" aria-hidden="true" />
        <Sun className="when-dark" aria-hidden="true" />
      </span>
      <span className="dock-label">
        <span className="when-light">Use dark theme</span>
        <span className="when-dark">Use light theme</span>
      </span>
    </button>
  );
}

function ExpandToggle() {
  return (
    <button type="button" className="dock-tile dock-expand" title="Show or hide app names" onClick={toggleDock}>
      <span className="dock-icon">
        <PanelLeftOpen className="when-collapsed" aria-hidden="true" />
        <PanelLeftClose className="when-expanded" aria-hidden="true" />
      </span>
      <span className="dock-label">
        <span className="when-collapsed">Show app names</span>
        <span className="when-expanded">Hide app names</span>
      </span>
    </button>
  );
}

const A: NonNullable<DockProps["Link"]> = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

/**
 * The Dock (components.md): the rail shared by the three apps. The company
 * mark, one tile per app (this one ringed in its accent), and the signed-in
 * manager with the theme switch. No in-app navigation, never scrolls.
 */
export function Dock({ current, user, homeHref = "/dashboard", accountHref, adminHref, signOut, Link = A, pathname }: DockProps) {
  const account = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (account.current) account.current.open = false;
  }, [pathname]);
  useEffect(() => {
    const close = (e: Event) => {
      const d = account.current;
      if (!d?.open) return;
      if (e instanceof KeyboardEvent) {
        if (e.key !== "Escape") return;
        d.open = false;
        d.querySelector("summary")?.focus();
      } else if (!d.contains(e.target as Node)) {
        d.open = false;
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  return (
    <nav className={`dock dock-${current} no-print`} aria-label={`${company} apps`}>
      <div className="dock-company" title={company}>
        <span className="dock-icon">
          <Mark name="company" size={28} />
        </span>
        <span className="dock-label label">{company}</span>
      </div>
      <ul className="dock-apps">
        {apps.map((app) => {
          const isCurrent = app.key === current;
          const inner = (
            <>
              <span className="dock-icon">
                <Mark name={app.key} size={28} faded={!app.live && !isCurrent} />
              </span>
              <span className="dock-label">
                <span className="dock-app-name">{app.name}</span>
                {!app.live && !isCurrent ? <span className="label dock-soon">Coming soon</span> : null}
              </span>
            </>
          );
          return (
            <li key={app.key}>
              {isCurrent ? (
                <Link href={homeHref} className="dock-tile dock-current" aria-current="true" title={app.name}>
                  {inner}
                  <span className="sr"> (this app)</span>
                </Link>
              ) : app.live && app.url ? (
                <a href={app.url} className="dock-tile" target="_blank" rel="noopener" title={app.name}>
                  {inner}
                  <span className="sr"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="dock-tile dock-off" title={`${app.name}: coming soon`}>
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="dock-bottom">
        <ExpandToggle />
        <ThemeToggle />
        <details className="dock-account" ref={account}>
          <summary className="dock-tile" title={user.name}>
            <span className="dock-icon">
              <span className="dock-avatar" aria-hidden="true">
                {user.initials}
              </span>
            </span>
            <span className="dock-label dock-user">
              <span className="sr">Your account: </span>
              {user.name}
            </span>
          </summary>
          <div className="dock-menu">
            <div className="dock-menu-who">
              <div className="font-semibold">{user.company}</div>
              <div className="hint">{user.email}</div>
            </div>
            {accountHref ? (
              <Link href={accountHref} className="btn quiet justify-start">
                Your account
              </Link>
            ) : null}
            {adminHref ? (
              <Link href={adminHref} className="btn quiet justify-start">
                Founder admin
              </Link>
            ) : null}
            {signOut}
          </div>
        </details>
      </div>
    </nav>
  );
}
