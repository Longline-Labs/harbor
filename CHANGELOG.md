# Changelog

## 0.4.0 — 2026-11-03

- **Dock**: `Dock` and `DockButton` take `inUse`, the signed-in person's apps as keys (their grants at
  account.longlinelabs.com, which the app's own server reads from the account site's `/api/apps-in-use`; single sign-in
  plan, step 9). With at least one app besides the current one in the list, the person's own apps stay at full strength,
  say "You use this" (`dock-yours`, where "Coming soon" goes) and lead to the signed-in app where it has an address; the
  others go quiet (`dock-quiet`: mark faded as a coming-soon one, name muted) but remain links to their sites. A used
  app's link carries `data-in-use`. Without the list, with a list that couldn't be read (null), or when the person uses
  only this app, the Dock is exactly as before. `appsToMark` and `ownAppHref` are exported for an app drawing its own
  rail. The wording and the quiet treatment are the first draft, for Brandon to confirm.
- **apps.json**: each app has `appUrl`, the signed-in app's address (app.coifish.com, app.reelminders.com,
  app.packetskipper.com; null for the three with none yet), which the Dock uses for a person's own apps. BallastBook,
  ShipShape and AboveBoard are `live`: their websites are up (ballastbook.com since October 31, shipshapefiles.com and
  aboveboarddocs.com since November 3; Brandon's word, as `@longline/web` 0.4.11 and 0.4.12 already record), so the
  Dock links to them instead of saying "Coming soon". The apps themselves are still closed to sign-ups; that is each
  site's own business.

## 0.3.1 — 2026-10-30

- **apps.json**: the sixth app's name is AboveBoard, capital B (the founder). The docs and token notes follow. The key (`aboveboard`) and the domain are unchanged.

## 0.2.0 — 2026-10-26

Brought up to app.coifish.com, the family's reference (the founder: "coifish is the most recent and it sounds like harbor needs updated for the other two"). Built on a branch; Coifish built against it matches its own screenshots byte for byte (143 of 145 pages and states; the other two differ only by a loading moment and the day's dates).

- **Dock** (breaking): Coifish's shape. `DockCorner` puts this app's mark in the bar's corner, `Dock` is the rail of the other two apps, `DockButton` opens them on a phone. The company tile, the account menu, the expand toggle, `toggleDock` and `data-dock` are gone.
- **ThemeSwitch** (breaking look): Coifish's switch, announced to screen readers as a switch, with `storageKey` and `className`. `themeChoiceScript(storageKey)` applies a remembered choice before the first paint; `themeBootScript` stays for 0.1 apps. Both now live in a plain module (`src/theme.ts`), so a server-rendered layout gets the script's text: in 0.1 it got a reference to client code.
- **tokens.css**: follows the device's dark setting where nobody has chosen (no script needed), takes the light values for print, sets `color-scheme`, and finds the fonts by next/font's variables (`--font-fraunces`, `--font-instrument`, `--font-plex-mono`) before their names. `npm run check` now also compares it with `tokens.json` (`scripts/check-tokens.mjs`).
- **harbor.css**: in the `components` cascade layer, so an app's utility classes can still adjust a shared component; `.when-light` / `.when-dark` follow the device too; the badge (`.pill`) has its full look; the Dock, switch and family section are Coifish's.
- **StatusBadge**: Coifish's look and glyphs, an `info` tone ("Pending review"), and `wrap`.
- **FamilySection**: Coifish's cards (36px marks, links in the same tab, no icon).
- **apps.json**: ReelMinder and PacketSkipper are `live` (their sites are up and linked, as Coifish shows them), and PacketSkipper's line is the founder's of October 25: "Board packets, minutes, action items, all in one place." `live` now means "the site is up"; sign-ups are each app's own setting.
- **No icon library**: `lucide-react` is no longer a peer dependency.
- Docs: `HARBOR.md` (the Dock, fonts served from the app's own site, the badge's glyphs), `components.md`, `app-shell.md`, `README.md`, `CLAUDE.md.snippet`, and `docs/MIGRATION.md` (lessons from Coifish's move, and 0.1 to 0.2).
- `site.md`: the page as coifish.com has it (the header, 1100px, 40px between sections, the kicker in sea, the 44px headline, three other questions).

## 0.1.0 — 2026-10-25

- First version as a package. Merged the three per-app `harbor/` folders. PacketSkipper's copy was the newest and most complete and is the base; the docs now live in one place.
- `apps.json`: ReelMinder's address is reelminders.com (the site is live). Whether signups are open (`live`) is still per the founder.
- Shared components ported out of PacketSkipper and made app-agnostic: `Dock` takes its app key, user and sign-out form as props instead of importing the app's config; `Mark` ships the SVGs inline so no app needs the logo files on disk; `FamilySection` takes the current app key.
- `harbor.css` extracted from PacketSkipper's `globals.css`: the Dock, pill, panel, family section, theme switch and the small utilities they use.
- Company name is still COIFISH LLC everywhere. It changes to Longline Labs LLC in a later version, once the state approves the amendment.
