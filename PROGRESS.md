# Progress

Newest first. Releases are in `CHANGELOG.md`; this file says where work stands.

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

## Nov 7, 2026: 0.6.0, Help & support (branch `claude/support-dialog`, from `origin/main` at 6e08cb2; NOT merged or tagged)

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
