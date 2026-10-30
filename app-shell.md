# The app shell every Longline Labs app shares

app.coifish.com is the reference. ReelMinder and PacketSkipper reproduce the same shell so a manager who uses two of them never has to relearn where things are. Components and tokens: `components.md`, `tokens.css`.

## Layout, left to right

1. **The Dock** (`components.md` → Dock): 56px collapsed, 232px expanded, `paper-raised`, hairline right edge. The company mark (the Linked LL) on top, then one tile per app in this fixed order: Coifish, ReelMinder, PacketSkipper. The current app's tile gets `sea-tint` and a 2px inset ring in its accent. Live siblings link out to `app.<domain>`; unreleased ones show their mark faded with `Coming soon`. Bottom: avatar and theme toggle. The Dock holds no in-app navigation.
2. **App bar**: wordmark at left (mark 28px + Fraunces 500 22px), page-level primary actions at right, 2px underline in the app's accent. This underline is the only place the accent appears in the chrome.
3. **Page**: title in `display-xl`, one `body-sm` `ink-muted` context line ("Harbor View Condominiums · 38 vendors"), then stat tiles, filters, and the main table in that order. Content gutter `space-5`.

## In-app navigation

Tabs under the app bar, as app.coifish.com does (Vendors · Review · Certificates · Associations · Reminders). Tabs are `heading` style, active tab underlined 2px in `sea` (not the accent), counts in `numeral` after the label. Each app's tab set is in its own folder's `APP.md`.

## Shared behaviours

- Association switcher: a select in the filter row, first position, with `All associations` as an option. Same control, same place, in every app.
- Statuses are StatusBadges with the four tones; every status carries a word.
- Dates ISO, amounts right-aligned, IDs in `numeral`.
- Empty states: `display-md` headline, one `body` sentence, one primary button. No illustrations.
- Sign-in, help and settings pages are identical across the apps apart from the mark and wordmark.
- Emails the apps send use the same template: mark + wordmark at top, `sea` button, hairline footer with `LONGLINE LABS LLC` and the app's address; dark-file mark on the sea button if the mark appears on it.
