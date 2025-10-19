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

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen p-10 bg-black text-white">
      <h1 className="text-5xl font-bold mb-4">{project.title}</h1>
      
      {/* Video for Priority Email Labeler */}
      {project.id === "priority-email-labeler" && project.video ? (
        <div className="mb-6">
          <div 
            className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => window.open(project.video, '_blank')}
          >
            <img
              src={`https://img.youtube.com/vi/${getYouTubeVideoId(project.video)}/maxresdefault.jpg`}
              alt={`${project.title} Demo`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          <p className="text-center text-white/70 mt-2">Click to watch demo video</p>
        </div>
      ) : (
        <img src={project.image} alt={project.title} className="mb-6" />
      )}
      
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
