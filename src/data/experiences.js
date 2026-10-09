// Shared by the long-scroll sheet and the standalone Experience page.
// `short` is the compressed form the sheet uses: dates, role, org on one line.
export const experiences = [
  {
    role: "Founding Software Engineer",
    org: "Shown Space",
    url: "https://shownspace.com",
    image: "/shownspace-logo.png",
    dates: "November 2025 – Present",
    short: { when: "Nov 2025 —", where: "Shown Space" },
    blurb: "Building the web app, mobile app, and data pipelines for a sports analytics platform.",
  },
  {
    role: "Software Engineer Intern",
    org: "Kira Learning",
    url: "https://www.kira-learning.com/",
    image: "/kira.avif",
    dates: "June 2026 – August 2026 · New York",
    short: { when: "Jun–Aug 2026", where: "Kira Learning, New York" },
  },
  {
    role: "Software Engineer",
    org: "Yale Cancer Center — Blenman Innovation Group",
    url: "https://blenmaninnovationgroup.org/",
    image: "/blenman.png",
    dates: "January 2026 – August 2026 · New Haven, CT",
    short: { when: "Jan–Aug 2026", where: "Blenman Innovation Group" },
  },
  {
    role: "Head of Sponsorships",
    org: "Yale AI Association",
    url: "https://www.yale-ai.org/",
    image: "/yale-ai.png",
    dates: "September 2025 – Present · New Haven, CT",
    short: { when: "Sep 2025 —", where: "Yale AI Association" },
    blurb: "Leading sponsorship outreach for Yale's AI student organization.",
  },
];

export default experiences;
