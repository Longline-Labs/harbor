# Changelog

## 0.6.0 — 2026-11-07

Help & support in every app (Brandon's question of November 7, 2026: "Should we add some kind of a support
button/ticket option in each app?"; the recommendation he was given, built). No change to anything already exported,
so an app takes this by moving its pin; nothing shows until the app puts the provider and the button in.

- **`SupportProvider`, `SupportButton`, `useSupport`**: one Help & support dialog for the signed-in app. The provider
  goes in the signed-in layout around the bar and the page, given `app`, `send` (the app's server action), `supportEmail`,
  `who` (the company and the person's email) and `helpHref`. `SupportButton` reads "Help & support"; the app styles it
  to sit with its own bar buttons, beside Sign out, and puts it in its phone menu too. The dialog lives in the provider,
  so closing a phone menu never closes it. It is **not in the Dock**: the Dock holds no account (HARBOR.md), so the
  entry sits with the account in the app's own bar, which is where "the account menu" is in all six apps.
- **`SupportDialog`, `SupportForm`**: a native `<dialog>` (focus stays inside, Escape and the backdrop close it) holding
  the form: Subject, Message, an optional screenshot (one picture, PNG, JPEG, WebP or GIF, 5 MB at most; it can be
  pasted), one line saying what goes with it ("Sent with your message: AboveBoard, Harbor View Management,
  pat@example.com, the page you're on (/documents), your browser (Safari 18 on Mac, window 1440 × 900)"), and
  Send message. Once sent: "We got it. We answer within one business day." A draft closed unsent is kept until the
  page changes. `SupportForm` alone, with `who` null, is the public Help page's form: it adds Your email, Your name and
  Company, and takes `extra` (the app's bot check, inside the form, so its token is sent). `suggest` offers Help
  sections while typing (Coifish's), `reference` sends an error page's reference along.
- A picture over 3.5 MB is made smaller in the browser before it is sent (longest side 2560, then 1920, as a JPEG),
  because Vercel refuses a request over 4.5 MB. The app's server action still accepts up to 5 MB.
- **`@longline/harbor/support`** (new export, plain TypeScript, safe on the server): `SUPPORT_LIMITS`,
  `SUPPORT_PER_HOUR` (5), `SUPPORT_SUBJECT_PREFIX` ("[Help & support]"), `SUPPORT_THANKS`, `cleanSupportText` (HTML
  and invisible characters out), `checkSupportInput`, `supportPage` (a path, no query, tokens hidden),
  `supportImageKind` (by the file's first bytes; never SVG), `describeBrowser`, `supportEmail` (the support inbox's
  email, one shape in all six apps) and `supportReceipt` (the note to the person, for signed-in messages only, which
  never repeats what they wrote). Also `supportAddressKey`, `countWebAddresses`, `SUPPORT_TRAP_FIELD`,
  `SUPPORT_PUBLIC_PER_ADDRESS_PER_DAY`, `SUPPORT_PUBLIC_MAX_LINKS` and `SUPPORT_RETRY_AFTER_MINUTES` for the public
  form's rules (the bot-and-spam spec, section 7).
- After an independent review the same day: only real HTML tags are removed (ordinary writing like "<Enter>" stays), a
  field far over its limit is refused before cleaning, the email check is plain ASCII, file names aren't counted as web
  addresses, the fields are 16px (no zoom on a phone), the Help page link opens a new tab, the backdrop closes the
  dialog only when the press began there, and the button closes a `<details>` phone menu around it.
- **No network code in the package**: the form calls the `send` it is given. Saving, emailing, the rate limit and the
  bot check are each app's.
- Styles: `.support-*` in harbor.css (tokens only; the dialog is the one Harbor surface with `shadow-float`).
- `npm test`: the shared rules (`src/support.test.ts`, Node's own test runner). Docs: `components.md`, `app-shell.md`.

## 0.5.1 — 2026-11-06

- **apps.json, `appUrl`**: every app now has its signed-in address, where the Dock sends a person's own apps:
  PacketSkipper's is packetskipper.com (its site and its app are one; app.packetskipper.com never existed), and
  BallastBook, ShipShape and AboveBoard opened on November 6 at app.ballastbook.com, app.shipshapefiles.com and
  app.aboveboarddocs.com. No prop or export changes; nothing changes for an app that doesn't pass `inUse`. Matches
  `@longline/web` 0.5.1.

## 0.5.0 — 2026-11-06

Built on 0.3.1 as "0.4.0" on `dock-apps-in-use` (November 3), while 0.4.0 had already been tagged on October 31;
merged onto 0.4.0 and released as 0.5.0. Everything in 0.4.0 below is kept: the names in the rail, the Close button.

- **Dock**: `Dock` and `DockButton` take `inUse`, the signed-in person's apps as keys (their grants at
  account.longlinelabs.com, which the app's own server reads from the account site's `/api/apps-in-use`; single sign-in
  plan, step 9). With at least one app besides the current one in the list, the person's own apps stay at full strength
  and lead to the signed-in app where it has an address; the others go quiet (`dock-quiet`: mark faded as a coming-soon
  one, name muted) but remain links to their sites. No label says which is which: the fade alone tells (Brandon,
  November 4, 2026; a first draft said "You use this" under the name). A used app's link carries `data-in-use`. Without
  the list, with a list that couldn't be read (null), or when the person uses only this app, the Dock is exactly as
  before. `appsToMark` and `ownAppHref` are exported for an app drawing its own rail.
- **apps.json**: each app has `appUrl`, the signed-in app's address (app.coifish.com, app.reelminders.com,
  app.packetskipper.com; null for the three with none yet), which the Dock uses for a person's own apps. BallastBook,
  ShipShape and AboveBoard are `live`: their websites are up (ballastbook.com since October 31, shipshapefiles.com and
  aboveboarddocs.com since November 3; Brandon's word, as `@longline/web` 0.4.11 and 0.4.12 already record), so the
  Dock links to them instead of saying "Coming soon". The apps themselves are still closed to sign-ups; that is each
  site's own business.

## 0.4.0 — 2026-10-31

Found in ReelMinder's review of October 31. No prop or export changes, so an app takes this by moving its pin; the rail and the phone button look different in every app that does.

- **DockButton**: four tiles instead of three lines. The apps button and an app's own Menu button sat in the same bar with the same icon, and people tapped the wrong one.
- **The phone panel**: a visible Close button at the top right (`.dock-close`, 44px), beside "Other apps". Focus goes to it on opening and back to the apps button on closing, and tabbing out of the panel closes it. The panel is announced as a dialog named "Other apps" and scrolls on a very short screen. The backdrop still closes the panel but is now for the pointer only, so screen readers hear one Close button, not two.
- **Dock (the rail)**: each app's name sits under its mark (`.dock-rail-name`), stacked at its capital (Packet / Skipper) to fit the same 56px, and an app that isn't live says `Soon` (`.dock-rail-soon`). The tooltips stay, and what a screen reader hears is unchanged. The rail is taller for it: five apps need about 400px. A screen shorter than that (a large phone on its side) scrolls the rail, with no scrollbar showing, in an app whose rail fills the page too.
- Docs: `HARBOR.md`, `components.md`, `app-shell.md`.

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
