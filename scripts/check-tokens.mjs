// Checks that tokens.css says what tokens.json says: every colour in both themes, the dark values repeated for a
// device set to dark, the light values repeated for print, and the font stacks. Run with `npm run check`.
import fs from "node:fs";

const css = fs.readFileSync(new URL("../tokens.css", import.meta.url), "utf8");
const json = JSON.parse(fs.readFileSync(new URL("../tokens.json", import.meta.url), "utf8"));
const problems = [];

/** The custom properties set in the first block that follows `from`, as a name → value map. */
function block(from, start = 0) {
  const at = css.indexOf(from, start);
  if (at < 0) return problems.push(`tokens.css has no block ${from}`), {};
  const body = css.slice(css.indexOf("{", at) + 1, css.indexOf("}", at));
  return Object.fromEntries(
    body
      .split("\n")
      .map((l) => l.replace(/\/\*.*?\*\//g, "").trim())
      .filter((l) => l.startsWith("--"))
      .map((l) => [l.slice(0, l.indexOf(":")), l.slice(l.indexOf(":") + 1).replace(/;$/, "").trim()]),
  );
}
const same = (what, a, b) => {
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) if (a[k] !== b[k]) problems.push(`${what}: ${k} is ${a[k]} but should be ${b[k]}`);
};

const light = block(':root, [data-theme="light"] {');
const dark = block('[data-theme="dark"] {');
/** A value from tokens.json as tokens.css writes it: a reference such as {sea} becomes var(--sea). */
const asCss = (v) => v.replace(/^\{([a-z-]+)\}$/, "var(--$1)");
const fromJson = (theme) =>
  Object.fromEntries(
    [...json.color.tokens, ...json.shadow.tokens].map((t) => [`--${t.name}`, asCss(typeof t.value === "string" ? t.value : t.value[theme])]),
  );
same("light", light, fromJson("light"));
same("dark", dark, fromJson("dark"));
same("a device set to dark", block(':root:not([data-theme="light"]) {', css.indexOf("prefers-color-scheme: dark")), dark);
same("print", block(":root,", css.indexOf("@media print")), light);
const fonts = block(":root {", css.indexOf("--space-1") - 40);
for (const [name, stack] of Object.entries(json.type.families)) if (fonts[`--font-${name}`] !== stack) problems.push(`font ${name}: ${fonts[`--font-${name}`]} should be ${stack}`);

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("tokens.css matches tokens.json");
