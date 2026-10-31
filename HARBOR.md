# Harbor — the design language shared by the Longline Labs apps

Harbor is the shared design language for the six Longline Labs LLC apps built for community association managers: **Coifish** (certificates of insurance), **ReelMinder** (reminders), **PacketSkipper** (board packets, minutes, action items), **BallastBook** (annual budgets), **ShipShape** (file naming) and **Aboveboard** (public document posting). One system, six accents. A manager who opens any of them should feel they are in the same office, at a different desk.

## The idea

The names share a thread — a fish, a reel, a skipper, ballast, a ship, a deck — and the system acknowledges it with a light touch: a deep sea blue for everything the company owns and a plain figure in each mark, nothing more. No waves, ropes or anchors in the UI. What carries the family is a warm paper ground, one honest accent per app, serif titles with tabular figures underneath, and hairlines instead of drop shadows.

Three principles decide most questions:

1. **Paper, not glass.** Surfaces are warm and matte. Separate them with `hairline`, never with shadows or gradients. `shadow-float` exists only for menus and dialogs.
2. **The company owns the chrome, the app owns one color.** Everything structural — buttons, links, navigation, focus rings, the structural strokes of every logo — is `sea`. Each app gets exactly one accent (`koi`, `brass`, `kelp`, `cobalt`, `plum`, `azure`) and spends it on its mark, its active Dock tile, and a single underline in its app bar. If an accent is showing up in body UI, something is wrong.
3. **Figures are data.** Dates, dollar limits, policy numbers and counts are set in `numeral` (mono, tabular) so columns line up and a manager can scan a list of forty vendors without reading every row.

## Voice

Write like a competent colleague leaving a note, not like a product. Plain sentences, present tense, second person. Name the thing: "Bayview Landscaping's general liability expires Nov 30" beats "A certificate is expiring soon." Numbers go first when the number is the point: "12 certificates expire this month." Never use exclamation marks in the UI. No emoji anywhere in product copy. Sentence case for every heading, button and label; `label` style is uppercased by CSS, never typed in caps.

Product names are spelled one way everywhere, in prose and in the wordmarks alike: **Coifish**, **ReelMinder**, **PacketSkipper**. Never lowercase them, never write COIFish. The company is **LONGLINE LABS LLC** in legal lines (the copyright, the Terms), always in caps there, and **Longline Labs** in prose. It was LONGLINE LABS LLC until the state approved the Articles of Amendment in October 2026; historical documents keep the old name. "COI" inside Coifish is the certificate-of-insurance pun; let product copy use the term naturally ("every COI, current") rather than forcing it with capitals.

Buttons name the result: "Send reminder", "Add vendor", "Build packet". Not "Submit", "OK", "Go".

## Color

- Ground everything on `paper`; raise cards and the Dock to `paper-raised`; sink inputs and code to `paper-sunken`.
- Text is `ink`; secondary text is `ink-muted`; `ink-faint` is for placeholders and disabled only, because it is below 4.5:1 on purpose.
- `sea` is the only color for primary buttons (with `on-sea` text), links, active navigation and the `focus` ring. `sea-tint` grounds selected rows and the active Dock tile.
- App accents come in pairs. The plain token (`koi`, `brass`, `kelp`, `cobalt`, `plum`, `azure`) is a fill or stroke for the mark and small chrome, never under text. The `-deep` token is the same accent at reading contrast, for an in-app highlight that must be read: an overdue count in Coifish is `koi-deep`.
- Status is `status-ok` / `status-warn` / `status-danger` on its own `-tint`, always with a word or icon. `status-ok` is a teal rather than a green so that ok and danger never differ by hue alone.

Both themes ship in every app. Night watch is a true dark theme: the same tokens, re-valued, with accents lifted so they read on the hull. A page follows the device's setting until the person uses the theme switch; from then on that browser remembers the choice. `tokens.css` does the following by itself, and a printed page always takes the light values.

## Type

- Fraunces (display, optical size on) for `display-xl` and `display-md` only: page titles, section titles, one big number. It is the one place the system is allowed to have character.
- Instrument Sans for everything else: `title`, `heading`, `body`, `body-sm`, `label`.
- IBM Plex Mono at weight 500 for `numeral` and `numeral-lg`: any date, amount, ID or count that sits in a column or a stat.

All three are Google Fonts. Serve them from the app's own site (Next.js's `next/font` does this, with the variables `--font-fraunces`, `--font-instrument` and `--font-plex-mono`, which `tokens.css` picks up), so opening a page asks Google for nothing and the privacy policy needs no font service. Do not substitute Inter, Roboto or a system sans for Instrument Sans — the warmth of the system depends on it.

## Spacing, radius, borders

