# Moving an app onto the Harbor package

Do this once per app, in that app's Claude Code session, on a branch, with the test suite green before and after. The apps are Coifish (`apps/Coifish`, accent `koi`), ReelMinder (`apps/ReelMinder`, accent `brass`), PacketSkipper (`apps/PacketSkipper`, accent `kelp`), BallastBook (`apps/BallastBook`, `cobalt`), ShipShape (`apps/ShipShape`, `plum`) and AboveBoard (`apps/AboveBoard`, `azure`); the three newer ones were built on the package from the start.

## Steps

1. Add the dependency. Until the Harbor repo is on GitHub: `"@longline/harbor": "file:../harbor"` in `package.json`, then `npm install`. (Once it has a remote: `github:<owner>/harbor#v0.1.0`.)
2. In the root stylesheet (`src/app/globals.css`, and `site/app/site.css` where the marketing site is a separate Next app), replace the import of `../../harbor/tokens.css` with `@import "@longline/harbor/tokens.css";` followed by `@import "@longline/harbor/harbor.css";`.
3. Delete the app's own copies of what the package now provides, and point imports at the package:
   - the `harbor/` folder at the repo root (docs, tokens, logos, apps.json);
   - the local Dock, Mark, StatusBadge, ThemeSwitch and FamilySection components (whatever they are named in this repo);
   - the CSS blocks for `.dock*`, `.pill*`, `.theme-switch`, `.theme-knob`, `.family*`, `.panel`, `.label`, `.h-display*`, `.site-container`, `.sr`, `.when-*` in the app's stylesheet, which now come from `harbor.css`. Keep any app-specific rules that sit beside them.
   - `src/config/product.ts` (or equivalent) imports `apps` from the package instead of `../../harbor/apps.json`.
4. Wire the Dock: `<Dock current="packetskipper" user={user} signOut={<form action={signOutAction}>…</form>} accountHref="/settings" adminHref={user.isFounder ? "/admin" : undefined} />`. The Dock no longer imports anything from the app.
5. Where the app read the company name or app list from its own config, read `company` and `apps` from the package.
6. Run the full suite, lint and type-check. Open the app and the marketing site in a browser and compare the Dock, badges, header, footer and family section against the other apps; they should be pixel-identical.
7. Replace the Harbor section of `CLAUDE.md` with `CLAUDE.md.snippet` from the package, with this app's accent filled in.
8. Commit: "Harbor: use the shared package instead of a local copy."

## Things to check afterwards

- Dark theme still switches and is remembered.
- The Dock's current-app ring is this app's accent.
- Emails that embed the mark still render (they may inline the SVG from `marks`).
- Favicons and app icons were generated from the logos and are unchanged.

## What Coifish's move turned up (October 26, 2026)

- **Copy the package, don't link it.** With `file:../harbor`, npm makes a link by default, and TypeScript and Next.js then look for React beside `../harbor`, where there is none. Add `install-links=true` to the app's `.npmrc` so npm copies the package into `node_modules`, and `transpilePackages: ["@longline/harbor"]` to `next.config.ts`, because the package is TypeScript. After changing Harbor, run `npm install` in the app to copy it again.
- **Vercel can't see `../harbor`.** Before an app that depends on `file:../harbor` is deployed, point it at the GitHub tag instead (`github:Longline-Labs/harbor#v0.2.0`) and give Vercel read access to the harbor repo.
- **Tailwind shares some names with `tokens.css`.** `--radius-md`, `--radius-lg` and the three `--font-*` stacks are also Tailwind v4 theme variables. An app drawn with Tailwind's own corner sizes keeps them by writing them in its `@theme inline` block (`--radius-md: 0.375rem; --radius-lg: 0.5rem;`), as Coifish does.
- **Compare screenshots side by side, not before and after.** Build the app's `main` in a second folder and the branch in this one, run both at once, and capture the same pages from each at the same moment: anything dated from today differs otherwise.

## Moving from 0.1 to 0.2

0.2 makes the package what app.coifish.com is (the founder: "coifish is the most recent"). In each app:

1. Update the dependency (`npm install` with `file:../harbor`, or the new tag), and remove `lucide-react` if nothing of the app's own uses it: the package no longer needs it.
2. **The Dock** is now three pieces: in the bar, `<DockCorner current="…" href="/" />` at the far left and `<DockButton current="…" />` before the wordmark (phones); beside the page, `<Dock current="…" />` (or `belowBar` under a sticky 64px bar). The account menu, the avatar, `toggleDock` and `data-dock` are gone: the account, Help and Sign out live in the app's own bar, with the `ThemeSwitch`.
3. **The theme:** put `<script dangerouslySetInnerHTML={{ __html: themeChoiceScript() }} />` in the root layout's `<head>` (pass the app's own storage key if it already had one) and drop any code that set `data-theme` from the device: `tokens.css` follows the device by itself now. `themeBootScript` still works but is no longer needed. Both scripts now come from a plain module, so a server-rendered layout gets the text (in 0.1 it got a reference to client code).
4. **StatusBadge** gains `wrap` and an `info` tone, and draws its own glyphs; check badges that relied on Lucide's.
5. **FamilySection** draws coifish.com's cards (36px marks, links in the same tab); give it `current`.
6. Run the suite and compare screenshots against Coifish.
