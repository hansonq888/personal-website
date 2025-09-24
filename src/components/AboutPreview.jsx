import { Link } from "react-router-dom";

export default function AboutPreview() {
  return (
      <section className="relative px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="py-20 max-w-xl text-left">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Hi there!
            </h2>
            <p className="text-lg mb-6 text-white">
              I’m a second-year student at Yale, studying Computer Science and Economics. I’m passionate about software engineering and building projects that solve real problems. This website showcases some of my work, projects, and explorations in tech.
            </p>
            <Link
              to="/about"
              className="hover:bg-white bg-white px-6 py-3 text-lg text-black font-medium"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

  );
}