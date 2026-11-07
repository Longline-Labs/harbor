# Decisions

Choices made in the Harbor package, in plain English. **please confirm** marks the ones Brandon should look at.

## The app list's wording (0.6.1, November 7, 2026)

- **Harbor takes the website copy review's decisions** (J1 to J3, Brandon: "take all suggestions"): the new family line,
  lowercase association, board, annual budget, and governing documents, and the three rewritten cards, in the same words
  as `@longline/web` 0.5.3.
- **Coifish, ReelMinder, and PacketSkipper keep Harbor's shorter lines** (please confirm). They differ from the website
  cards, but the review flagged nothing in them, and an app can quote them in a sentence: PacketSkipper's Settings says
  "ReelMinder is a separate app from the same family: reminders for every association deadline, from insurance renewals
  to annual meeting notices." The website card ("Tracks every association deadline… and reminds you before each one.")
  would read there too, if Brandon wants one wording everywhere.

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
