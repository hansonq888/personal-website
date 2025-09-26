import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Contact() {
  return (
    <div className="p-10 min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold mb-12 text-white">
        Contact Me
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* LinkedIn */}
        <Link
          to="https://www.linkedin.com/in/hanson-q/"
          target="_blank"
          rel="noopener noreferrer"
          className="border p-6 rounded-lg hover:shadow-lg hover:scale-105 transition flex flex-col items-center text-white"
        >
          <FaLinkedin className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-semibold">LinkedIn</h2>
        </Link>

        {/* Email */}
        <Link
          to="mailto:hansonq888@gmail.com"
          className="border p-6 rounded-lg hover:shadow-lg hover:scale-105 transition flex flex-col items-center text-white"
        >
          <MdEmail className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-semibold">Email</h2>
        </Link>

        {/* GitHub */}
        <Link
          to="https://github.com/hansonq888"
          target="_blank"
          rel="noopener noreferrer"
          className="border p-6 rounded-lg hover:shadow-lg hover:scale-105 transition flex flex-col items-center text-white"
        >
          <FaGithub className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-semibold">GitHub</h2>
        </Link>
      </div>

      {/* Footer vibe */}
      <p className="mt-12 text-white/70 text-lg text-center">
        hansonq888@gmail.com | hanson.qin@yale.edu
      </p>
    </div>
  );
}
