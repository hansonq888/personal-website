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
    const videoId = match ? match[1] : null;
    console.log('YouTube URL:', url, 'Extracted ID:', videoId);
    return videoId;
  };

  // For Priority Email Labeler, let's use the direct video ID
  const priorityEmailVideoId = "mb3Y9vvnRr4";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Blog-like container with proper margins */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header section */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 inter-unique leading-tight">{project.title}</h1>
          
          {(project.id === "priority-email-labeler" || project.id === "live-chord-detector") && project.video ? (
            <div className="mb-8">
              <div 
                className="relative aspect-video max-w-2xl rounded-lg overflow-hidden cursor-pointer group border-2 border-white"
                onClick={() => window.open(project.video, '_blank')}
              >
                <img
                  src={project.image}
                  alt={`${project.title} Demo`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-white/70 mt-3 inter-unique">Click to watch demo video</p>
              
              {/* Priority Email Screenshot */}
              <div className="mt-6">
                <img 
                  src="/priorityEmailSS.png" 
                  alt="Priority Email Labeler Screenshot" 
                  className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-lg border-2 border-white" 
                />
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <img 
                src={project.image} 
                alt={project.title} 
                className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-lg border-2 border-white" 
              />
              
              {/* Additional screenshot for realtor website */}
              {project.id === "realtor-website" && (
                <div className="mt-6">
                  <img 
                    src="/realtorAdminSS.png" 
                    alt="Realtor Website Admin Screenshot" 
                    className="max-w-full h-auto max-h-96 object-contain rounded-lg shadow-lg border-2 border-white" 
                  />
                </div>
              )}
            </div>
          )}
        </header>

        {/* Project info section */}
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 inter-unique">{project.description}</h2>
          
          {/* Deployment status notice */}
          {project.status === "not-deployed" && (
            <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-amber-200 font-medium inter-unique">
                  <span className="font-semibold">Note:</span> This project is not yet deployed
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
            <p className="text-lg inter-unique">
              <span className="font-semibold text-blue-400">Tech Stack:</span> {project.tech.join(", ")}
            </p>
          </div>
        </section>
        
        {/* Action buttons */}
        {(project.id === "macroboard" && project.website) || (project.id === "realtor-website" && project.website) || (project.id === "live-chord-detector" && (project.download || project.video)) ? (
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            {(project.id === "macroboard" || project.id === "realtor-website") && project.website && (
              <a 
                href={project.website} 
                className="flex-1 max-w-xs border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg inter-unique" 
                target="_blank" 
                rel="noreferrer"
              >
                🌐 Visit Live Site
              </a>
            )}
            {project.id === "live-chord-detector" && project.download && (
              <a 
                href={project.download} 
                className="flex-1 max-w-xs border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg inter-unique" 
                download
              >
                📥 Download Project
              </a>
            )}
            {project.id === "live-chord-detector" && project.video && (
              <a 
                href={project.video} 
                className="flex-1 max-w-xs border border-red-500/50 bg-red-900/30 hover:bg-red-800/40 text-red-200 font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200 hover:border-red-400/70 hover:shadow-lg hover:shadow-red-500/20 inter-unique" 
                target="_blank" 
                rel="noreferrer"
              >
                🎥 Watch Demo Video
              </a>
            )}
          </div>
        ) : null}
        
        {/* Content section with improved typography */}
        <article className="prose prose-invert prose-lg max-w-none">
          <div className="inter-unique leading-relaxed">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
          </div>
        </article>
        
        {/* GitHub link */}
        {project.github && project.id !== "spam-email-detector" && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <a
              href={project.github}
              target="_blank"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 inter-unique"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
