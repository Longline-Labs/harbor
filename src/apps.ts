import family from "../apps.json";

export type AppKey = "coifish" | "reelminder" | "packetskipper";

export interface HarborApp {
  key: AppKey;
  name: string;
  /** The app's public address, or null until it has one. */
  url: string | null;
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
/** The three apps, in the fixed order the Dock and the family section show them. */
export const apps: readonly HarborApp[] = family.apps as HarborApp[];

export function appByKey(key: AppKey): HarborApp {
  const a = apps.find((x) => x.key === key);
  if (!a) throw new Error(`Harbor: no app named ${key}`);
  return a;
}
