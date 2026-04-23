import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projects } from "../data/projects";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import PageShell from "../components/PageShell";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (project?.journalFile) {
      fetch(`/journals/${project.journalFile}.md`)
        .then((res) => res.text())
        .then(setContent)
        .catch(() => setContent("Error loading journal"));
    }
  }, [project]);

  if (!project) {
    return (
      <PageShell>
        <div className="min-h-screen bg-white text-black p-3 sm:p-4 md:p-6 max-w-3xl mx-auto w-full min-w-0 px-3">
          <p className="text-black/80">Project not found.</p>
        </div>
      </PageShell>
    );
  }

  const hasVideo = (project.id === "priority-email-labeler" || project.id === "live-chord-detector") && project.video;
  const hasLinks =
    (project.website && (project.id === "macroboard" || project.id === "realtor-website" || project.id === "sample8" || project.id === "dealsignal-ai")) ||
    (project.id === "live-chord-detector" && (project.download || project.video));

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black p-4 md:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="jersey-25-heading text-3xl md:text-4xl font-bold text-black">
            {project.title}
          </h1>
          <p className="text-sm text-black/70 mt-1" style={{ backgroundColor: "#BAE6FD", padding: "4px 6px", width: "fit-content" }}>
            Project
          </p>
        </div>

        {/* Media */}
        <div className="rounded-xl sm:rounded-2xl border border-black/10 overflow-hidden shadow-md min-w-0">
          {hasVideo ? (
            <>
              <a
                href={project.video}
                target="_blank"
                rel="noreferrer"
                className="relative block aspect-video overflow-hidden group"
              >
                <img
                  src={project.image}
                  alt={`${project.title} demo`}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <span className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-black/20">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </a>
              <p className="text-black/70 text-xs md:text-sm px-4 py-2 border-t border-black/10 bg-white/80">
                Click to watch demo video
              </p>
              {project.id === "priority-email-labeler" && (
                <div className="border-t border-black/10 p-2 bg-white/50">
                  <img
                    src="/priorityEmailSS.png"
                    alt="Priority Email Labeler"
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto max-h-[28rem] object-contain block"
              />
              {project.id === "realtor-website" && (
                <div className="border-t border-black/10 p-2 bg-white/50">
                  <img
                    src="/realtorAdminSS.png"
                    alt="Realtor admin"
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Description + tech + status */}
        <div className="rounded-2xl border border-black/10 p-4 md:p-5 space-y-4 bg-white shadow-md">
          <p className="text-black/90 text-sm md:text-base leading-relaxed">
            {project.description}
          </p>
          {project.status === "not-deployed" && (
            <div className="flex items-start gap-2 border border-amber-400/50 bg-amber-50 p-3 rounded-lg">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z" clipRule="evenodd" />
              </svg>
              <p className="text-amber-900 text-sm">
                This project is not yet deployed.
              </p>
            </div>
          )}
          <div>
            <span className="jersey-25-heading text-black text-xs md:text-sm font-bold tracking-wide">Tech: </span>
            <span className="text-black/80 text-sm md:text-base">{project.tech.join(", ")}</span>
          </div>
        </div>

        {/* Actions */}
        {hasLinks && (
          <div className="flex flex-wrap gap-2">
            {project.website && (project.id === "macroboard" || project.id === "realtor-website" || project.id === "sample8" || project.id === "dealsignal-ai") && (
              <a href={project.website} target="_blank" rel="noreferrer" className="text-sm font-medium border border-black/15 px-4 py-2.5 text-black rounded-xl hover:bg-black hover:text-white transition-colors">
                Visit live site
              </a>
            )}
            {project.id === "live-chord-detector" && project.download && (
              <a href={project.download} download className="text-sm font-medium border border-black/15 px-4 py-2.5 text-black rounded-xl hover:bg-black hover:text-white transition-colors">
                Download
              </a>
            )}
            {project.id === "live-chord-detector" && project.video && (
              <a href={project.video} target="_blank" rel="noreferrer" className="text-sm font-medium border border-black/15 px-4 py-2.5 text-black rounded-xl hover:bg-black hover:text-white transition-colors">
                Watch demo
              </a>
            )}
          </div>
        )}

        {/* Journal / long-form content */}
        {content && (
          <div className="rounded-2xl border border-black/10 p-4 md:p-5 bg-white shadow-md">
            <div className="project-detail-markdown text-black/90 text-sm md:text-base leading-relaxed prose prose-neutral max-w-none">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* GitHub */}
        {project.github && project.id !== "spam-email-detector" && (
          <div className="rounded-2xl border border-black/10 p-4 md:p-5 bg-white shadow-md">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="text-black/90 text-sm font-medium hover:text-black inline-flex items-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        )}
      </div>
    </PageShell>
  );
}
