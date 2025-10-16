import { FaLinkedin, FaGithub, FaHeart } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <footer className="relative bg-black border-t-2 border-white/30 overflow-hidden">
      {/* Retro decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 text-white/40 text-2xl font-bold">┌</div>
        <div className="absolute top-2 right-2 text-white/40 text-2xl font-bold">┐</div>
        <div className="absolute bottom-2 left-2 text-white/40 text-2xl font-bold">└</div>
        <div className="absolute bottom-2 right-2 text-white/40 text-2xl font-bold">┘</div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Retro header */}
        <div className="border border-white/40 bg-black/50 p-4 mb-6">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 barriecito-regular">
              Hanson Qin
            </h3>
            <p className="text-white/70 text-sm">
              Computer Science & Economics @ Yale
            </p>
          </div>
        </div>

        {/* Main content - more compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact & Links */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white cinzel-unique border-b border-white/30 pb-1">
              Contact & Links
            </h4>
            <div className="space-y-2">
              <a 
                href="mailto:hansonq888@gmail.com" 
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <MdEmail className="w-4 h-4" />
                <span>hansonq888@gmail.com</span>
              </a>
              <div className="flex space-x-4 mt-3">
                <a 
                  href="https://www.linkedin.com/in/hanson-q/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white/80 hover:text-blue-400 transition-colors"
                >
                  <FaLinkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/hansonq888" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white/80 hover:text-gray-300 transition-colors"
                >
                  <FaGithub className="w-4 h-4" />
                  <span className="text-sm">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white cinzel-unique border-b border-white/30 pb-1">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="/" className="text-white/80 hover:text-white transition-colors text-sm">
                Home
              </a>
              <a href="/about" className="text-white/80 hover:text-white transition-colors text-sm">
                About
              </a>
              <a href="/projects" className="text-white/80 hover:text-white transition-colors text-sm">
                Projects
              </a>
              <a href="/contact" className="text-white/80 hover:text-white transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Retro separator */}
        <div className="flex items-center justify-center my-4">
          <div className="flex-1 h-px bg-white/20"></div>
          <div className="mx-4 text-white/40 text-lg">◆</div>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Bottom section - more compact */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-white/70 text-sm">
            <span>Made by Hanson Qin</span>
          </div>
          
          <div className="text-xs text-white/50">
            <p>© {currentYear} Hanson Qin. Built with React & Vite.</p>
          </div>
        </div>
      </div>

      {/* Retro bottom border */}
      <div className="h-0.5 bg-white/30"></div>
    </footer>
  );
}
