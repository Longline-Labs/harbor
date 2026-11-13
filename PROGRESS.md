# Progress

Newest first. Releases are in `CHANGELOG.md`; this file says where work stands.

## Nov 13, 2026: 0.6.4, wording for a human voice (branch `claude/human-wording-2026-11-13`): LIVE

- **Live, November 13, 2026** (Brandon: "Yes, publish"; Claude ran it): pushed `main` bf627d8..c89537f and the tag `v0.6.4` (0.6.3 is taken by the reelminder.com branch). The six apps now pin 0.6.4. Checked live on the home, Help, sign-in and sign-up pages.

- Brandon (Nov 13, 2026): "Wording needs fixed and needs to sound more human on all websites." `apps.json`: `familyLine` and the BallastBook, ShipShape and AboveBoard descriptions match `@longline/web` 0.5.6 word for word. Coifish, ReelMinder and PacketSkipper keep Harbor's shorter lines, because PacketSkipper's signed-in Settings builds a sentence from the ReelMinder one.
- `site.md`'s Voice section points to the voice guide: `../../research/human-wording-2026-11-13/VOICE.md`.
- Left for later (signed-in only, not words-only): `Dock.tsx`'s `aria-label` says "Other LONGLINE LABS LLC apps" aloud (it reads the legal name); it should say "Other Longline Labs apps".

## Nov 13, 2026: 0.6.2, Community Manager and Community Association Manager capitalized: LIVE

- **Pushed November 13, 2026** (Brandon: "Yes, publish"): `main` 3f03ec9..bf627d8 and the tag `v0.6.2`. Wording only: `FamilySection`'s default heading, the docs, the CSS comment, and the rule in `HARBOR.md`, `site.md` and `CLAUDE.md.snippet`. `@longline/web` 0.5.4 says the same.
- Pinned by AboveBoard, BallastBook, Coifish, PacketSkipper, ReelMinder and ShipShape (all live). `longline-account` still pins 0.5.1 and was not moved: it has no text with these terms.

## Nov 7, 2026: 0.6.1, the app list says what the websites say (branch `claude/family-wording`, from `origin/main` at 445f3bd; tagged `v0.6.1` locally, NOT merged or pushed)

- `apps.json`: the website copy review's family line and three cards (CHANGELOG, 0.6.1), the same words as
  `@longline/web` 0.5.3. `FamilySection`'s heading in sentence case. `npm run check` clean, `npm test` 11 of 11.
- 0.6.0 (Help & support) is already on `main` and tagged on GitHub, so 0.6.1 sits on top of it. 0.6.0 only adds
  exports and `.support-*` styles, so an app still on 0.5.1 can move straight to 0.6.1 with nothing changing on screen.
- **To release** (on Brandon's yes): merge `claude/family-wording` into `main`, push `main` and the tag `v0.6.1`.
- **Re-pins**, one per app on Brandon's yes; none changes anything a customer sees today, so each can wait for the app's
  next release. AboveBoard, BallastBook, PacketSkipper, ReelMinder, ShipShape, and Coifish: move `#v0.6.0` to `#v0.6.1`
  on the app's `claude/help-support` branch before it merges, then `npm install`. longline-account (the sign-in site,
  `go-live`, on 0.5.1): optional, it reads names and addresses only.

## Nov 7, 2026: 0.6.0, Help & support: RELEASED Nov 7 (tag v0.6.0 at 445f3bd), LIVE in all six apps Nov 10, 2026

- Brandon's yes ("Yes, start release", Nov 7, 2026): `main` fast-forwarded to 445f3bd and tagged `v0.6.0`. All six apps
  pin `#v0.6.0` and went live with it on Nov 10 (AboveBoard, BallastBook, ReelMinder, PacketSkipper, ShipShape; Coifish
  last, from 0.1.1). The apps then move to 0.6.1 (wording) with the bot-and-spam publish. Lesson from Coifish's journeys:
  the dialog's form stays in the page while closed (to keep a draft), so a test selector like `input[type="file"]` across
  the whole page can match its hidden screenshot picker; scope such selectors to `main`.

- Built: `SupportProvider`, `SupportButton`, `useSupport`, `SupportDialog`, `SupportForm` (`src/SupportDialog.tsx`), the
  shared rules and email shape in `src/support.ts` (also exported as `@longline/harbor/support` for servers), the
  `.support-*` styles in `harbor.css`, and `src/support.test.ts` (`npm test`, 11 tests). `npm run check` clean.
- Tried in AboveBoard (its branch `claude/help-support`, Harbor unpacked from `npm pack` into its node_modules): the
  dialog in light and dark at 1280 px and phone width, a message with a picture, the public Help page's form with the
  Turnstile test widget. Screenshots: `../../research/help-support-2026-11-07/screenshots/`.
- All six apps take it on their own `claude/help-support` branches, committed and tested (Nov 7, 2026): AboveBoard
  8efde0e, BallastBook 0dbdee8, ReelMinder 025acf6, ShipShape d485c0c, PacketSkipper e0d753b, Coifish 8b575e6 (Coifish
  moves from 0.1.1; none of harbor.css's classes are used by its markup, so nothing on screen changes). The plan and the
  choices for Brandon: `../../research/help-support-2026-11-07/README.md`.
- An independent review found problems in the text cleaning, the link count, the email check and the dialog; fixed in
  510f3fc (CHANGELOG, 0.6.0, "After an independent review").

**To release** (on Brandon's yes): merge `claude/support-dialog` into `main`, `git tag v0.6.0`, push `main` and the tag.
Then each app runs `npm install` to update its lockfile for the `#v0.6.0` pin already on its branch.
