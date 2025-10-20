import { Link } from "react-router-dom";
import { projects } from "../data/projects";

// Helper function to extract YouTube video ID
const getYouTubeVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

export default function Projects() {
  return (
    <div 
      className="min-h-screen p-10"
      style={{ 
        backgroundImage: "url('/auroras.png')", 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <h1 className="text-6xl font-bold mb-5 instrument-serif-regular text-white">My Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <Link
            key={proj.id}
            to={`/projects/${proj.id}`}
            className="group overflow-hidden rounded-2xl border border-white/20 bg-gray-900 hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
          >
            <div className="px-4 py-3 border-b border-white/10 text-white">
              <h2 className="text-lg font-semibold instrument-serif-regular">{proj.title}</h2>
            </div>
            <div className="p-4 text-white">
              <div className="aspect-video mb-4 overflow-hidden">
                {proj.video && proj.id !== "priority-email-labeler" ? (
                  <div 
                    className="relative h-full w-full cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(proj.video, '_blank');
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(proj.video)}/maxresdefault.jpg`}
                      alt={proj.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img src={proj.image} alt={proj.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                )}
              </div>
              <p className="text-sm text-white/80 instrument-serif-regular">{proj.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {(proj.tech || []).slice(0,3).map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 bg-white/10 text-white border border-white/20 instrument-serif-regular">{t}</span>
                ))}
              </div>
              
              {/* Action buttons for MacroBoard live link, Chord Detector download, Priority Email video, and deployment status */}
              {(proj.id === "macroboard" && proj.website) || (proj.id === "live-chord-detector" && proj.download) || (proj.id === "priority-email-labeler" && proj.video) || proj.status === "not-deployed" ? (
                <div className="mt-4 mb-3">
                  {proj.id === "macroboard" && proj.website && (
                    <a 
                      href={proj.website} 
                      onClick={(e) => e.stopPropagation()} 
                      className="block w-full border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-2xl text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg" 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      🌐 Visit Live Site
                    </a>
                  )}
                  {proj.id === "live-chord-detector" && proj.download && (
                    <a 
                      href={proj.download} 
                      onClick={(e) => e.stopPropagation()} 
                      className="block w-full border border-white/20 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-2xl text-center transition-all duration-200 hover:border-white/40 hover:shadow-lg" 
                      download
                    >
                      📥 Download Project
                    </a>
                  )}
                  {proj.id === "priority-email-labeler" && proj.video && (
                    <a 
                      href={proj.video} 
                      onClick={(e) => e.stopPropagation()} 
                      className="block w-full border border-red-500/50 bg-red-900/30 hover:bg-red-800/40 text-red-200 font-semibold py-2 px-4 rounded-2xl text-center transition-all duration-200 hover:border-red-400/70 hover:shadow-lg hover:shadow-red-500/20" 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      🎥 Watch Demo Video
                    </a>
                  )}
                  {proj.status === "not-deployed" && (
                    <div className="block w-full border border-amber-500/50 bg-amber-900/30 text-amber-200 font-semibold py-2 px-4 rounded-2xl text-center">
                      ⚠️ Not Yet Deployed
                    </div>
                  )}
                </div>
              ) : null}
              
              <div className="mt-3 flex items-center justify-between text-white/70 text-xs">
                <span>Read more</span>
                <div className="flex gap-3">
                  {proj.website && proj.id !== "macroboard" && (
                    <a href={proj.website} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" target="_blank" rel="noreferrer">Live</a>
                  )}
                  {proj.download && proj.id !== "live-chord-detector" && (
                    <a href={proj.download} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" download>Download</a>
                  )}
                  {proj.github && proj.id !== "spam-email-detector" && (
                    <a href={proj.github} onClick={(e) => e.stopPropagation()} className="underline hover:text-white" target="_blank" rel="noreferrer">Code</a>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
