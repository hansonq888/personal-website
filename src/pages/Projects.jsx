import { Link } from "react-router-dom";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <div className="min-h-screen p-10 bg-black">
      <h1 className="text-4xl font-bold mb-8">My projects -------------------------------------------------------------------------</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/*makes the div a grid, with 1 column, 2 column for larger screens*/}
        {/*projects is an array from projects.js
        This is a loop where proj is the current item
        map makes each proj a react object
        makes each of them a link
         */}
        {projects.map((proj) => ( 
          <Link
            key={proj.id}
            to={`/projects/${proj.id}`}
            className="border p-4 rounded hover:shadow-lg hover:scale-103 transition"
          >
            <img src={proj.image} alt={proj.title} className="mb-4" />
            <h2 className="text-2xl font-semibold">{proj.title}</h2>
            <p>{proj.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
