import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaLinkedin, FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-transparent shadow-md sticky top-0 z-50">
      <div className="w-full px-8 py-6 flex justify-between items-center">
        
        {/* Desktop Nav Links - Left Side */}
        <div className="hidden md:flex space-x-8 text-white instrument-serif-regular">
          <NavLink to="/" className="hover:text-white/80 text-base font-medium">Home</NavLink>
          <NavLink to="/about" className="hover:text-white/80 text-base font-medium">About</NavLink>
          <NavLink to="/projects" className="hover:text-white/80 text-base font-medium">Projects</NavLink>
          <NavLink to="/contact" className="hover:text-white/80 text-base font-medium">Contact</NavLink>
        </div>

        {/* Social Icons - Right Side */}
        <div className="hidden md:flex space-x-6 items-center text-white">
          <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="w-7 h-7 hover:text-blue-500 transition-colors" />
          </a>
          <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer">
            <FaGithub className="w-7 h-7 hover:text-gray-400 transition-colors" />
          </a>
          <a href="mailto:hansonq888@gmail.com">
            <MdEmail className="w-7 h-7 hover:text-red-400 transition-colors" />
          </a>
        </div>

        {/* Hamburger Button for Mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes className="w-6 h-6 text-white" /> : <FaBars className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-transparent px-8 pb-4 flex flex-col space-y-3 text-white instrument-serif-regular">
          <NavLink to="/" onClick={() => setIsOpen(false)} className="hover:text-white/80 text-base">Home</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className="hover:text-white/80 text-base">About</NavLink>
          <NavLink to="/projects" onClick={() => setIsOpen(false)} className="hover:text-white/80 text-base">Projects</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className="hover:text-white/80 text-base">Contact</NavLink>

          {/* Social Icons for Mobile */}
          <div className="flex space-x-6 mt-4">
            <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-7 h-7 hover:text-blue-500 transition-colors" />
            </a>
            <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-7 h-7 hover:text-gray-400 transition-colors" />
            </a>
            <a href="mailto:hansonq888@gmail.com">
              <MdEmail className="w-7 h-7 hover:text-red-400 transition-colors" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
