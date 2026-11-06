import { Link } from "react-router-dom";

/* One tile of the sheet's project mosaic. The image fills the tile and the
   caption sits on it, so tiles of any size lock together with no text between
   them. The grid decides how big each one is. */
export default function BentoTile({ project, from }) {
  return (
    <Link to={`/projects/${project.id}`} state={from ? { from } : undefined} className="group bento-tile">
      <div className="pc-frame">
        <img src={project.image} alt="" loading="lazy" />
        <span className="bento-badge" aria-hidden="true">↗</span>
        <div className="bento-cap">
          <h3>{project.title}</h3>
          {project.year && <span>{project.year}</span>}
        </div>
      </div>
    </Link>
  );
}
