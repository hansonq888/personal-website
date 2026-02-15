import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ease = [0.33, 1, 0.68, 1];

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Thin vertical line — left, same as other pages */}
      <motion.div
        className="absolute left-4 md:left-12 top-20 md:top-24 bottom-36 md:bottom-44 w-0.5 bg-white/20 z-[1]"
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        style={{ originY: 0 }}
      />

      {/* Top left — labels */}
      <motion.div
        className="absolute top-4 md:top-8 left-4 md:left-12 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.1, ease }}
      >
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block">
          Who
        </span>
        <span className="geist-light text-white/75 text-[10px] md:text-xs tracking-[0.2em] block mt-1">
          About
        </span>
      </motion.div>

      {/* Top right — about copy + baby photo (polaroid) below */}
      <motion.div
        className="absolute top-4 md:top-8 right-4 md:right-12 z-10 text-right max-w-[75%] md:max-w-md flex flex-col items-end px-2 md:px-0"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.2, ease }}
      >
        <p className="geist-light text-white/75 text-sm md:text-base leading-relaxed mb-4">
          <span className="geist-light-italic text-white/75">Yale sophomore studying CS & Mathematics.</span>
          {" "}I build software, dabble in ML and design, and like to mix code and creativity.
        </p>
        <p className="geist-light text-white/75 text-sm md:text-base leading-relaxed mb-4">
          Outside of academics, I love playing ultimate frisbee, exploring music production, and staying active. I'm always excited to learn new skills, tackle challenging problems, and share knowledge with others.
        </p>
        <p className="geist-light text-white/75 text-sm md:text-base leading-relaxed mb-6">
          This site is a space to showcase my work, projects, and explorations in technology, design, and music.
        </p>
        <motion.div
          className="bg-white/75 pt-2 pr-2 pl-2 pb-8 shadow-lg w-fit"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease }}
        >
          <img
            src="/AboutPhoto.jpg"
            alt=""
            className="w-40 md:w-48 object-cover block"
          />
        </motion.div>
      </motion.div>

      {/* Bottom left — headline */}
      <motion.div
        className="absolute bottom-4 md:bottom-8 left-4 md:left-12 z-10 pt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3, ease }}
      >
        <h1 className="project-title-font text-[clamp(2rem,8vw,4rem)] text-white/75 font-bold leading-tight">
          About
        </h1>
        <span className="geist-light text-white/45 text-xs tracking-widest block mt-2">
          New Haven, CT
        </span>
      </motion.div>

      {/* Bottom right — go back */}
      <motion.div
        className="absolute bottom-4 md:bottom-8 right-4 md:right-12 z-10"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.4, ease }}
      >
        <Link
          to="/"
          className="geist-light text-white/75 text-sm border border-white/30 rounded-full px-5 py-2.5 hover:bg-white/10 transition-colors tracking-wider inline-block"
        >
          Go back
        </Link>
      </motion.div>
    </div>
  );
}
