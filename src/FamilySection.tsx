import { apps, type AppKey } from "./apps";
import { Mark } from "./Mark";

/**
 * "Apps for community association managers": the six apps, at the bottom of every public home page (site.md,
 * section 9), as coifish.com has it. The heading is in sentence case, as the websites' own family section has it since
 * @longline/web 0.5.3 (no app uses this one today: the websites use @longline/web's). `current` is the app whose site
 * this is; its card says "You are here". An app whose site is up links to it; one that isn't says "Coming soon".
 * Styles: .family in harbor.css.
 */
export function FamilySection({ current, title = "Apps for community association managers" }: { current: AppKey; title?: string }) {
  return (
    <section aria-labelledby="family" className="site-container family">
      <h2 id="family" className="family-title">
        {title}
      </h2>
      <ul className="family-cards">
        {apps.map((app) => (
          <li key={app.key} className="family-card">
            <div className="family-name">
              <span className={`family-mark${app.live ? "" : " faded"}`}>
                <Mark name={app.key} size={36} />
              </span>
              <span className="family-app-name">{app.name}</span>
            </div>
            <p className="family-line">{app.description}</p>
            <p className="family-status">
              {app.key === current ? (
                <span>You are here</span>
              ) : app.live && app.url ? (
                <a href={app.url}>Visit {app.url.replace(/^https?:\/\//, "")}</a>
              ) : (
                <span>Coming soon</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
