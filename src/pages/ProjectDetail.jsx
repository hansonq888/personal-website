import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { projects, featuredProjects } from "../data/projects";
import PageShell from "../components/PageShell";

const INTER = '"Inter", sans-serif';
const linkStyle = {
  fontFamily: INTER,
  fontWeight: 500,
  fontSize: 9,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  borderBottom: "1px solid rgba(0,0,0,0.25)",
  paddingBottom: 2,
};

const LINKS = [
  ["website", "Live site"],
  ["appStore", "App Store"],
  ["github", "GitHub"],
  ["video", "Demo"],
  ["download", "Download"],
];

function Label({ children }) {
  return <p className="mono-meta tracking-[0.18em] text-[9px] text-black/35 mb-2.5">{children}</p>;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent("");
    if (!project?.journalFile) return;
    fetch(`/journals/${project.journalFile}.md`)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent(""));
  }, [project]);

  if (!project) {
    return (
      <PageShell>
        <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-16 max-w-5xl mx-auto">
          <p className="text-black/60" style={{ fontFamily: INTER, fontWeight: 300 }}>
            Project not found.
          </p>
          <Link to="/projects" className="inline-block mt-6 text-black/70 hover:text-black transition-colors" style={linkStyle}>
            All projects →
          </Link>
        </div>
      </PageShell>
    );
  }

  const links = LINKS.filter(([key]) => project[key]);
  const headline = [project.year, project.type, project.category].filter(Boolean);
  const idx = featuredProjects.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? featuredProjects[idx - 1] : null;
  const next = idx > -1 && idx < featuredProjects.length - 1 ? featuredProjects[idx + 1] : null;

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black px-4 sm:px-8 md:px-12 pt-12 md:pt-16 pb-28 md:pb-40 min-w-0 overflow-x-clip">
        <div className="w-full max-w-5xl mx-auto">
          {/* Masthead — meta above the name, as on the index */}
          {headline.length > 0 && (
            <p className="mono-meta tracking-[0.18em] text-[10px] text-black/40 mb-4">
              {headline.join("  ·  ")}
            </p>
          )}
          <h1
            className="leading-[0.88] tracking-tight"
            style={{ fontFamily: INTER, fontWeight: 700, fontSize: "clamp(2rem, 6vw, 4.25rem)", letterSpacing: "-0.03em" }}
          >
            {project.title}
          </h1>

          {/* Body — one column, with stack and links as a band under the lead */}
          <div className="mt-10 md:mt-14 min-w-0">
            <div className="overflow-hidden bg-[#f4f4f4] aspect-[16/9] max-w-3xl">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-top block"
              />
            </div>

            <p
              className="mt-8 md:mt-10 text-base sm:text-lg leading-relaxed text-black/75 max-w-[62ch]"
              style={{ fontFamily: INTER, fontWeight: 300 }}
            >
              {project.longDescription || project.description}
            </p>

            <div className="mt-10 md:mt-12 flex flex-wrap gap-x-20 gap-y-8">
              <div>
                <Label>Stack</Label>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5 max-w-[46ch]">
                  {project.tech?.map((t, j) => (
                    <span key={t} className="inline-flex items-baseline gap-2">
                      <span className="mono-meta text-[10px] text-black/70 tracking-[0.06em]">{t}</span>
                      {j < project.tech.length - 1 && (
                        <span aria-hidden className="text-[10px] text-black/25">/</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {links.length > 0 && (
                <div>
                  <Label>Links</Label>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {links.map(([key, label]) => (
                      <a
                        key={key}
                        href={project[key]}
                        target="_blank"
                        rel="noreferrer"
                        className="text-black/70 hover:text-black transition-colors"
                        style={linkStyle}
                      >
                        {label} →
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {content && (
              <div className="project-detail-markdown mt-14 md:mt-20 max-w-[68ch]">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
              </div>
            )}

            {project.gallery?.length > 0 && (
              <div className="mt-12 space-y-6 max-w-3xl">
                {project.gallery.map((src) => (
                  <div key={src} className="overflow-hidden bg-[#f4f4f4]">
                    <img src={src} alt="" loading="lazy" className="w-full h-auto block" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Walk to the neighbouring projects */}
          {(prev || next) && (
            <nav className="mt-20 md:mt-32 grid grid-cols-2 gap-6 items-start">
              <div>
                {prev && (
                  <Link to={`/projects/${prev.id}`} className="group block">
                    <p className="mono-meta tracking-[0.18em] text-[9px] text-black/35 mb-2">← Previous</p>
                    <p
                      className="mono-meta text-black/70 group-hover:text-black transition-colors"
                      style={{ fontWeight: 700, fontSize: "clamp(0.85rem, 1.2vw, 1rem)" }}
                    >
                      {prev.title}
                    </p>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {next && (
                  <Link to={`/projects/${next.id}`} className="group block">
                    <p className="mono-meta tracking-[0.18em] text-[9px] text-black/35 mb-2">Next →</p>
                    <p
                      className="mono-meta text-black/70 group-hover:text-black transition-colors"
                      style={{ fontWeight: 700, fontSize: "clamp(0.85rem, 1.2vw, 1rem)" }}
                    >
                      {next.title}
                    </p>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </PageShell>
  );
}
