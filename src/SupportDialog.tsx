"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { appByKey, type AppKey } from "./apps";
import { SUPPORT_IMAGE_TYPES, SUPPORT_LIMITS, SUPPORT_THANKS, SUPPORT_TRAP_FIELD, describeBrowser, supportPage, type SupportField, type SupportSend } from "./support";

/**
 * Help & support (0.6.0, November 7, 2026): one form for a question or a problem, in every app. Signed in, it opens as
 * a dialog from "Help & support" in the app's bar (SupportProvider in the signed-in layout, SupportButton wherever the
 * app wants the entry; Harbor keeps the account out of the Dock). Signed out, the public Help page shows the same
 * form in the page (SupportForm with `who` null), which then asks for an email address. The form calls the app's own
 * `send` (a server action), so nothing here talks to a network. Styles: .support-* in harbor.css.
 */

export type SupportWho = {
  /** The person's company, as the app knows it. */
  company?: string | null;
  /** The address the answer goes to. */
  email: string;
};

export type SupportSuggestion = { title: string; href: string };

type FormProps = {
  /** This app. Its name is said in the form ("Sent with it: AboveBoard, ..."). */
  app: AppKey;
  /** The app's server action: saves the message, emails the support inbox and the person. */
  send: SupportSend;
  /** Shown when sending fails outright (no connection): the app's support address. */
  supportEmail: string;
  /** Signed in: who it's from. Null on the public form, which then asks for an email address. */
  who: SupportWho | null;
  /** Help sections that seem to answer what is being typed (Coifish's suggestHelp). Pure, no network. */
  suggest?: (text: string) => SupportSuggestion[];
  /** Something to send along: the reference an error page showed. */
  reference?: string;
  /** Rendered just above the buttons, inside the form: the public form's bot check. Its inputs are sent too. */
  extra?: ReactNode;
  /** Changes after every attempt, so a one-use bot check can start over. */
  onAttempt?: () => void;
  /** Called once the message is in. */
  onSent?: () => void;
  /** Shows Cancel, and Close once sent (the dialog). Without it, the form offers "Send another message" instead. */
  onClose?: (why: "sent" | "cancel") => void;
  /** Starts the subject with something, as "Contact us" links from an error page do. */
  defaultSubject?: string;
  /** Put the cursor in the first field when the form appears (the dialog). */
  autoFocus?: boolean;
  /** Changes each time the dialog opens, so the page and browser shown are read afresh. */
  refreshKey?: unknown;
};

type Shot = { file: File; url: string };

/** The browser and the window, in a few words: "Safari 18 on Mac, window 1440 × 900". */
function browserNow(): string {
  if (typeof window === "undefined") return "";
  const name = describeBrowser(navigator.userAgent);
  return `${name}, window ${window.innerWidth} × ${window.innerHeight}`.slice(0, SUPPORT_LIMITS.browser);
}

