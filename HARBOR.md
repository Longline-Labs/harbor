# Harbor — the design language shared by Coifish, ReelMinder and PacketSkipper

Harbor is the shared design language for the three Longline Labs LLC apps built for community association managers: **Coifish** (certificates of insurance), **ReelMinder** (reminders) and **PacketSkipper** (board packets, minutes, action items). One system, three accents. A manager who opens any of the three should feel they are in the same office, at a different desk.

## The idea

The three names happen to share a thread — a fish, a reel, a skipper — and the system acknowledges it with a light touch: a deep sea blue for everything the company owns and a plain figure in each mark, nothing more. No waves, ropes or anchors in the UI. What carries the family is a warm paper ground, one honest accent per app, serif titles with tabular figures underneath, and hairlines instead of drop shadows.

Three principles decide most questions:

1. **Paper, not glass.** Surfaces are warm and matte. Separate them with `hairline`, never with shadows or gradients. `shadow-float` exists only for menus and dialogs.
2. **The company owns the chrome, the app owns one color.** Everything structural — buttons, links, navigation, focus rings, the structural strokes of every logo — is `sea`. Each app gets exactly one accent (`koi`, `brass`, `kelp`) and spends it on its mark, its active Dock tile, and a single underline in its app bar. If an accent is showing up in body UI, something is wrong.
3. **Figures are data.** Dates, dollar limits, policy numbers and counts are set in `numeral` (mono, tabular) so columns line up and a manager can scan a list of forty vendors without reading every row.

## Voice

Write like a competent colleague leaving a note, not like a product. Plain sentences, present tense, second person. Name the thing: "Bayview Landscaping's general liability expires Nov 30" beats "A certificate is expiring soon." Numbers go first when the number is the point: "12 certificates expire this month." Never use exclamation marks in the UI. No emoji anywhere in product copy. Sentence case for every heading, button and label; `label` style is uppercased by CSS, never typed in caps.

Product names are spelled one way everywhere, in prose and in the wordmarks alike: **Coifish**, **ReelMinder**, **PacketSkipper**. Never lowercase them, never write COIFish. The company is **LONGLINE LABS LLC** in legal lines (the copyright, the Terms), always in caps there, and **Longline Labs** in prose. It was COIFISH LLC until the state approved the Articles of Amendment in October 2026; historical documents keep the old name. "COI" inside Coifish is the certificate-of-insurance pun; let product copy use the term naturally ("every COI, current") rather than forcing it with capitals.

Buttons name the result: "Send reminder", "Add vendor", "Build packet". Not "Submit", "OK", "Go".

## Color

- Ground everything on `paper`; raise cards and the Dock to `paper-raised`; sink inputs and code to `paper-sunken`.
- Text is `ink`; secondary text is `ink-muted`; `ink-faint` is for placeholders and disabled only, because it is below 4.5:1 on purpose.
- `sea` is the only color for primary buttons (with `on-sea` text), links, active navigation and the `focus` ring. `sea-tint` grounds selected rows and the active Dock tile.
- App accents come in pairs. The plain token (`koi`, `brass`, `kelp`) is a fill or stroke for the mark and small chrome, never under text. The `-deep` token is the same accent at reading contrast, for an in-app highlight that must be read: an overdue count in Coifish is `koi-deep`.
- Status is `status-ok` / `status-warn` / `status-danger` on its own `-tint`, always with a word or icon. `status-ok` is a teal rather than a green so that ok and danger never differ by hue alone.

Both themes ship in every app. Night watch is a true dark theme: the same tokens, re-valued, with accents lifted so they read on the hull.

## Type

- Fraunces (display, optical size on) for `display-xl` and `display-md` only: page titles, section titles, one big number. It is the one place the system is allowed to have character.
- Instrument Sans for everything else: `title`, `heading`, `body`, `body-sm`, `label`.
- IBM Plex Mono at weight 500 for `numeral` and `numeral-lg`: any date, amount, ID or count that sits in a column or a stat.

All three are Google Fonts; load them from fonts.googleapis.com. Do not substitute Inter, Roboto or a system sans for Instrument Sans — the warmth of the system depends on it.

## Spacing, radius, borders

