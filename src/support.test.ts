// Checks for the shared Help & support rules (npm test). Run by Node's own test runner; no network, no React.
import assert from "node:assert/strict";
import { test } from "node:test";
import { SUPPORT_LIMITS, checkSupportInput, countWebAddresses, cleanSupportText, describeBrowser, supportEmail, supportEmailSubject, supportImageKind, supportPage, supportReceipt, supportReference } from "./support.ts";

test("HTML, comments and invisible characters are removed; line ends and blank lines tidied", () => {
  assert.equal(cleanSupportText("<b>Hi</b> there<script>alert(1)</script>"), "Hi therealert(1)");
  assert.equal(cleanSupportText("a<!-- hidden -->b"), "ab");
  assert.equal(cleanSupportText("one\r\n\r\n\r\n\r\ntwo  \nthree"), "one\n\ntwo\nthree");
  assert.equal(cleanSupportText("a‮b​c\u0007d"), "abcd");
  assert.equal(cleanSupportText("  line\none \t two ", { oneLine: true }), "line one two");
  assert.equal(cleanSupportText("<img src=x onerror=alert(1)"), "");
  assert.equal(cleanSupportText("3 < 5 and 7 > 2"), "3 < 5 and 7 > 2");
  assert.equal(cleanSupportText("if x<y then the total<budget"), "if x<y then the total<budget");
  assert.equal(cleanSupportText("<!DOCTYPE html><p class='a'>Hi</p><br/>"), "Hi");
  assert.equal(cleanSupportText(undefined), "");
});

test("a message needs a subject and a few words, within the limits", () => {
  assert.deepEqual(checkSupportInput({ subject: "", message: "Hello there" }), { ok: false, field: "subject", error: "Give your message a subject." });
  assert.equal(checkSupportInput({ subject: "x".repeat(SUPPORT_LIMITS.subject + 1), message: "Hello" }).ok, false);
  assert.equal((checkSupportInput({ subject: "Hi", message: "" }) as { field: string }).field, "message");
  assert.equal((checkSupportInput({ subject: "Hi", message: "x".repeat(SUPPORT_LIMITS.message + 1) }) as { field: string }).field, "message");
  const ok = checkSupportInput({ subject: " <i>Upload</i>  fails ", message: "It says <b>error</b>.", page: "/documents?x=1", browser: "Safari 18 on Mac" });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.value.subject, "Upload fails");
    assert.equal(ok.value.message, "It says error.");
    assert.equal(ok.value.page, "/documents");
    assert.equal(ok.value.email, undefined);
  }
});

test("the public form needs a good email address; name and company are optional", () => {
  assert.equal((checkSupportInput({ subject: "Hi", message: "Hello" }, { needEmail: true }) as { field: string }).field, "email");
  assert.equal((checkSupportInput({ subject: "Hi", message: "Hello", email: "not an address" }, { needEmail: true }) as { field: string }).field, "email");
  assert.equal((checkSupportInput({ subject: "Hi", message: "Hello", email: "a@b.co", name: "n".repeat(101) }, { needEmail: true }) as { field: string }).field, "name");
  const ok = checkSupportInput({ subject: "Hi", message: "Hello", email: " Pat@Example.com ", name: "" }, { needEmail: true });
  assert.ok(ok.ok && ok.value.email === "pat@example.com" && ok.value.name === undefined);
});

test("web addresses are counted, and the public form takes at most two", () => {
  assert.equal(countWebAddresses("See https://a.example/x and www.b.example and evil.com/offer"), 3);
  assert.equal(countWebAddresses("Write to pat@example.com about 3.5 MB files"), 0);
  assert.equal(countWebAddresses("app.aboveboarddocs.com/harbor-view"), 1);
  assert.equal((checkSupportInput({ subject: "Hi", message: "a.com b.com c.com", email: "x@y.co" }, { needEmail: true }) as { field: string }).field, "message");
  assert.equal(checkSupportInput({ subject: "Hi", message: "a.com b.com", email: "x@y.co" }, { needEmail: true }).ok, true);
  // Signed in, the person is known; links in a bug report are fine.
  assert.equal(checkSupportInput({ subject: "Hi", message: "a.com b.com c.com" }).ok, true);
});