- Space on a 4px scale: `space-1` through `space-7`. Cards pad `space-4`, sit `space-5` apart, sections sit `space-6` apart.
- Corners: `radius-sm` on inputs and badges, `radius-md` on buttons and cards, `radius-lg` on dialogs and the expanded Dock, `radius-round` for avatars and the marks.
- Every border is 1px `hairline`. When a border has to carry meaning (an input's resting edge), use `hairline-strong`, which meets 3:1.
- Shadows: `shadow-float` on things that float. Nothing else casts one.

## Marks and logos

All seven marks share one construction: a 48-unit grid, drawn as outline strokes (about 3.4, round caps and joins), in two inks. The company mark is a ring; each app mark is its figure alone, with no ring. In an app mark, the part that names the app is in its accent and the supporting strokes are in `sea` by day and paper by night. The sea strokes are the family; the accent is the app.

- `longline-labs-mark` — the Linked LL (Option A, approved October 30, 2026): two L strokes sharing a baseline that turns up at the right. The company, one ink: `sea` by day, paper by night. The old ring-and-dot (`coifish-llc-mark`) is retired and no longer drawn.
- `coifish-mark` — a koi: the body in `koi`, the tail and eye in `sea`.
- `reelminder-mark` — a reel: the spool and hub in `brass`, the crank and the clock-like stem in `sea`.
- `packetskipper-mark` — a captain's cap: the crown and badge dot in `kelp`, the band and brim in `sea`.
- `ballastbook-mark` — a book and keel: the open book in `cobalt`, the keel beneath in `sea`.
- `shipshapefiles-mark` — a name tag: the tag and its two lines in `plum`, the string and its knot in `sea`. The product is **ShipShape**; the files and the key are named after its domain, shipshapefiles.com.
- `aboveboard-mark` — a document above a board: the page in `azure`, the deck line beneath in `sea`. No mast, no hull: the approved design is the page and the line.

The three newer marks take their night accent from the brand package's palette (`cobalt` #8aa0e0, `plum` #c993c2, `azure` #79b9d8); the first three keep their day accent in the dark files, as approved earlier.

Rules: the mark never rotates, never gets a shadow, never sits on a gradient. Minimum size 20px. On `paper` use the standard file; on a `sea` or dark ground use the `-dark` file (paper where the standard file has sea); for one-ink uses (favicons in a tab, stamps, embroidery) use the `-mono` file. The wordmark is the app name in Fraunces 500, spelled exactly as in prose, set to the right of the mark at the mark's cap height, with `space-2` between; "LONGLINE LABS LLC" in the company lockup is `label` style in `ink-muted` beneath or beside the ring. Never recolor an app's figure in another app's accent.

## The Dock

The Dock is how the apps reveal they are a family, and app.coifish.com is its reference (the founder, October 25, 2026). The top-left corner of every app's bar belongs to the app in use: its mark at 38px in a 56px cell with a `hairline` right edge (`DockCorner`). Beneath it runs the rail (`Dock`): 56px wide on `paper-raised` with a `hairline` right edge, holding only the *other* apps in `apps.json` order, marks at 26px, each a link to its site once it is live (`live` in `apps.json`), faded with "Coming soon" before. The app in use is never repeated in the rail, and nothing else sits there: sign in, the theme switch and the account belong to the app's own bar. On phones the corner and the rail are hidden; a menu button in the bar (`DockButton`) opens the other apps as a 232px panel from the left, titled "Other apps". The Dock never scrolls and never holds in-app navigation.

## App bar and pages

Each app's app bar sits to the right of the Dock: the app's wordmark at left (Fraunces 500, camel-case spelling), the page's primary actions at right, a 2px underline in the app's accent along the bar's bottom edge. Page titles are `display-xl` in `ink`, with a `body-sm` `ink-muted` line beneath when context helps ("Harbor View Condominiums · 38 vendors"). Content sits on `paper` with a `space-5` gutter.

## Iconography

Use Lucide icons at 20px with stroke 1.75 and round caps, which match the weight of the marks. The status badge carries Harbor's own three glyphs (a check, a clock, a cross, drawn on a 16 grid), so the package itself needs no icon library. Icons are `ink` beside text, `ink-muted` when decorative, and a status color only inside a status badge. No emoji, no filled icon sets, no illustrations in product screens; the only pictures in the UI are the marks.

## Motion

Short and functional: 150ms ease-out for hover and focus, 200ms for a panel opening, nothing longer. Respect `prefers-reduced-motion`. Nothing bounces.


## Files in this folder

- `tokens.css` — every color (light, and dark by `data-theme` or by the device), spacing, radius, font stack and text style as CSS custom properties and classes, with the light values again for print. Import it once at the app root. `npm run check` confirms it says what `tokens.json` says.
- `tokens.json` — the same tokens as data, for Tailwind config or a theme object.
- `logos/` — the four marks (Option 2, approved). `*-mark.svg` on light grounds, `*-mark-dark.svg` on dark grounds or a sea fill, `*-mark-mono.svg` for one-ink uses; `logos/LOGO-HANDOFF.md` has the integration notes.
- `components.md` — how each shared component should look and behave.
- `app-shell.md` — the app.coifish.com layout (Dock, app bar, tabs, page template) that every app follows.
- `site.md` — the coifish.com page pattern, section by section, that every marketing site follows.
- `harbor.css` — the shared components' styles, in the `components` cascade layer (Tailwind's own), so an app's utility classes can still adjust them.
- `apps.json` — the one list of the six apps, read by the Dock and the "Apps for Community Association Managers" section.
