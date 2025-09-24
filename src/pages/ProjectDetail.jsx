import { useParams } from "react-router-dom";
import { projects } from "../data/projects";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) return <p>Project not found</p>;

  return (
    <div className="min-h-screen p-10 bg-black">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <img src={project.image} alt={project.title} className="mb-6" />
      <p className="mb-4">{project.description}</p>
      <p>Tech used: {project.tech.join(", ")}</p>
      <a
        href={project.github}
        target="_blank"
        className="text-blue-500 underline mt-4 block"
      >
        GitHub Repository
      </a>
    </div>
  );
}
