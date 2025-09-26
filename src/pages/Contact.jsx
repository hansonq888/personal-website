import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Contact() {
  return (
    <div className="p-10 min-h-screen flex flex-col items-center justify-center" >
      <h1 className="text-5xl font-extrabold mb-12 text-white drop-shadow-lg">
        Contact Me
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
        {/* LinkedIn */}
        <Link
          to="https://www.linkedin.com/in/hanson-q/"
          target="_blank"
          rel="noopener noreferrer"
          className="group border-2 border-white rounded-2xl p-8 text-center backdrop-blur-lg 
                     transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <FaLinkedin className="w-16 h-16 mx-auto text-white group-hover:text-blue-400 transition" />
          <h2 className="text-2xl mt-4 font-bold text-white group-hover:text-blue-200 transition">
            LinkedIn
          </h2>
        </Link>

        {/* Email */}
        <Link
          to="mailto:hansonq888@gmail.com"
          className="group border-2 border-white rounded-2xl p-8 text-center backdrop-blur-lg 
                     transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <MdEmail className="w-16 h-16 mx-auto text-white group-hover:text-red-400 transition" />
          <h2 className="text-2xl mt-4 font-bold text-white group-hover:text-red-200 transition">
            Email
          </h2>
        </Link>

        {/* GitHub */}
        <Link
          to="https://github.com/hansonq888"
          target="_blank"
          rel="noopener noreferrer"
          className="group border-2 border-white rounded-2xl p-8 text-center backdrop-blur-lg 
                     transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <FaGithub className="w-16 h-16 mx-auto text-white group-hover:text-gray-400 transition" />
          <h2 className="text-2xl mt-4 font-bold text-white group-hover:text-gray-200 transition">
            GitHub
          </h2>
        </Link>
      </div>

      {/* Footer vibe */}
      <p className="mt-12 text-white/80 text-lg">
        hansonq888@gmail.com | hanson.qin@yale.edu
      </p>
    </div>
  );
}
