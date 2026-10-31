# Harbor

Harbor is the design language shared by **Coifish**, **ReelMinder**, **PacketSkipper**, **BallastBook**, **ShipShape** and **Aboveboard**. This repo is the single source of truth. The apps depend on it as a package; nothing in here is copied into an app by hand anymore.

What's here:

- `HARBOR.md` — the language itself: principles, voice, color, type, spacing, marks, the Dock. Read it before any UI work.
- `components.md`, `app-shell.md`, `site.md` — the shared components, the signed-in app layout, and the public marketing-site page pattern, section by section.
- `tokens.css` / `tokens.json` — every color, font, size, radius and shadow as custom properties. Both themes.
- `harbor.css` — the styles for the shared components (Dock, pill, panel, family section, theme switch, utility classes). Apps import this after `tokens.css`.
- `apps.json` — the one list of the six apps, in longline order (name, address, live or not, one-line description). The Dock and the family section read it.
- `logos/` — the approved marks (the brand package of October 30, 2026; ShipShape's files are named `shipshapefiles`). Never redraw; regenerate raster icons from these.
- `src/` — the shared React components: `Mark`, `StatusBadge`, `ThemeSwitch`, `Dock`, `FamilySection`, plus `apps` and `marks` helpers.
- `docs/MIGRATION.md` — how each app moves from its local `harbor/` folder to this package.
- `CLAUDE.md.snippet` — the section every app's `CLAUDE.md` carries.

## How an app uses it

```
npm install github:Longline-Labs/harbor#v0.2.0
```

Then in the app's root stylesheet:

```css
@import "tailwindcss";
@import "@longline/harbor/tokens.css";
@import "@longline/harbor/harbor.css";
```

And in code:

```tsx
import { Dock, DockCorner, DockButton, Mark, StatusBadge, FamilySection, ThemeSwitch, themeChoiceScript, apps } from "@longline/harbor";
```

Until the repo is on GitHub, apps can depend on the folder directly: `"@longline/harbor": "file:../harbor"`.

## Changing something

1. Change it here, once. Update `CHANGELOG.md`.
2. Bump the version in `package.json` and tag it (`git tag v0.2.0`).
3. In each app, update the dependency to the new tag and run its tests. Apps move at their own pace; a pinned version never changes under them.

The company is Longline Labs LLC (the state approved the Articles of Amendment in October 2026). Its name is in `apps.json` (`company`, read by the Dock and the footers) and in the docs here; its mark is the Linked LL (`logos/longline-labs-mark*.svg`, drawn by `Mark name="company"`). The first three apps pick both up on their next update of the package; BallastBook, ShipShape and Aboveboard started on 0.3.0.
