import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function PageShell({ children, isHome = false, scrollContent = true }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden min-w-0 flex flex-col bg-white">
      {/* Top navbar — responsive */}
      <div className="flex-shrink-0 h-11 sm:h-12 min-h-[44px] border-b border-black/10 px-3 sm:px-4 md:px-6 flex justify-between items-center gap-2 bg-white">
        {isHome ? (
          <span className="text-black/70 text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium">
            Student developer & builder
          </span>
        ) : (
          <Link
            to="/"
            className="text-black/80 hover:text-black text-xs sm:text-sm font-medium tracking-wide transition-colors min-w-0 truncate"
          >
            ← Back
          </Link>
        )}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <a
            href="https://www.linkedin.com/in/hanson-q/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-black/70 hover:text-black transition-colors"
          >
            <FaLinkedin className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a
            href="https://github.com/hansonq888"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-black/70 hover:text-black transition-colors"
          >
            <FaGithub className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a
            href="https://www.instagram.com/hanson.q888/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-black/70 hover:text-black transition-colors"
          >
            <FaInstagram className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a
            href="mailto:hansonq888@gmail.com"
            aria-label="Email"
            className="text-black/70 hover:text-black transition-colors"
          >
            <MdEmail className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </div>
      </div>

      {/* Main content — light bg */}
      <main className="flex-1 min-h-0 min-w-0 max-w-full overflow-x-hidden bg-white text-black">
        {children}
      </main>
    </div>
  );
}
