# Harbor components

These six are shared by all three apps and must look identical in each. Build them once per codebase from these specs and `tokens.css`.

## Button

Buttons are the same in all three apps: `sea` primary, hairline secondary, quiet for tertiary, and a danger outline for destructive actions.

Provide the label as children (a verb naming the result: "Send reminder", "Build packet"), an optional leading Lucide icon at 16px, and `variant` (primary | secondary | quiet | danger), `size` (md 36px | sm 28px) and `disabled`.

Do: one primary per view. Don't: color a primary button with an app accent, use "Submit"/"OK", or put two primaries side by side.

## Card

A record card and a stat card share one surface: `paper-raised`, 1px `hairline`, `radius-md`, padding `space-4`. No shadow, no colored left border, no header bar fill.

Provide `title`, optional `status` (a StatusBadge), body content (key-value rows with values in `numeral` when they are dates, amounts or IDs), and optional footer actions (at most one primary).

Stat cards take a `label`, a `value` in `numeral-lg`/`display-xl`, and a `meta` line; an app's `-deep` accent may highlight one number in the meta.

## DataTable

Lists of vendors, reminders and action items are the heart of all three apps, so they look identical everywhere.

Provide `columns` (label, key, align, type where type numeral sets `numeral` style and right-aligns amounts) and `rows`. Header row is `label` style on a `hairline-strong` rule; body rows separate with `hairline`; hover grounds a row on `paper-sunken`; selection grounds it on `sea-tint`.

Dates are ISO (2026-11-06) in `numeral`; amounts right-align. Status is always a StatusBadge, never colored text. No zebra striping, no vertical rules.

## Dock

The Dock makes three apps feel like one company. It appears, identically, in Coifish, ReelMinder and PacketSkipper, in three pieces, each given `current` (which app this is):

- `DockCorner` (`href`, default "/"): this app's mark at 38px in a 56px cell at the far left of the bar, with a `hairline` right edge, leading home. Hidden on phones.
- `Dock` (`belowBar` for a 64px bar that stays at the top, as on the public pages): the 56px rail under the corner, on `paper-raised`, listing the other two apps from `apps.json`, marks at 26px. A live app links to its site; one that isn't shows its mark faded (40%, greyscale) and no link. Hidden on phones and in print.
- `DockButton`: on phones only, a menu button in the bar that opens the same list as a 232px panel from the left, titled "Other apps", with "Coming soon" under an app that isn't live; Escape or a tap outside closes it.

The Dock holds no in-app navigation, no account and no theme switch, and never scrolls.

## FormField

Inputs sit in `paper-sunken` wells with a `hairline-strong` resting border and a `sea` focus ring, under a `label`-style label.

Provide `label`, the control (input, select, textarea), optional `help`, and `error` text, which turns the border and help `status-danger`. Fields that take a date, amount or ID use the `numeral` class.

Labels above, never floating inside. Required fields are stated in the help text, not with an asterisk.

## StatusBadge

