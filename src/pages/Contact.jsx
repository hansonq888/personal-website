import PageShell from "../components/PageShell";

export default function Contact() {
  return (
    <PageShell>
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <h1 className="project-title-font text-white text-2xl md:text-3xl font-bold mb-6 border-b border-white/20 pb-3">
          Contact
        </h1>
        <p className="geist-light text-white text-sm md:text-base leading-relaxed mb-8">
          <span className="geist-light-italic text-white">Always open to chat about projects, music, or anything else.</span>
          {" "}Feel free to reach out.
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="mailto:hansonq888@gmail.com"
            className="block border border-white/20 px-4 py-3 geist-light text-white text-sm hover:bg-white hover:text-black transition-colors"
          >
            hansonq888@gmail.com
          </a>
          <a
            href="mailto:hanson.qin@yale.edu"
            className="block border border-white/20 px-4 py-3 geist-light text-white text-sm hover:bg-white hover:text-black transition-colors"
          >
            hanson.qin@yale.edu
          </a>
          <a
            href="https://www.linkedin.com/in/hanson-q/"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-white/20 px-4 py-3 geist-light text-white text-sm hover:bg-white hover:text-black transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/hansonq888"
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-white/20 px-4 py-3 geist-light text-white text-sm hover:bg-white hover:text-black transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </PageShell>
  );
}
