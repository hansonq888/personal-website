import PageShell from "../components/PageShell";
import PageFrame from "../components/PageFrame";
import { experiences } from "../data/experiences";
import { MediaTile } from "../components/Media";
import { INTER, LIGHT, LOGO_BG } from "../data/media";

/* Experience in the shared frame: the giant title holds the left, and the
   roles sit on the right as two columns of wide logo tiles, each with the
   role in bold capitals and its dates set against it. */
export default function Experiences() {
  return (
    <PageShell>
      <PageFrame title="Experience" titleSize="clamp(3rem, 7vw, 7.25rem)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-10">
          {experiences.map((exp) => (
            <article key={exp.org} className="min-w-0">
              <MediaTile href={exp.url} src={exp.image} label={exp.org} bg={LOGO_BG[exp.image]} quiet className="aspect-[16/10]" />
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <h2
                  className="uppercase leading-none"
                  style={{ fontFamily: INTER, fontWeight: 700, letterSpacing: "-0.01em", fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}
                >
                  {exp.role}
                </h2>
                <span className="shrink-0 text-xs text-black/45" style={LIGHT}>
                  {exp.short?.when}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-black/70" style={LIGHT}>
                {exp.org}
              </p>
              {exp.blurb && (
                <p className="mt-2 text-sm leading-relaxed text-black/55" style={LIGHT}>
                  {exp.blurb}
                </p>
              )}
            </article>
          ))}
        </div>
      </PageFrame>
    </PageShell>
  );
}
