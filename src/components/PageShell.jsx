import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useMusic } from "../context/MusicContext";

export default function PageShell({ children, isHome = false, scrollContent = true }) {
  const { isMusicPlaying, toggleMusic } = useMusic();

  return (
    <div className="h-screen min-h-[100dvh] min-h-[100vh] overflow-hidden overflow-x-hidden w-full max-w-full min-w-0 flex flex-col bg-black border-2 border-white/30">
      {/* Top navbar — fixed height so it never resizes */}
      <div className="flex-shrink-0 h-10 min-h-10 border-b border-white/20 px-4 flex justify-between items-center">
        {isHome ? (
          <span className="geist-light text-white text-[10px] md:text-xs tracking-[0.2em]">
            Student developer & builder
          </span>
        ) : (
          <Link
            to="/"
            className="geist-light text-white/80 hover:text-white text-[10px] md:text-xs tracking-wide transition-colors"
          >
            Back
          </Link>
        )}
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="https://www.linkedin.com/in/hanson-q/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-white/80 hover:text-white transition-colors"
          >
            <FaLinkedin className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a
            href="https://github.com/hansonq888"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-white/80 hover:text-white transition-colors"
          >
            <FaGithub className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a
            href="mailto:hansonq888@gmail.com"
            aria-label="Email"
            className="text-white/80 hover:text-white transition-colors"
          >
            <MdEmail className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          {isHome && (
            <button
              type="button"
              onClick={toggleMusic}
              className="flex items-center justify-center w-6 h-6 bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-colors"
              aria-label={isMusicPlaying ? "Pause music" : "Play music"}
            >
              {isMusicPlaying ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main content — scrollable on inner pages, fixed on home */}
      <main className={`flex-1 min-h-0 border-b border-white/20 min-w-0 max-w-full overflow-x-hidden ${scrollContent ? "overflow-y-auto" : "overflow-hidden flex flex-col"}`}>
        {children}
      </main>
    </div>
  );
}
