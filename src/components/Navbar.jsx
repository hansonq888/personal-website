import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaLinkedin, FaGithub, FaBars, FaTimes } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-10 text-white">
          <NavLink to="/" className="hover:text-blue-400">Home</NavLink>
          <NavLink to="/about" className="hover:text-blue-400">About</NavLink>
          <NavLink to="/contact" className="hover:text-blue-400">Contact</NavLink>
          <NavLink to="/projects" className="hover:text-blue-400">Projects</NavLink>
        </div>

        {/* Social Icons */}
        <div className="hidden md:flex space-x-4 items-center text-white">
          <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="w-6 h-6 hover:text-blue-500" />
          </a>
          <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer">
            <FaGithub className="w-6 h-6 hover:text-gray-400" />
          </a>
          <a href="mailto:hansonq888@gmail.com">
            <MdEmail className="w-6 h-6 hover:text-red-400" />
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
        <div className="md:hidden bg-black px-4 pb-4 flex flex-col space-y-4 text-white">
          <NavLink to="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Home</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)} className="hover:text-blue-400">About</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Contact</NavLink>
          <NavLink to="/projects" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Projects</NavLink>

          {/* Social Icons for Mobile */}
          <div className="flex space-x-4 mt-2">
            <a href="https://www.linkedin.com/in/hanson-q/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-6 h-6 hover:text-blue-500" />
            </a>
            <a href="https://github.com/hansonq888" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-6 h-6 hover:text-gray-400" />
            </a>
            <a href="mailto:hansonq888@gmail.com">
              <MdEmail className="w-6 h-6 hover:text-red-400" />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
