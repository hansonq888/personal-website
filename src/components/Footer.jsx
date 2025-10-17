import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <footer className="bg-black" style={{ marginBottom: '0px', paddingBottom: '20px', position: 'relative', bottom: '-1px' }}>
      <div className="max-w-7xl mx-auto px-8 py-8 text-white instrument-serif-regular" style={{ marginBottom: '0px', paddingBottom: '20px' }}>
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          {/* Left: brand/copyright */}
          <div className="text-xs text-white/70 order-3 md:order-1">© {currentYear} Hanson Qin</div>

          {/* Center: nav links */}
          <nav className="order-1 md:order-2 flex items-center gap-6 text-sm">
            <a href="/" className="hover:text-blue-400">Home</a>
            <a href="/about" className="hover:text-blue-400">About</a>
            <a href="/projects" className="hover:text-blue-400">Projects</a>
            <a href="/contact" className="hover:text-blue-400">Contact</a>
          </nav>

          {/* Right: social/contact icons */}
          <div className="order-2 md:order-3 flex items-center gap-4">
            <a href="mailto:hansonq888@gmail.com" aria-label="Email" className="hover:text-red-400"><MdEmail className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-400"><FaLinkedin className="w-5 h-5" /></a>
            <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-gray-300"><FaGithub className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
