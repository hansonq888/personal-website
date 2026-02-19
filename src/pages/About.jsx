import PageShell from "../components/PageShell";

export default function About() {
  return (
    <PageShell>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <h1 className="project-title-font text-white text-2xl md:text-3xl font-bold mb-6 border-b border-white/20 pb-3">
          About
        </h1>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-1 space-y-4">
            <p className="geist-light text-white text-sm md:text-base leading-relaxed">
              <span className="geist-light-italic text-white">Yale sophomore originally from Vancouver, Canada, studying CS & Mathematics.</span>
              {" "}I build software, work in ML and design, and like to mix code and creativity.
            </p>
            <p className="geist-light text-white text-sm md:text-base leading-relaxed">
              Outside of academics, I love playing ultimate frisbee, exploring music production, and staying active. I'm always excited to learn new skills, tackle challenging problems, and share knowledge with others.
            </p>
            <p className="geist-light text-white text-sm md:text-base leading-relaxed">
              This site is a space to showcase my work, projects, and explorations in technology, design, and music.
            </p>
            <span className="geist-light text-white/60 text-xs tracking-widest block mt-4">
              New Haven, CT
            </span>
          </div>
          <div className="flex-shrink-0">
            <div className="border border-white/20 p-2 w-fit">
              <img
                src="/AboutPhoto.jpg"
                alt=""
                className="w-40 md:w-48 object-cover block"
              />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
