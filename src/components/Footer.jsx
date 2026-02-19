import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useState } from "react";

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <footer className="bg-black border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-5 text-white instrument-serif-regular">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-white order-3 md:order-1">© {currentYear} Hanson Qin</div>
          <nav className="order-1 md:order-2 flex items-center gap-5 text-sm">
            <Link to="/" className="hover:text-white/80">Home</Link>
            <Link to="/about" className="hover:text-white/80">About</Link>
            <Link to="/projects" className="hover:text-white/80">Projects</Link>
            <Link to="/contact" className="hover:text-white/80">Contact</Link>
          </nav>
          <div className="order-2 md:order-3 flex items-center gap-3">
            <a href="mailto:hansonq888@gmail.com" aria-label="Email" className="hover:text-white/80"><MdEmail className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white/80"><FaLinkedin className="w-5 h-5" /></a>
            <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white/80"><FaGithub className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
