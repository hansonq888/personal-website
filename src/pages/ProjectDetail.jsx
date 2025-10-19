import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projects } from "../data/projects";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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

  if (!project) return <p>Project not found</p>;

  return (
    <div className="min-h-screen p-10 bg-black text-white">
      <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
      <img src={project.image} alt={project.title} className="mb-6" />
      <h2 className="text-2xl mb-4">{project.description}</h2>
      <p>Tech used: {project.tech.join(", ")}</p>
      
      {/* Special highlighting for MacroBoard live link and Chord Detector download */}
      {(project.id === "macroboard" && project.website) || (project.id === "live-chord-detector" && project.download) ? (
        <div className="my-8 max-w-md">
          {project.id === "macroboard" && project.website && (
            <a 
              href={project.website} 
              className="block w-full border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg" 
              target="_blank" 
              rel="noreferrer"
            >
              🌐 Visit Live Site
            </a>
          )}
          {project.id === "live-chord-detector" && project.download && (
            <a 
              href={project.download} 
              className="block w-full border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-2xl text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg" 
              download
            >
              📥 Download Project
            </a>
          )}
        </div>
      ) : null}
      
      <div className="prose prose-invert max-w-none mt-6">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </div>
      {project.github && project.id !== "spam-email-detector" && (
        <a
          href={project.github}
          target="_blank"
          className="text-blue-500 underline mt-4 block"
        >
          GitHub Repository
        </a>
      )}
    </div>
  );
}
