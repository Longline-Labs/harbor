# Progress

Newest first. Releases are in `CHANGELOG.md`; this file says where work stands.

## Nov 7, 2026: 0.6.0, Help & support (branch `claude/support-dialog`, from `origin/main` at 6e08cb2; NOT merged or tagged)

- Built: `SupportProvider`, `SupportButton`, `useSupport`, `SupportDialog`, `SupportForm` (`src/SupportDialog.tsx`), the
  shared rules and email shape in `src/support.ts` (also exported as `@longline/harbor/support` for servers), the
  `.support-*` styles in `harbor.css`, and `src/support.test.ts` (`npm test`, 11 tests). `npm run check` clean.
- Tried in AboveBoard (its branch `claude/help-support`, Harbor unpacked from `npm pack` into its node_modules): the
  dialog in light and dark at 1280 px and phone width, a message with a picture, the public Help page's form with the
  Turnstile test widget. Screenshots: `../../research/help-support-2026-11-07/screenshots/`.
- The other five apps take it on their own `claude/help-support` branches.
- An independent review found problems in the text cleaning, the link count, the email check and the dialog; fixed in
  510f3fc (CHANGELOG, 0.6.0, "After an independent review").

**To release** (on Brandon's yes): merge `claude/support-dialog` into `main`, `git tag v0.6.0`, push `main` and the tag.
Then each app runs `npm install` to update its lockfile for the `#v0.6.0` pin already on its branch.
