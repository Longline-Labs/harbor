# Decisions

Choices made in the Harbor package, in plain English. **please confirm** marks the ones Brandon should look at.

## Help & support (0.6.0, November 7, 2026)

- **The entry sits in each app's bar, beside Sign out, not in the Dock** (please confirm). The brief said "the Dock's
  account menu", but the Dock holds no account (HARBOR.md, since 0.2.0); the account is in each app's own bar, so
  `SupportButton` goes there and in the phone menu, styled by the app like its other bar buttons.
- **A provider holds the dialog.** `SupportProvider` in the signed-in layout keeps the one dialog, so a button in a phone
  menu can close its menu without closing the dialog it opened.
- **No network code in the package.** The form calls the `send` function the app hands it (its server action). Saving,
  emails, limits and the bot check belong to each app; what must match across apps (limits, subject prefix, the support
  email's shape, the person's note) is shared as plain functions in `src/support.ts`.
- **Pictures over 3.5 MB are made smaller in the browser** (longest side 2560 px, then 1920, as JPEG), because Vercel
  refuses a request over 4.5 MB. The limit a person sees stays 5 MB, as the brief says.
- **The public form's extra rules** come from the bot-and-spam audit's spec (`../../research/bot-spam-2026-11-07/FIX-SPEC.md`,
  section 7): a hidden trap field (`website`), at most two web addresses in a message, three a day per typed address.
- **The person's note never repeats what they typed, and goes only to a signed-in person's account address** (the same
  spec): fixed words with "We got it. We answer within one business day." The public form shows those words on the
  screen and sends no email, since anyone can type any address there (please confirm).
