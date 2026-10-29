import { FaEnvelope, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import PageShell from "../components/PageShell";
import PageFrame from "../components/PageFrame";
import { Label, MediaTile } from "../components/Media";
import { LIGHT } from "../data/media";

const CONTACT = [
  { label: "Email", href: "mailto:hansonq888@gmail.com", icon: FaEnvelope },
  { label: "GitHub", href: "https://github.com/hansonq888", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hanson-q/", icon: FaLinkedin },
  { label: "Instagram", href: "https://www.instagram.com/hanson.q888/?hl=en", icon: FaInstagram },
];

/* About in the shared frame: the facts and the way to get in touch under the
   giant title, the photo as the page's one big object. */
export default function About() {
  return (
    <PageShell>
      <PageFrame
        title="About"
        aside={
          <>
            <div className="space-y-2 text-[17px] text-black/75" style={LIGHT}>
              <p>CS and Math at Yale</p>
              <p>Vancouver and New Haven</p>
              <p>I like frisbee, music and building</p>
            </div>
            <div className="mt-10 max-w-sm">
              <Label>Contact</Label>
              <div className="mt-4 flex flex-col gap-3">
                {CONTACT.map(({ label, href, icon }) => {
                  const Icon = icon;
                  return (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-[15px] hover:opacity-60 transition-opacity"
                      style={LIGHT}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden />
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        }
      >
        <MediaTile src="/about-yale.jpg" label="Hanson Qin" position="50% 38%" quiet className="aspect-[4/3]" />
      </PageFrame>
    </PageShell>
  );
}
