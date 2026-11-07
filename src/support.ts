// Help & support, the parts every app shares that are neither drawing nor network (0.6.0, November 7, 2026): the
// limits, the checks, the subject line and the email the support inbox receives. The form and the dialog are in
// SupportDialog.tsx; each app's own server action saves the message, sends the emails and keeps the rate limit, so
// this file has no network code and no React. Safe to import on the server: `@longline/harbor/support`.

/** How long each part may be, in characters (the screenshot in bytes). The form and the server check the same. */
export const SUPPORT_LIMITS = {
  subject: 150,
  message: 5000,
  name: 100,
  email: 254,
  company: 150,
  page: 300,
  browser: 200,
  reference: 40,
  /** The largest picture a person may choose. */
  screenshotBytes: 5 * 1024 * 1024,
  /**
   * The largest picture the form sends. Vercel refuses a request over 4.5 MB, so a bigger picture is made smaller in
   * the browser first (its longest side at most 2560 pixels, as a JPEG). A screenshot of a whole screen is well under.
   */
  uploadBytes: 3.5 * 1024 * 1024,
} as const;

/** Messages one person may send in an hour (Brandon's brief, November 7, 2026); on the public form, per network. */
export const SUPPORT_PER_HOUR = 5;

/**
 * The public form's other rules, from the bot-and-spam audit's spec for signed-out forms (research/bot-spam-2026-11-07,
 * FIX-SPEC section 7): messages a day to one typed address, and web addresses a message may hold.
 */
export const SUPPORT_PUBLIC_PER_ADDRESS_PER_DAY = 3;
export const SUPPORT_PUBLIC_MAX_LINKS = 2;

/**
 * The public form's hidden trap field. People never see it; a robot filling every box fills it too. The app answers a
 * filled one with the usual thanks and does nothing else.
 */
export const SUPPORT_TRAP_FIELD = "website";

/** The scheduled job leaves a message's emails alone this long, so it never races the request still sending them. */
export const SUPPORT_RETRY_AFTER_MINUTES = 5;

/** The pictures the form takes. Never SVG: it can carry a script. */
export const SUPPORT_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"] as const;
export type SupportImageType = (typeof SUPPORT_IMAGE_TYPES)[number];

/** What the form says once a message is in, word for word in every app. */
export const SUPPORT_THANKS = "We got it. We answer within one business day.";

/**
 * Every support email's subject starts with this, then the app's name and the person's own subject:
 * "[Help & support] AboveBoard: Can't upload a PDF". The support desk (support/CLAUDE.md) finds form messages by it.
 */
export const SUPPORT_SUBJECT_PREFIX = "[Help & support]";

export type SupportField = "subject" | "message" | "screenshot" | "email" | "name" | "company" | "form";

export type SupportSendResult = { ok: true } | { ok: false; error: string; field?: SupportField };

/** The send function an app hands the form: its own server action. FormData keys are listed in components.md. */
export type SupportSend = (data: FormData) => Promise<SupportSendResult>;

// Characters removed from what people type: control characters (except tab and line breaks), the zero-width space, the
// byte-order mark, and the direction overrides and isolates that can make text read differently from what it says.
// The zero-width joiner and non-joiner stay: emoji families and Persian and Indic words need them.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B\u202A-\u202E\u2066-\u2069\uFEFF]/g;

// HTML elements a pasted page or email can carry. Only these, written as real tags, are removed: "<Enter>", "<error>",
// "a<b and c>d" and "count<max" are ordinary writing and stay. The email escapes everything in any case; this keeps
// the saved text readable.
const ELEMENTS =
  "a|abbr|b|blockquote|body|br|button|center|code|div|em|embed|font|form|h[1-6]|head|hr|html|i|iframe|img|input|label|li|link|meta|object|ol|option|p|pre|s|script|select|small|span|strike|strong|style|sub|sup|svg|table|tbody|td|textarea|tfoot|th|thead|title|tr|u|ul|video|audio|source|base|frame|frameset|math";
// A tag: the element, then attributes that each have a value (a bare word, as in "<b and c>", is not taken for one).
const TAG = new RegExp(
  `</?(?:${ELEMENTS})(?:\\s+[a-z][\\w:-]*\\s*=\\s*(?:"[^"<>]*"|'[^'<>]*'|[^\\s"'<>=\`]+))*\\s*/?>`,
  "gi",
);
// What's inside <script> and <style> goes with them.
const SCRIPT_OR_STYLE = /<(script|style)\b[^<>]*>[\s\S]*?<\/\1\s*>/gi;

