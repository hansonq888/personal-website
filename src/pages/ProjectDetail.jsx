import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { projects, featuredProjects } from "../data/projects";
import PageShell from "../components/PageShell";
import PageFrame from "../components/PageFrame";
import { Label, MediaTile } from "../components/Media";
import { INTER, LIGHT } from "../data/media";

const LINKS = [
  ["website", "Live site"],
  ["appStore", "App Store"],
  ["github", "GitHub"],
  ["video", "Demo"],
  ["download", "Download"],
];

/* One project, in the front page's voice: the pictures do the talking on the
   left, a narrow column of facts sits on the right, and the long write-up
   waits underneath for anyone who wants it. */
export default function ProjectDetail() {
  const { id } = useParams();
  const { state } = useLocation();
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
        <div className="px-3 sm:px-4 pt-4">
          <p className="text-sm text-black/60" style={LIGHT}>Project not found.</p>
          <Link to="/projects" className="inline-block mt-4 text-sm underline underline-offset-2" style={LIGHT}>
            All projects
          </Link>
        </div>
      </PageShell>
    );
  }

  const links = LINKS.filter(([key]) => project[key]);
  const media = [project.image, ...(project.gallery || [])];

  // the next few projects in order, wrapping round, so every page ends on more work
  const idx = featuredProjects.findIndex((p) => p.id === project.id);
  const others = featuredProjects.filter((p) => p.id !== project.id);
  const start = idx > -1 ? idx : 0;
  const more = [...others.slice(start), ...others.slice(0, start)].slice(0, 4);

  return (
    <PageShell>
      <PageFrame
        title={project.title}
        titleSize="clamp(2.75rem, 5.2vw, 5.75rem)"
        aside={
          <>
            <p className="text-[15px] leading-relaxed text-black/75 max-w-[48ch]" style={LIGHT}>
              {project.longDescription || project.description}
            </p>

            {project.tech?.length > 0 && (
              <div className="mt-8 max-w-[48ch]">
                <Label fit>Stack</Label>
                <p className="text-sm leading-relaxed text-black/75" style={LIGHT}>
                  {project.tech.join(", ")}
                </p>
              </div>
            )}

            {links.length > 0 && (
              <div className="mt-8 max-w-[48ch]">
                <Label fit>Links</Label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {links.map(([key, label]) => (
                    <a
                      key={key}
                      href={project[key]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline underline-offset-2 hover:opacity-60 transition-opacity"
                      style={LIGHT}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        }
      >
        {/* Pictures */}
        <div className="flex flex-col gap-1.5">
          {media.map((src) => (
            <div key={src} className="overflow-hidden rounded-lg bg-[#f4f4f4]">
              <img src={src} alt={project.title} className="w-full h-auto block" />
            </div>
          ))}
        </div>

        {/* The write-up, for anyone still reading */}
        {content && (
          <div className="mt-14">
            <Label>Notes</Label>
            <div className="project-detail-markdown mt-4 max-w-[68ch]">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* More work */}
        {more.length > 0 && (
          <div className="mt-14">
            <Label to="/projects">More projects</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {more.map((p) => (
                <MediaTile key={p.id} to={`/projects/${p.id}`} state={state} src={p.image} label={p.title} className="aspect-[4/3]" />
              ))}
            </div>
          </div>
        )}
      </PageFrame>
    </PageShell>
  );
}
