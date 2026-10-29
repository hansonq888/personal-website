import { Link } from "react-router-dom";
import { featuredProjects } from "../data/projects";
import { experiences } from "../data/experiences";
import { Label, MediaTile } from "../components/Media";
import { INTER, LIGHT, CROP, LOGO_BG } from "../data/media";

/* The front page, laid out like a magazine spread: projects on the left,
   the intro in the middle, experience on the right. Same type and voice as
   the classic pages; only the layout changes. */

export default function Magazine() {
  return (
    <div className="min-h-screen w-full min-w-0 text-black overflow-x-hidden bg-white flex flex-col">
      <div className="flex-1 flex flex-col px-3 sm:px-4 py-3 sm:py-4">
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-x-4 xl:gap-x-6 gap-y-10 items-stretch">
          {/* Intro — first on phones, centre on desktop */}
          {/* the GIF on top, the name and links under it; centred as a group */}
          <div className="lg:order-2 flex flex-col items-center justify-center gap-12 text-center">
            {/* the drawing sits left of centre inside the GIF itself; nudge it back */}
            <img className="w-full max-w-full h-auto block translate-x-[9%] scale-[1.15]" src="/ezgif.com-gif-maker.gif" alt="Animated intro" />
            <div className="flex flex-col items-center">
            <h1 style={{ fontFamily: INTER, fontWeight: 700, fontSize: "clamp(2.75rem, 5.5vw, 8rem)", letterSpacing: "-0.02em", lineHeight: 0.92 }}>
              Hi! I&apos;m
              <br />
              Hanson
            </h1>
            <nav className="mt-8 flex flex-wrap justify-center items-center gap-5 sm:gap-7">
              <Link to="/about" className="text-sm tracking-wide hover:underline underline-offset-2" style={LIGHT}>About</Link>
              <Link to="/experiences" className="text-sm tracking-wide hover:underline underline-offset-2" style={LIGHT}>Experience</Link>
              <Link to="/projects" className="text-sm tracking-wide hover:underline underline-offset-2" style={LIGHT}>Projects</Link>
              <Link to="/skills" className="text-sm tracking-wide hover:underline underline-offset-2" style={LIGHT}>Skills</Link>
            </nav>
            </div>
          </div>

          {/* Projects */}
          <section className="lg:order-1 flex flex-col">
            <Label to="/projects">Projects</Label>
            <div className="flex-1 grid grid-cols-2 auto-rows-fr gap-1.5">
              {featuredProjects.slice(0, 8).map((p) => (
                <MediaTile key={p.id} to={`/projects/${p.id}`} src={p.image} label={p.title} crop={CROP[p.id]} />
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="lg:order-3 flex flex-col">
            <Label to="/experiences">Experience</Label>
            <div className="flex-1 grid grid-cols-2 auto-rows-fr gap-1.5">
              {experiences.map((exp) => (
                <MediaTile key={exp.org} href={exp.url} src={exp.image} label={exp.role} sub={exp.short?.where || exp.org} bg={LOGO_BG[exp.image]} />
              ))}
              {/* centred in the courtyard; bias the crop up so the face stays in frame */}
              <MediaTile to="/about" src="/about-yale.jpg" label="About me" position="50% 38%" className="col-span-2" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
