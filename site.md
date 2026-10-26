# The COIFISH LLC website pattern

coifish.com is the reference. reelminder.com (reelminders.com until the .com lands) and packetskipper.com use the same page, section for section, with the app's own copy, accent and mark. Someone landing on any of the three should recognise the other two instantly. The design tokens, type and components come from `tokens.css`, `HARBOR.md` and `components.md`; this file is the page itself.

## Site shell

- **Header**: app mark at 32px (light file; dark file when the dark theme is on) + wordmark in Fraunces 500, 26px, spelled exactly as in prose. Right side: `How it works` (#how), `Pricing` (#pricing), `Help` (app.<domain>/help), `Sign in` (app.<domain>/sign-in), then one `sea` primary button. One hairline under the header. No accent in the header except inside the mark.
- **Theme**: paper by day, hull by night, `data-theme` toggle in the header's right group like coifish.com.
- **Container**: max 1120px, 24px gutter. Sections sit `space-7` (48px) apart on desktop, `space-6` on phones.
- **Footer**: hairline above, "© 2026 COIFISH LLC" at left, then `Help`, `Terms of Service`, `Privacy Policy`, `Sign in`. The company ring-and-dot mark may sit before the copyright at 20px.

## Section order (do not reorder, do not skip)

1. **Hero** — kicker in `label` style in the app's `-deep` accent, headline in `display-xl` (52/56 on desktop), one body paragraph in `ink-muted`, primary button `Start your 30-day free trial`, note `No credit card required` beneath. Coifish's kicker is "Stop fishing for COIs."; each app gets one of its own in the same register (a wry four-to-six-word line, no exclamation mark).
2. **Product mockup** — a `paper-raised` card with a hairline, captioned `Example with made-up <nouns>` and labelled `app.<domain>`. It shows the app's main screen: tabs across the top, summary counts, then the main table with status badges. Build it in HTML with the real components; never a screenshot.
3. **Timeline / at-a-glance view** — the one visual that shows the app's core promise over time. Coifish: expirations on a date axis. The other two define theirs below.
4. **How it works** (#how) — exactly three numbered steps, each a short title and two sentences.
5. **Six checkmarks** — no heading; six bold lead-ins with one sentence each. Mirror Coifish's set where it applies ("Your data stays yours" and "Quiet unless it matters" are family promises and appear on every site).
6. **Pricing** (#pricing) — headline `Pricing`, `From $N a year`, one sentence on what the price depends on, the calculator (`Your price` with a slider), the tier table, a `Pricing questions` FAQ (trial, read-only after trial, add/remove, switching plans, cancellation, payment methods), and the same trial button. Until an app's pricing is decided, keep the block and use `[YOUR PRICE]` placeholders; do not invent numbers.
7. **Other questions** — four FAQs.
8. **Closing CTA** — `Questions? Start your free trial` linked, `(no credit card needed)`, and the line about asking from inside the account.
9. **Apps for Community Association Managers** — three cards, Coifish, ReelMinder, PacketSkipper, each with its mark; the current site's card says `You are here`, unreleased ones say `Coming soon`, released ones link to their site.
10. **Footer** — as above.

## Voice (same as the apps)

Plain sentences, present tense, second person. Name the thing. Numbers first when the number is the point. No exclamation marks, no emoji, sentence case everywhere. Buttons name the result. The reader is a community association manager with forty things to do; every sentence should save them one.

## What changes per app

Only four things: the mark, the accent (kicker, mockup app-bar underline, the active card), the copy, and the mockup/timeline content. Everything else is copied, not re-interpreted.
