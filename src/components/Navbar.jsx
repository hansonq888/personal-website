import { NavLink } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Navbar() {
  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
        
        <div className="hidden md:flex space-x-10 text-white">
          <NavLink to="/" className="hover:text-blue-400">Home</NavLink>
          <NavLink to="/about" className="hover:text-blue-400">About</NavLink>
          <NavLink to="/contact" className="hover:text-blue-400">Contact</NavLink>
          <NavLink to="/projects" className="hover:text-blue-400">Projects</NavLink>
        </div>

        <div className="flex space-x-4 items-center text-white">
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
    </nav>
  );
}