Status for certificates (Coifish), reminders (ReelMinder) and action items (PacketSkipper) uses one badge with these tones: `ok`, `warn`, `danger`, `neutral`, and `info` for something waiting on the team (Coifish's "Pending review": `sea` on `sea-tint`, never a status colour).

Provide `tone` and the label text. `ok`, `warn` and `danger` carry Harbor's glyph (a check, a clock, a cross) unless `icon={false}`, as a flag beside a status does ("Missing coverage"); `neutral` and `info` have none. `wrap` lets a long label ("No certificate for 2 of 3") break as the text around it does. The label is required — a badge is never a colored dot. Small capitals (0.72rem, weight 600, 0.04em) on the tone's `-tint` ground, `radius-sm` corners.

Don't invent new tones per app; map the app's states onto these.

## ThemeSwitch

The light and dark switch in the bar of every app and site: a 44 by 24 track on `paper-sunken` with an 18px knob carrying a sun or a moon. Announced as a switch named "Dark mode". Give it `storageKey` if the app already remembers the choice under a name of its own (Coifish: "coifish-theme"), so nobody's choice is forgotten, and put `themeChoiceScript(storageKey)` in the root layout's `<head>` so a remembered choice applies before the first paint.

## The family list (apps.json)

`apps.json` is the one list of the three apps: name, web address, whether its site is up (`live`), and a one-line description. The Dock and the family section both read it, so all three apps always agree. When an app's site goes up, set its `live` to true here, bump the version, and update the other two apps. Whether an app takes sign-ups is its own setting, not this one.

## Public site header

As on coifish.com: a sticky bar on `paper-raised`. At far left, the app's mark (38px) in its own 56px cell with a `hairline` right edge, sitting above the rail. Then, in the page's content width, the wordmark (Fraunces 500, no mark beside it on wide screens). At right: `How it works`, `Pricing`, `Help` (quiet links), the theme switch, `Sign in` (quiet), and `Start free trial` (primary). The public header's `Start free trial` is the one exception to "one primary per view": it may sit above a page's own primary, such as the home page's hero button. A 1px `hairline` along the bottom; the accent underline is only for the signed-in app bar. On phones the mark cell and the rail are hidden; a menu button and the mark sit before the wordmark, and the links wrap onto a second row.

## Public rail

The public pages' version of the Dock: a 56px column on `paper-raised` under the header's mark cell, with a `hairline` right edge, sticky beside the page. It lists the other two apps from `apps.json`, mark only (26px), each a link to its site; an app that isn't live shows its faded mark and no link. On phones the menu button opens the same list as a drawer from the left, titled "Other apps", with "Coming soon" beside an app that isn't live.

## Public home page

- Hero in two columns. Left: an eyebrow line in `sea` (the app's short promise, such as "Stop fishing for COIs."), the headline in `display-xl` (Fraunces, larger on wide screens), a `body` paragraph, then the primary `Start your 30-day free trial` with "No credit card required." beside it. Right: a preview of the app in a plain browser frame (address bar with the app's address), using made-up example data, with the caption "Example with made-up …".
- Sections below: a `display-md` title with a `body` line under it, then cards or a figure, in the order `site.md` gives. Content sits in a 1100px column.
- Before an app opens to customers, every `Start free trial` button and `Sign in` link is replaced by an "Opening soon" badge or line (PacketSkipper's `SIGNUPS` setting does this).

## Apps for Community Association Managers (family section)

The last section of every public home page, above the footer, on a `hairline` rule. Title "Apps for Community Association Managers" in `display-md`, as on coifish.com (it was "From COIFISH LLC" with `apps.json`'s `familyLine` beneath; coifish.com dropped the line). Then three cards in a row (stacked on phones), one per app in `apps.json` order: the mark (36px) and the name in Fraunces 500, the description in `ink-muted`, and a `label` at the bottom: "You are here" on the current app, "Coming soon" when not live, otherwise a link "Visit coifish.com" (the app's address, in the same tab). Cards are standard Harbor cards; no accent colors. `FamilySection` draws it, given `current`.

## Public footer

One row on a `hairline` rule: "© 2026 COIFISH LLC", `Help`, `Terms of Service`, `Privacy Policy`, and a `Sign in` secondary button at the far right.

## App bar (signed in)

Two rows to the right of the Dock. Top row: the mark (28px) and the wordmark in Fraunces 500 at left; the signed-in person's name at right. Second row: the app's sections as tabs; the current one is `ink` text, weight 600, on a `paper-raised` tile; the others are `ink-muted`. A 2px underline in the app's accent runs under the tabs, full width.

## Stat strip

A row of up to four counts at the top of an app's home page, in one card divided by `hairline`s: the number in `numeral-lg`, colored by its meaning (`status-danger`, `status-warn`, `status-ok`, or `ink`), and a `body-sm` label beside it, with an optional `ink-muted` qualifier ("within 30 days").
