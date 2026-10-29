import { featuredProjects as displayedProjects } from "../data/projects";
import PageShell from "../components/PageShell";
import PageFrame from "../components/PageFrame";
import { MediaTile } from "../components/Media";
import { INTER, LIGHT, CROP } from "../data/media";

/* Projects in the shared frame: the giant title holds the left while the
   work scrolls past on the right, the newest one wide and the rest in pairs. */
export default function Projects() {
  const [lead, ...rest] = displayedProjects;
  const tile = (p, wide) => (
    <article key={p.id} className={"min-w-0 " + (wide ? "sm:col-span-2" : "")}>
      <MediaTile to={`/projects/${p.id}`} src={p.image} label={p.title} crop={CROP[p.id]} quiet className={wide ? "aspect-[16/9]" : "aspect-[16/10]"} />
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h2
          className="uppercase leading-none"
          style={{ fontFamily: INTER, fontWeight: 700, letterSpacing: "-0.01em", fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}
        >
          {p.title}
        </h2>
        {p.year && (
          <span className="shrink-0 text-xs text-black/45" style={LIGHT}>
            {p.year}
          </span>
        )}
      </div>
    </article>
  );

  return (
    <PageShell>
      <PageFrame title="Projects" titleSize="clamp(3.5rem, 8.5vw, 9rem)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-10">
          {tile(lead, true)}
          {rest.map((p) => tile(p, false))}
        </div>
      </PageFrame>
    </PageShell>
  );
}
