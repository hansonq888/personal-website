import { Link } from "react-router-dom";
import { INTER, LIGHT } from "../data/media";

/* The pieces every page shares since the magazine layout: the light section
   label over a black rule, and the rounded image tile whose words only show
   on hover. One place, so the home page and the inner pages cannot drift. */

/* A section label over a black rule; a link when it has somewhere to go.
   `fit` draws the rule only as long as the word instead of across the column. */
export function Label({ to, fit = false, children, className = "" }) {
  const cls = `${fit ? "w-fit" : ""} block text-sm tracking-wide pb-1.5 mb-2 border-b border-black ${className}`;
  return to ? (
    <Link to={to} className={`${cls} hover:opacity-60 transition-opacity`} style={LIGHT}>
      {children}
    </Link>
  ) : (
    <p className={cls} style={LIGHT}>
      {children}
    </p>
  );
}

/* An image that fills its cell; the words only show on hover (unless
   `quiet`, where a caption elsewhere already says them). `crop` zooms the
   picture in about `position` without touching the hover scale. */
export function MediaTile({ to, state, href, src, label, sub, bg, crop = 1, position, quiet = false, className = "" }) {
  const body = (
    <>
      <span className="absolute inset-0" style={crop !== 1 ? { transform: `scale(${crop})`, transformOrigin: position || "center" } : undefined}>
        <img
          src={src}
          alt={label}
          className={
            "absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.05] " +
            (bg ? "object-contain" : "object-cover object-top")
          }
          style={position ? { objectPosition: position } : undefined}
        />
      </span>
      <span className={"absolute inset-0 bg-black/0 transition-colors duration-300 " + (quiet ? "group-hover:bg-black/15" : "group-hover:bg-black/55")} />
      {!quiet && (
        <span
          className="absolute left-3 right-3 bottom-2.5 uppercase leading-tight text-white text-[11px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ fontFamily: INTER, fontWeight: 700, letterSpacing: "0.02em" }}
        >
          {label}
          {sub && <span className="block mt-0.5 normal-case font-light opacity-80">{sub}</span>}
        </span>
      )}
    </>
  );
  const cls = `group relative block overflow-hidden rounded-lg bg-[#f4f4f4] min-h-[140px] ${className}`;
  const style = bg ? { backgroundColor: bg } : undefined;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {body}
      </a>
    );
  }
  if (to) {
    return (
      <Link to={to} state={state} className={cls} style={style}>
        {body}
      </Link>
    );
  }
  return (
    <div className={cls} style={style}>
      {body}
    </div>
  );
}
