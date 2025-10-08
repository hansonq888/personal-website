import AboutPreview from "../components/AboutPreview";
import Hero from "../components/Hero";
import About from "./About";
import ProjectsPreview from "../components/ProjectsPreview";

export default function Home() {
  return (
    <div className="border-y border-white/15">
        <Hero />
        <AboutPreview />
        <ProjectsPreview />
    </div>
  );
}