/**
 * Plain text from what a person typed: HTML tags, comments, scripts and styles removed (real tags only, see TAG),
 * invisible and direction-changing characters removed, Windows line ends made plain, at most one blank line in a row,
 * trimmed. `oneLine` folds it onto one line (a subject, a name). Nothing is cut short here: lengths are checked after,
 * so a person is told rather than truncated. Call it only on input already under twice its limit (checkSupportInput
 * does), so a huge field never reaches it.
 */
export function cleanSupportText(value: unknown, { oneLine = false }: { oneLine?: boolean } = {}): string {
  let text = typeof value === "string" ? value : "";
  text = text
    .replace(/\r\n?/g, "\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<!doctype[^<>]*>/gi, "")
    .replace(SCRIPT_OR_STYLE, "")
    .replace(TAG, "")
    .replace(CONTROL, "");
  text = oneLine ? text.replace(/\s+/g, " ") : text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

// Endings a web address is likely to have. A file name ("minutes.pdf", "budget.xlsx") is not a web address.
const ENDINGS =
  "com|net|org|info|biz|co|io|us|uk|ca|au|de|fr|nl|eu|xyz|top|online|site|shop|store|app|dev|link|click|live|me|ly|to|ru|cn|tk|ml|ga|cf|gq|zip|mov|sbs|cfd|icu|club|vip|win|bid|loan|work|page|tech|website|space|fun|pro|gov|edu";
const BARE_ADDRESS = new RegExp(`\\b[a-z0-9-]+(?:\\.[a-z0-9-]+)*\\.(?:${ENDINGS})\\b(?:/\\S*)?`, "gi");

/** How many web addresses a text holds: https://…, www.…, or a name with a web ending such as evil.com. */
export function countWebAddresses(text: string): number {
  let s = text.normalize("NFKC");
  // Full addresses first (so http://x@evil.com counts), then email addresses out (pat@example.com is not a web address).
  const full = s.match(/\bhttps?:\/\/\S+/gi)?.length ?? 0;
  s = s.replace(/\bhttps?:\/\/\S+/gi, " ").replace(/\S+@\S+/g, " ");
  const www = s.match(/\bwww\.\S+/gi)?.length ?? 0;
  s = s.replace(/\bwww\.\S+/gi, " ");
  return full + www + (s.match(BARE_ADDRESS)?.length ?? 0);
}

/**
 * The address check: plain ASCII, one @, no dots side by side or at either end of the name. Postmark refuses some
 * addresses that looser checks let through, and the support email's Reply-To must be one it takes.
 */
const EMAIL = /^(?!\.)(?!.*\.\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

/**
 * An address as counted for the public form's "three a day" limit: lower case, without a +tag, so pat+1@ and pat+2@
 * count as pat@. (Only for counting; the message keeps the address as typed.)
 */
export function supportAddressKey(email: string): string {
  const [name = "", domain = ""] = email.trim().toLowerCase().split("@");
  return `${name.split("+")[0]}@${domain}`;
}

export type SupportInput = {
  subject: string;
  message: string;
  /** Asked only on the public form, where nobody is signed in. */
  email?: string;
  name?: string;
  company?: string;
  page?: string;
  browser?: string;
  reference?: string;
};

export type SupportChecked = { ok: true; value: Required<Omit<SupportInput, "email" | "name" | "company" | "reference">> & Pick<SupportInput, "email" | "name" | "company" | "reference"> } | { ok: false; error: string; field: SupportField };

/**
 * Cleans and checks a message. `needEmail` on the public form. The error words are the ones the form shows.
 * Page and browser are the form's own notes, so a bad one is dropped, never an error.
 */
export function checkSupportInput(raw: Record<string, unknown>, { needEmail = false }: { needEmail?: boolean } = {}): SupportChecked {
  // Far over the limit is refused before any cleaning, so a huge field can't keep the server busy.
  const tooLong: [SupportField, unknown, number][] = [
    ["subject", raw.subject, SUPPORT_LIMITS.subject],
    ["message", raw.message, SUPPORT_LIMITS.message],
    ["email", raw.email, SUPPORT_LIMITS.email],
    ["name", raw.name, SUPPORT_LIMITS.name],
    ["company", raw.company, SUPPORT_LIMITS.company],
  ];
  for (const [field, value, limit] of tooLong)
    if (typeof value === "string" && value.length > limit * 2) return { ok: false, field, error: `That ${field === "email" ? "email address" : field} is too long.` };
  for (const extra of [raw.page, raw.browser, raw.reference]) if (typeof extra === "string" && extra.length > 1000) return { ok: false, field: "form", error: "Something in the form is too long." };
  const subject = cleanSupportText(raw.subject, { oneLine: true });
  const message = cleanSupportText(raw.message);
  const L = SUPPORT_LIMITS;
  if (!subject) return { ok: false, field: "subject", error: "Give your message a subject." };
  if (subject.length > L.subject) return { ok: false, field: "subject", error: `Keep the subject under ${L.subject} characters.` };
  if (message.length < 2) return { ok: false, field: "message", error: "Write a few words about what you need." };
  if (message.length > L.message) return { ok: false, field: "message", error: `Keep the message under ${L.message.toLocaleString("en-US")} characters.` };
  let email: string | undefined;
  let name: string | undefined;
  let company: string | undefined;
  if (needEmail) {
    email = cleanSupportText(raw.email, { oneLine: true }).toLowerCase();
    if (!email) return { ok: false, field: "email", error: "Give the email address we should answer." };
    if (email.length > L.email || !EMAIL.test(email)) return { ok: false, field: "email", error: "That email address doesn't look right." };
    name = cleanSupportText(raw.name, { oneLine: true }) || undefined;
    if (name && name.length > L.name) return { ok: false, field: "name", error: `Keep your name under ${L.name} characters.` };
    company = cleanSupportText(raw.company, { oneLine: true }) || undefined;
    if (company && company.length > L.company) return { ok: false, field: "company", error: `Keep the company name under ${L.company} characters.` };
    if (countWebAddresses(message) > SUPPORT_PUBLIC_MAX_LINKS)
      return { ok: false, field: "message", error: `Please include at most ${SUPPORT_PUBLIC_MAX_LINKS} web addresses in your message.` };
  }
  return { ok: true, value: { subject, message, email, name, company, page: supportPage(raw.page), browser: cleanSupportText(raw.browser, { oneLine: true }).slice(0, L.browser), reference: supportReference(raw.reference) } };
}

/**
 * The page a message was sent from, as a path within the app ("/documents"), or "" when it isn't one. Never a query
 * string, and a segment that looks like a token (an invitation or private link) becomes "…", so no secret travels.
 */
export function supportPage(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "";
  const path = raw.split(/[?#]/)[0]!;
  const safe = path
    .split("/")
    .map((part) => (/^[\w-]{24,}$/.test(part) ? "…" : part))
    .join("/");
  if (!/^\/[\w\-/.~%…]*$/.test(safe)) return "";
  return safe.slice(0, SUPPORT_LIMITS.page);
}

/** An error page's short reference ("e-4f9a2c"), or "". */
export function supportReference(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  return /^[\w-]{1,40}$/.test(raw) ? raw : "";
}

/** The kind of picture from its first bytes, whatever its name or stated type says; null when it isn't one we take. */
export function supportImageKind(bytes: Uint8Array): { type: SupportImageType; ext: "png" | "jpg" | "webp" | "gif" } | null {
  const b = bytes;
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return { type: "image/png", ext: "png" };
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { type: "image/jpeg", ext: "jpg" };
  if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return { type: "image/webp", ext: "webp" };
  if (b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 && (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61) return { type: "image/gif", ext: "gif" };
  return null;
}

/** "Chrome 142 on Mac", from a browser's user-agent string. Good enough for support, never for deciding anything. */
export function describeBrowser(userAgent: string | null | undefined): string {
  const ua = userAgent ?? "";
  if (!ua) return "";
  const v = (re: RegExp) => re.exec(ua)?.[1];
  const browser =
    (v(/Edg(?:A|iOS)?\/(\d+)/) && `Edge ${v(/Edg(?:A|iOS)?\/(\d+)/)}`) ||
    (v(/OPR\/(\d+)/) && `Opera ${v(/OPR\/(\d+)/)}`) ||
    (v(/(?:Firefox|FxiOS)\/(\d+)/) && `Firefox ${v(/(?:Firefox|FxiOS)\/(\d+)/)}`) ||
    (v(/(?:Chrome|CriOS)\/(\d+)/) && `Chrome ${v(/(?:Chrome|CriOS)\/(\d+)/)}`) ||
    (/Safari\//.test(ua) && v(/Version\/(\d+(?:\.\d+)?)/) && `Safari ${v(/Version\/(\d+(?:\.\d+)?)/)}`) ||
    "A browser";
  const system = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /CrOS/.test(ua)
          ? "ChromeOS"
          : /Mac OS X|Macintosh/.test(ua)
            ? "Mac"
            : /Windows/.test(ua)
              ? "Windows"
              : /Linux/.test(ua)
                ? "Linux"
                : "";
  return system ? `${browser} on ${system}` : browser;
}

/** The subject of the email the support inbox receives. */
export function supportEmailSubject(appName: string, subject: string): string {
  return `${SUPPORT_SUBJECT_PREFIX} ${appName}: ${cleanSupportText(subject, { oneLine: true }).slice(0, SUPPORT_LIMITS.subject)}`;
}

export type SupportEmailFacts = {
  appName: string;
  subject: string;
  message: string;
  /** Who wrote: their email (the reply goes there) and name if known. */
  email: string;
  name?: string | null;
  /** The company's name, and its id in the app's database, when signed in. */
  company?: string | null;
  companyId?: string | null;
  /** The person's role in the company ("Owner"), when known. */
  role?: string | null;
  /** Where the account stands ("Free trial until 2026-12-01"), when the app knows. */
  account?: string | null;
  /** Full address of the page, e.g. https://app.aboveboarddocs.com/documents. */
  page?: string | null;
  browser?: string | null;
  reference?: string | null;
  /** "app" for the dialog in the signed-in app, "help_page" for the public form. */
  source: "app" | "help_page";
  /** The support_messages row, so the desk can find it. */
  messageId: string;
  /** When it was written, ISO. */
  sentAt: string;
  /** The attached picture's name and size, when there is one. */
  screenshot?: { name: string; bytes: number } | null;
};

function bytesLabel(n: number): string {
  return n >= 1024 * 1024 ? `${(n / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * The email the app's support inbox receives, the same in all six apps so the support desk reads one shape: the
 * facts as "Label: value" lines, a blank line, then the message as written. Reply-to is the person (the app sets it).
 */
export function supportEmail(f: SupportEmailFacts): { subject: string; text: string; html: string } {
  const who = f.name ? `${f.name} <${f.email}>` : f.email;
  const facts: [string, string][] = [
    ["From", who],
    ["App", f.appName],
    ["Company", f.company ? (f.companyId ? `${f.company} (${f.companyId})` : f.company) : f.source === "help_page" ? "Not signed in (the public Help page)" : "Unknown"],
    ...(f.role ? ([["Role", f.role]] as [string, string][]) : []),
    ...(f.account ? ([["Account", f.account]] as [string, string][]) : []),
    ["Page", f.page || "Unknown"],
    ["Browser", f.browser || "Unknown"],
    ...(f.reference ? ([["Error reference", f.reference]] as [string, string][]) : []),
    ["Screenshot", f.screenshot ? `attached (${f.screenshot.name}, ${bytesLabel(f.screenshot.bytes)})` : "none"],
    ["Sent", f.sentAt],
    ["Message ID", f.messageId],
  ];
  const lead = "Reply to this email to answer them.";
  const text = [...facts.map(([k, v]) => `${k}: ${v}`), "", f.message, "", "--", lead, `Sent from Help & support in ${f.appName}.`].join("\n");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1b2a33">
<table role="presentation" style="border-collapse:collapse;margin:0 0 14px">${facts
    .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#5b6770;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:2px 0">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
<div style="margin:0 0 14px;padding:12px 14px;border-radius:8px;background:#ede8dd;white-space:pre-wrap">${escapeHtml(f.message)}</div>
<p style="margin:0;color:#5b6770">${escapeHtml(lead)} Sent from Help &amp; support in ${escapeHtml(f.appName)}.</p>
</div>`;
  return { subject: supportEmailSubject(f.appName, f.subject), text, html };
}

/**
 * The words of the note the person receives (each app puts them in its own email frame). Sent only for a message from
 * the signed-in app, to the account's own confirmed address: the public form says thanks on the screen and sends no
 * email, since anyone can type any address there (the bot-and-spam spec, section 7). It never repeats what they wrote.
 */
export function supportReceipt(appName: string, supportAddress: string): { subject: string; paragraphs: string[] } {
  return {
    subject: `We got your message to ${appName}`,
    paragraphs: [
      `Thank you for writing to ${appName}. ${SUPPORT_THANKS}`,
      `If you think of something to add, reply to this email or write to ${supportAddress}.`,
      `If you didn't write to us, you can ignore this email.`,
    ],
  };
}
