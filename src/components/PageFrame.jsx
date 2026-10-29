import { INTER } from "../data/media";

/* The layout most inner pages share, after the old sheet's Skills spread:
   a giant title on the left with the page's few words under it, and the
   page's one big object on the right. On desktop the left side holds still
   while the right scrolls past it. */

export default function PageFrame({ title, titleSize = "clamp(4rem, 12vw, 12.5rem)", aside, children }) {
  return (
    <div className="flex-1 px-3 sm:px-4 pt-2 pb-16 lg:pb-6 flex flex-col">
      <div className="mt-4 lg:mt-[9vh] flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-x-6 xl:gap-x-10 gap-y-10 items-start">
        <div className="min-w-0 lg:sticky lg:top-16">
          <h1 style={{ fontFamily: INTER, fontWeight: 700, fontSize: titleSize, letterSpacing: "-0.04em", lineHeight: 0.88 }}>
            {title}
          </h1>
          {aside && <div className="mt-8">{aside}</div>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