test("the page is a path inside the app, with no query and no tokens", () => {
  assert.equal(supportPage("/documents"), "/documents");
  assert.equal(supportPage("/invite/abcdefghijklmnopqrstuvwxyz0123"), "/invite/…");
  assert.equal(supportPage("/a?token=secret#x"), "/a");
  assert.equal(supportPage("https://evil.example/"), "");
  assert.equal(supportPage("//evil.example/"), "");
  assert.equal(supportPage("/<script>"), "");
  assert.equal(supportReference("e-4f9a2c"), "e-4f9a2c");
  assert.equal(supportReference("bad ref!"), "");
});

test("pictures are known by their first bytes, never by their name", () => {
  assert.deepEqual(supportImageKind(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0])), { type: "image/png", ext: "png" });
  assert.deepEqual(supportImageKind(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), { type: "image/jpeg", ext: "jpg" });
  assert.deepEqual(supportImageKind(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])), { type: "image/webp", ext: "webp" });
  assert.deepEqual(supportImageKind(new TextEncoder().encode("GIF89a....")), { type: "image/gif", ext: "gif" });
  assert.equal(supportImageKind(new TextEncoder().encode("<svg xmlns=")), null);
  assert.equal(supportImageKind(new TextEncoder().encode("%PDF-1.7")), null);
});

test("the browser in a few words", () => {
  const mac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15";
  const chrome = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";
  const edge = chrome + " Edg/142.0.0.0";
  const iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0 Mobile/15E148 Safari/604.1";
  assert.equal(describeBrowser(mac), "Safari 18.2 on Mac");
  assert.equal(describeBrowser(chrome), "Chrome 142 on Windows");
  assert.equal(describeBrowser(edge), "Edge 142 on Windows");
  assert.equal(describeBrowser(iphone), "Chrome 142 on iPhone");
  assert.equal(describeBrowser(""), "");
});

test("the support inbox email has every fact as a line, then the message, and escapes HTML", () => {
  const mail = supportEmail({
    appName: "AboveBoard",
    subject: "Upload fails",
    message: "It says <error>.",
    email: "pat@example.com",
    name: "Pat Lee",
    company: "Harbor View Management",
    companyId: "c-1",
    page: "https://app.aboveboarddocs.com/documents",
    browser: "Safari 18 on Mac",
    source: "app",
    messageId: "m-1",
    sentAt: "2026-11-07T15:00:00.000Z",
    screenshot: { name: "screenshot.png", bytes: 420_000 },
  });
  assert.equal(mail.subject, "[Help & support] AboveBoard: Upload fails");
  assert.match(mail.text, /^From: Pat Lee <pat@example.com>\nApp: AboveBoard\nCompany: Harbor View Management \(c-1\)\nPage: https:\/\/app.aboveboarddocs.com\/documents\nBrowser: Safari 18 on Mac\nScreenshot: attached \(screenshot.png, 410 KB\)\nSent: 2026-11-07T15:00:00.000Z\nMessage ID: m-1\n\nIt says <error>.\n/);
  assert.ok(mail.html.includes("It says &lt;error&gt;."));
  assert.ok(!mail.html.includes("<error>"));
  assert.equal(supportEmailSubject("Coifish", "a\nb"), "[Help & support] Coifish: a b");
  const pub = supportEmail({ appName: "ShipShape", subject: "Q", message: "M", email: "x@y.co", source: "help_page", messageId: "m", sentAt: "t" });
  assert.match(pub.text, /Company: Not signed in \(the public Help page\)/);
});

test("the note to the person never repeats what they wrote", () => {
  const r = supportReceipt("BallastBook", "support@ballastbook.com");
  assert.equal(r.subject, "We got your message to BallastBook");
  assert.ok(r.paragraphs[0]!.includes("We got it. We answer within one business day."));
});