/** A picture over the upload limit made smaller in the browser: longest side 2560 (then 1920), as a JPEG. */
async function shrink(file: File): Promise<File> {
  if (file.size <= SUPPORT_LIMITS.uploadBytes) return file;
  const bitmap = await createImageBitmap(file);
  try {
    for (const longest of [2560, 1920, 1280]) {
      const scale = Math.min(1, longest / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/jpeg", 0.86));
      if (blob && blob.size <= SUPPORT_LIMITS.uploadBytes) return new File([blob], file.name.replace(/\.[^.]*$/, "") + ".jpg", { type: "image/jpeg" });
    }
  } finally {
    bitmap.close();
  }
  throw new Error("too big");
}

const sizeLabel = (n: number) => (n >= 1024 * 1024 ? `${(n / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/** The form itself: subject, message, an optional screenshot, the line saying what goes with it, and Send. */
export function SupportForm({ app, send, supportEmail, who, suggest, reference, extra, onAttempt, onSent, onClose, defaultSubject = "", autoFocus = false, refreshKey }: FormProps) {
  const appName = appByKey(app)?.name ?? app;
  const ids = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [shot, setShot] = useState<Shot | null>(null);
  const [error, setError] = useState<{ text: string; field?: SupportField } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [page, setPage] = useState("");
  const [browser, setBrowser] = useState("");

  // Read in the browser (the server never sees the window), and again each time the dialog opens: the dialog stays
  // on the page while a person moves around the app.
  useEffect(() => {
    setPage(supportPage(window.location.pathname));
    setBrowser(browserNow());
  }, [refreshKey]);
  useEffect(() => () => void (shot && URL.revokeObjectURL(shot.url)), [shot]);

  const choose = (file: File | null | undefined) => {
    setError(null);
    if (!file) return;
    if (!(SUPPORT_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setError({ field: "screenshot", text: "Choose a picture: a PNG, JPEG, WebP or GIF file." });
      return;
    }
    if (file.size > SUPPORT_LIMITS.screenshotBytes) {
      setError({ field: "screenshot", text: `That picture is ${sizeLabel(file.size)}. Choose one of 5 MB or less.` });
      return;
    }
    setShot({ file, url: URL.createObjectURL(file) });
  };
  const removeShot = () => {
    setShot(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const suggestions = suggest && message.trim().length >= 12 ? suggest(message).slice(0, 3) : [];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setError(null);
    const data = new FormData(e.currentTarget);
    data.delete("screenshot_file");
    // Where they are now, which is what the line above the button says.
    const here = supportPage(window.location.pathname);
    const now = browserNow();
    setPage(here);
    setBrowser(now);
    data.set("page", here);
    data.set("browser", now);
    if (reference) data.set("reference", reference);
    setSending(true);
    try {
      if (shot) {
        try {
          data.set("screenshot", await shrink(shot.file));
        } catch {
          setError({ field: "screenshot", text: "That picture couldn't be made small enough to send. Try a smaller screenshot." });
          return;
        }
      }
      const result = await send(data);
      if (result.ok) {
        setSent(true);
        onSent?.();
        setSubject("");
        setMessage("");
        removeShot();
      } else setError({ text: result.error, field: result.field });
    } catch {
      setError({ text: `Your message couldn't be sent. Check your internet connection and try again, or write to ${supportEmail}.` });
    } finally {
      setSending(false);
      onAttempt?.();
    }
  }

  if (sent)
    return (
      <div className="support-sent" role="status">
        <p className="support-sent-line">{SUPPORT_THANKS}</p>
        <div className="support-actions">
          {onClose ? (
            <button type="button" className="support-btn primary" onClick={() => onClose("sent")} autoFocus>
              Close
            </button>
          ) : (
            <button type="button" className="support-btn" onClick={() => setSent(false)}>
              Send another message
            </button>
          )}
        </div>
      </div>
    );

  const fieldError = (field: SupportField) => (error?.field === field ? error.text : null);
  const describe = (field: SupportField, help?: string) => [help, error?.field === field ? `${ids}-${field}-error` : null].filter(Boolean).join(" ") || undefined;
  const along = [appName, who?.company, who ? who.email : email.trim() || null, page ? `the page you're on (${page})` : "the page you're on", browser ? `your browser (${browser})` : "your browser"].filter(Boolean) as string[];

  return (
    <form
      className="support-form"
      onSubmit={submit}
      noValidate
      onPaste={(e) => {
        // A screenshot pasted anywhere in the form is taken as the picture.
        const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
        if (file) {
          e.preventDefault();
          choose(file);
        }
      }}
    >
      {!who && (
        // The trap: hidden from people (and from screen readers and the keyboard); a robot fills it in.
        <div className="support-trap" aria-hidden="true">
          <label>
            Leave this empty
            <input name={SUPPORT_TRAP_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
      )}
      {!who && (
        <div className="support-row">
          <div className="support-field">
            <label htmlFor={`${ids}-email`} className="support-label">
              Your email
            </label>
            <input
              id={`${ids}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={SUPPORT_LIMITS.email}
              className="support-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error?.field === "email" || undefined}
              aria-describedby={describe("email")}
            />
            {fieldError("email") && (
              <p id={`${ids}-email-error`} className="support-error">
                {fieldError("email")}
              </p>
            )}
          </div>
          <div className="support-field">
            <label htmlFor={`${ids}-name`} className="support-label">
              Your name (optional)
            </label>
            <input id={`${ids}-name`} name="name" autoComplete="name" maxLength={SUPPORT_LIMITS.name} className="support-input" aria-invalid={error?.field === "name" || undefined} aria-describedby={describe("name")} />
            {fieldError("name") && (
              <p id={`${ids}-name-error`} className="support-error">
                {fieldError("name")}
              </p>
            )}
          </div>
          <div className="support-field">
            <label htmlFor={`${ids}-company`} className="support-label">
              Company (optional)
            </label>
            <input id={`${ids}-company`} name="company" autoComplete="organization" maxLength={SUPPORT_LIMITS.company} className="support-input" aria-invalid={error?.field === "company" || undefined} aria-describedby={describe("company")} />
            {fieldError("company") && (
              <p id={`${ids}-company-error`} className="support-error">
                {fieldError("company")}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="support-field">
        <label htmlFor={`${ids}-subject`} className="support-label">
          Subject
        </label>
        <input
          id={`${ids}-subject`}
          name="subject"
          required
          maxLength={SUPPORT_LIMITS.subject}
          className="support-input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-invalid={error?.field === "subject" || undefined}
          aria-describedby={describe("subject")}
        />
        {fieldError("subject") && (
          <p id={`${ids}-subject-error`} className="support-error">
            {fieldError("subject")}
          </p>
        )}
      </div>

      <div className="support-field">
        <label htmlFor={`${ids}-message`} className="support-label">
          Message
        </label>
        <textarea
          id={`${ids}-message`}
          name="message"
          required
          rows={6}
          maxLength={SUPPORT_LIMITS.message}
          className="support-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={error?.field === "message" || undefined}
          aria-describedby={describe("message", `${ids}-message-help`)}
        />
        <p id={`${ids}-message-help`} className="support-help">
          What were you doing, and what happened? A question is fine too.
        </p>
        {fieldError("message") && (
          <p id={`${ids}-message-error`} className="support-error">
            {fieldError("message")}
          </p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="support-suggest" aria-live="polite">
          <p>{suggestions.length === 1 ? "This part of Help may already answer it:" : "These parts of Help may already answer it:"}</p>
          <ul>
            {suggestions.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="support-field">
        <span className="support-label" id={`${ids}-shot-label`}>
          Screenshot (optional)
        </span>
        {shot ? (
          <div className="support-shot">
            {/* A preview of the person's own picture, from their own computer. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot.url} alt="" className="support-shot-img" />
            <span className="support-shot-name">
              {shot.file.name || "Pasted picture"} <span className="support-shot-size">{sizeLabel(shot.file.size)}</span>
            </span>
            <button type="button" className="support-btn quiet sm" onClick={removeShot}>
              Remove
            </button>
          </div>
        ) : (
          <div className="support-pick">
            <input
              ref={fileInput}
              id={`${ids}-shot`}
              name="screenshot_file"
              type="file"
              accept={SUPPORT_IMAGE_TYPES.join(",")}
              className="support-file"
              aria-labelledby={`${ids}-shot-label`}
              aria-describedby={describe("screenshot", `${ids}-shot-help`)}
              onChange={(e) => choose(e.target.files?.[0])}
            />
            <label htmlFor={`${ids}-shot`} className="support-btn sm">
              Choose a picture
            </label>
            <span id={`${ids}-shot-help`} className="support-help">
              One picture, up to 5 MB. You can also paste a screenshot here.
            </span>
          </div>
        )}
        {fieldError("screenshot") && (
          <p id={`${ids}-screenshot-error`} className="support-error">
            {fieldError("screenshot")}
          </p>
        )}
      </div>

      {extra}

      <p className="support-along">Sent with your message: {along.join(", ")}.</p>

      {error && (!error.field || error.field === "form") && (
        <p className="support-error support-error-form" role="alert">
          {error.text}
        </p>
      )}
      {error?.field && error.field !== "form" && (
        <p className="sr" role="alert">
          {error.text}
        </p>
      )}

      <div className="support-actions">
        <button type="submit" className="support-btn primary" disabled={sending}>
          {sending ? "Sending…" : "Send message"}
        </button>
        {onClose && (
          <button type="button" className="support-btn quiet" onClick={() => onClose("cancel")}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

type DialogProps = Omit<FormProps, "onClose" | "onSent" | "autoFocus" | "who" | "refreshKey"> & {
  who: SupportWho;
  open: boolean;
  onClose: () => void;
  /** The app's Help page, linked from the dialog's first line. */
  helpHref?: string;
};

/**
 * The form in a dialog. A native <dialog>, so focus stays inside, Escape closes it and the page behind is inert. What
 * was typed stays if it is closed before sending; it starts empty again after a message is sent.
 */
export function SupportDialog({ open, onClose, helpHref = "/help", ...form }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [round, setRound] = useState(0);
  const [opens, setOpens] = useState(0);
  const sent = useRef(false);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setOpens((n) => n + 1);
      d.showModal();
      // The first field rather than the Close button, so a person can start typing at once.
      d.querySelector<HTMLElement>(".support-form input:not([type=file]), .support-form textarea, .support-sent button")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);
  const close = () => {
    // After a message is sent the form starts empty next time; a draft closed unsent stays as it was.
    if (sent.current) {
      sent.current = false;
      setRound((n) => n + 1);
    }
    onClose();
  };
  return (
    <dialog
      ref={ref}
      className="support-dialog"
      aria-labelledby={titleId}
      onClose={close}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself, outside its panel) closes it.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="support-panel">
        <div className="support-head">
          <h2 id={titleId} className="support-title">
            Help &amp; support
          </h2>
          <button type="button" aria-label="Close" className="support-close" onClick={close}>
            <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <p className="support-intro">
          Ask a question or tell us what went wrong. Many answers are already on the <a href={helpHref}>Help page</a>.
        </p>
        <SupportForm key={round} {...form} refreshKey={opens} onSent={() => (sent.current = true)} onClose={close} />
      </div>
    </dialog>
  );
}

type Ctx = { open: (options?: { subject?: string; reference?: string }) => void };
const SupportContext = createContext<Ctx | null>(null);

type ProviderProps = Omit<DialogProps, "open" | "onClose" | "defaultSubject" | "reference"> & { children: ReactNode };

/**
 * Holds the one Help & support dialog for the signed-in app. Put it in the signed-in layout around the bar and the
 * page; then SupportButton (in the bar, in the phone menu) or useSupport().open() anywhere opens it. The dialog lives
 * here rather than in the button, so closing a phone menu never takes the dialog with it.
 */
export function SupportProvider({ children, ...dialog }: ProviderProps) {
  const [state, setState] = useState<{ open: boolean; subject?: string; reference?: string; n: number }>({ open: false, n: 0 });
  const open = useCallback((options?: { subject?: string; reference?: string }) => setState((s) => ({ open: true, subject: options?.subject, reference: options?.reference, n: options ? s.n + 1 : s.n })), []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <SupportContext.Provider value={value}>
      {children}
      <SupportDialog
        key={state.n}
        {...dialog}
        open={state.open}
        defaultSubject={state.subject}
        reference={state.reference}
        onClose={() => setState((s) => ({ ...s, open: false }))}
      />
    </SupportContext.Provider>
  );
}

/** Opens Help & support from anywhere under SupportProvider. */
export function useSupport(): Ctx {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error("useSupport needs a SupportProvider around it (in the signed-in layout).");
  return ctx;
}

/**
 * The entry: a button reading "Help & support" that opens the dialog. Styled by the app (`className`) to sit with the
 * app's other bar buttons, beside Sign out, and again in the phone menu. Needs SupportProvider.
 */
export function SupportButton({ className, children = "Help & support", onOpen }: { className?: string; children?: ReactNode; onOpen?: () => void }) {
  const { open } = useSupport();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => {
        onOpen?.();
        open();
      }}
    >
      {children}
    </button>
  );
}
