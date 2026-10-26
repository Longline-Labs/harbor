# Changelog

## 0.1.0 — 2026-10-25

- First version as a package. Merged the three per-app `harbor/` folders. Tabbed's (PacketSkipper's) copy was the newest and most complete and is the base; the docs now live in one place.
- `apps.json`: ReelMinder's address is reelminders.com (the site is live). Whether signups are open (`live`) is still per the founder.
- Shared components ported out of PacketSkipper and made app-agnostic: `Dock` takes its app key, user and sign-out form as props instead of importing the app's config; `Mark` ships the SVGs inline so no app needs the logo files on disk; `FamilySection` takes the current app key.
- `harbor.css` extracted from PacketSkipper's `globals.css`: the Dock, pill, panel, family section, theme switch and the small utilities they use.
- Company name is still COIFISH LLC everywhere. It changes to Longline Labs LLC in a later version, once the state approves the amendment.
