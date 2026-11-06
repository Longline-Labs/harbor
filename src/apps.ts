import family from "../apps.json";

/** The six apps, in longline order. ShipShape's key is its domain, shipshapefiles, as its mark files are named. */
export type AppKey = "coifish" | "reelminder" | "packetskipper" | "ballastbook" | "shipshapefiles" | "aboveboard";

export interface HarborApp {
  key: AppKey;
  name: string;
  /** The app's public address, or null until it has one. */
  url: string | null;
  /** Where the signed-in app lives (app.coifish.com; packetskipper.com is both site and app), or null where there is none. */
  appUrl: string | null;
  /**
   * True once the app's site is up: the Dock and the family section link to it (as coifish.com does, October 25,
   * 2026). Until then its mark is faded with "Coming soon". Whether sign-ups are open is each app's own setting.
   */
  live: boolean;
  description: string;
}

/** The company that owns the apps, as it should be written. */
export const company: string = family.company;
/** One line under the family heading, where a site uses it. */
export const familyLine: string = family.familyLine;
/** The six apps, in the fixed order the Dock and the family section show them. */
export const apps: readonly HarborApp[] = family.apps as HarborApp[];

/** The apps a signed-in person uses, as keys: their grants at account.longlinelabs.com, read by the app's own server. */
export type AppsInUse = readonly AppKey[];

/**
 * The person's apps when the list has something to show: at least one app besides the one they are in. A person who
 * uses only this app, nobody signed in, or a list that couldn't be read (null or undefined): null, and the Dock shows
 * the other apps exactly as it always has.
 */
export function appsToMark(inUse: AppsInUse | null | undefined, current: AppKey): ReadonlySet<AppKey> | null {
  if (!inUse) return null;
  const known = new Set(inUse.filter((k) => apps.some((a) => a.key === k)));
  return [...known].some((k) => k !== current) ? known : null;
}

/** Where one of the person's own apps leads: the signed-in app where it has an address, else its site. */
export const ownAppHref = (app: HarborApp): string | null => app.appUrl ?? app.url;

export function appByKey(key: AppKey): HarborApp {
  const a = apps.find((x) => x.key === key);
  if (!a) throw new Error(`Harbor: no app named ${key}`);
  return a;
}