- Space on a 4px scale: `space-1` through `space-7`. Cards pad `space-4`, sit `space-5` apart, sections sit `space-6` apart.
- Corners: `radius-sm` on inputs and badges, `radius-md` on buttons and cards, `radius-lg` on dialogs and the expanded Dock, `radius-round` for avatars and the marks.
- Every border is 1px `hairline`. When a border has to carry meaning (an input's resting edge), use `hairline-strong`, which meets 3:1.
- Shadows: `shadow-float` on things that float. Nothing else casts one.

## Marks and logos

All four marks share one construction: a 48-unit grid, drawn as outline strokes (about 3.4, round caps and joins), in two inks. The company mark is a ring; each app mark is its figure alone, with no ring. In an app mark, the part that names the app is in its accent and the supporting strokes are in `sea` by day and paper by night. The sea strokes are the family; the accent is the app.

- `longline-labs-mark` — the Linked LL (Option A, approved October 30, 2026): two L strokes sharing a baseline that turns up at the right. The company, one ink: `sea` by day, paper by night. The old ring-and-dot (`coifish-llc-mark`) is retired and no longer drawn.
- `coifish-mark` — a koi: the body in `koi`, the tail and eye in `sea`.
- `reelminder-mark` — a reel: the spool and hub in `brass`, the crank and the clock-like stem in `sea`.
- `packetskipper-mark` — a captain's cap: the crown and badge dot in `kelp`, the band and brim in `sea`.

Rules: the mark never rotates, never gets a shadow, never sits on a gradient. Minimum size 20px. On `paper` use the standard file; on a `sea` or dark ground use the `-dark` file (paper where the standard file has sea); for one-ink uses (favicons in a tab, stamps, embroidery) use the `-mono` file. The wordmark is the app name in Fraunces 500, spelled exactly as in prose, set to the right of the mark at the mark's cap height, with `space-2` between; "COIFISH LLC" in the company lockup is `label` style in `ink-muted` beneath or beside the ring. Never recolor an app's figure in another app's accent.

## The Dock

The Dock is how the three apps reveal they are a family. It is a left rail in every app, 56px collapsed and 232px expanded, on `paper-raised` with a `hairline` right edge. Top: the company mark. Below it, one tile per app, each showing that app's mark. The tile for the app you are in gets a `sea-tint` ground and a 2px ring in that app's accent (`koi` in Coifish, `brass` in ReelMinder, `kelp` in PacketSkipper); the other tiles are links out, their marks at full color but no ring. Apps that are not live yet appear with their mark in `ink-faint` and a "Coming soon" `label`. Bottom of the Dock: the signed-in manager's avatar and the theme toggle. The Dock never scrolls and never holds in-app navigation; that belongs in the app bar and page.

## App bar and pages

Each app's app bar sits to the right of the Dock: the app's wordmark at left (Fraunces 500, camel-case spelling), the page's primary actions at right, a 2px underline in the app's accent along the bar's bottom edge. Page titles are `display-xl` in `ink`, with a `body-sm` `ink-muted` line beneath when context helps ("Harbor View Condominiums · 38 vendors"). Content sits on `paper` with a `space-5` gutter.

## Iconography

Use Lucide icons at 20px with stroke 1.75 and round caps, which match the weight of the marks. Icons are `ink` beside text, `ink-muted` when decorative, and a status color only inside a status badge. No emoji, no filled icon sets, no illustrations in product screens; the only pictures in the UI are the four marks.

## Motion

Short and functional: 150ms ease-out for hover and focus, 200ms for a panel opening, nothing longer. Respect `prefers-reduced-motion`. Nothing bounces.


## Files in this folder

- `tokens.css` — every color (light + dark via `data-theme`), spacing, radius, font stack and text style as CSS custom properties and classes. Import it once at the app root.
- `tokens.json` — the same tokens as data, for Tailwind config or a theme object.
- `logos/` — the four marks (Option 2, approved). `*-mark.svg` on light grounds, `*-mark-dark.svg` on dark grounds or a sea fill, `*-mark-mono.svg` for one-ink uses; `logos/LOGO-HANDOFF.md` has the integration notes.
- `components.md` — how each shared component should look and behave.
- `app-shell.md` — the app.coifish.com layout (Dock, app bar, tabs, page template) that every app follows.
- `site.md` — the coifish.com page pattern, section by section, that every marketing site follows.
- `apps.json` — the one list of the three apps, read by the Dock and the "Apps for Community Association Managers" section.
