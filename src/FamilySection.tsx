import { ExternalLink } from "lucide-react";
import { apps, type AppKey } from "./apps";
import { Mark } from "./Mark";

/**
 * "Apps for Community Association Managers": the three apps, at the bottom of
 * every public home page (site.md, section 9). `current` is the app whose site
 * this is; its card says "You are here".
 */
export function FamilySection({ current, title = "Apps for Community Association Managers" }: { current: AppKey; title?: string }) {
  return (
    <section className="site-container family" aria-labelledby="familyH">
      <h2 id="familyH" className="h-display">
        {title}
      </h2>
      <ul className="family-cards">
        {apps.map((app) => {
          const here = app.key === current;
          const host = app.url ? app.url.replace(/^https?:\/\//, "") : "";
          return (
            <li key={app.key} className="panel family-card">
              <div className="family-name">
                <Mark name={app.key} size={32} />
                <span>{app.name}</span>
              </div>
              <p>{app.description}</p>
              <span className="label family-status">
                {here ? (
                  "You are here"
                ) : app.live && app.url ? (
                  <a href={app.url} target="_blank" rel="noopener">
                    Visit {host}
                    <ExternalLink aria-hidden="true" />
                    <span className="sr"> (opens in a new tab)</span>
                  </a>
                ) : (
                  "Coming soon"
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
