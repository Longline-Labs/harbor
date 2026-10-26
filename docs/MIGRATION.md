# Moving an app onto the Harbor package

Do this once per app, in that app's Claude Code session, on a branch, with the test suite green before and after. The three apps are Coifish (`CertKeep` folder, accent `koi`), ReelMinder (`Reelminder`, accent `brass`) and PacketSkipper (`Tabbed`, accent `kelp`).

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
