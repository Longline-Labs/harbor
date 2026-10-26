# Harbor

Harbor is the design language shared by **Coifish**, **ReelMinder** and **PacketSkipper**. This repo is the single source of truth. The three apps depend on it as a package; nothing in here is copied into an app by hand anymore.

What's here:

- `HARBOR.md` — the language itself: principles, voice, color, type, spacing, marks, the Dock. Read it before any UI work.
- `components.md`, `app-shell.md`, `site.md` — the shared components, the signed-in app layout, and the public marketing-site page pattern, section by section.
- `tokens.css` / `tokens.json` — every color, font, size, radius and shadow as custom properties. Both themes.
- `harbor.css` — the styles for the shared components (Dock, pill, panel, family section, theme switch, utility classes). Apps import this after `tokens.css`.
- `apps.json` — the one list of the three apps (name, address, live or not, one-line description). The Dock and the family section read it.
- `logos/` — the approved marks (Option 2). Never redraw; regenerate raster icons from these.
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

The company name appears in `HARBOR.md`, `apps.json` and the footer rules. When the LLC rename to Longline Labs is approved by the state, change it here and bump the version; all three apps pick it up on their next update.
