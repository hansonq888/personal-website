import ReactMarkdown from "react-markdown";
import ProjectJournal from "../components/ProjectJournal";



export const projects = [
  {
    id: "webrack",
    year: "2026",
    category: "Systems",
    type: "Browser app",
    title: "WebRack",
    description: "A browser beat machine and slowed + reverb tool running on a from-scratch C++/WebAssembly audio engine",
    image: "/webrack.png",
    longDescription:
      "A beat machine and slowed + reverb tool that runs in the browser \u2014 16 pads, voice recording onto any pad, a step sequencer, and a song deck with reverb, a DJ filter, drive and EQ. I wrote the audio engine from scratch in C++20 and compiled it to standalone WebAssembly with no Emscripten glue; the UI is TypeScript with no framework. The two sides talk through a lock-free ring buffer in shared memory, so nothing allocates or blocks while audio is running, and the engine splits each block at the exact sample a step lands on so timing never drifts to block boundaries. Export runs the same engine offline, so the WAV sounds like what you heard.",
    tech: ["C++20", "WebAssembly", "AudioWorklet", "TypeScript", "DSP", "Vercel"],
    website: "https://webrack.hansonqin.com",
    github: "https://github.com/hansonq888/webrack",
  },
  {
    id: "kudex",
    year: "2026",
    category: "Full-stack",
    type: "Web app",
    title: "Kudex",
    description: "Endurance player cards \u2014 connect Strava and get your training rated out of 99",
    image: "/kudex.png",
    longDescription:
      "Connect Strava and get an endurance player card rated out of 99, built from a year of real runs, rides and swims. Each card comes with a scout report, sport mix, races, trophies and a training calendar, plus shareable card and story images generated server-side. Privacy mirrors your Strava settings \u2014 a profile stays owner-only unless you hand out its secret share link.",
    tech: ["Next.js", "TypeScript", "Strava API", "OAuth", "Vitest", "Vercel"],
    website: "https://endurance-cards.vercel.app",
  },
  {
    id: "shown-space",
    year: "2025",
    category: "Full-stack",
    type: "Web + iOS",
    title: "Shown Space",
    description: "A sports analytics platform for Ultimate \u2014 web app, iOS app, and the data pipelines and models behind them.",
    image: "/shownspace.png",
    longDescription:
      "A sports analytics platform for Ultimate. The web app and iOS app surface team and player stats on top of a Python pipeline that ingests game data and models how every pass, reception, and block shifts scoring probability. I work across the stack — Next.js on the web, React Native and Expo on mobile, Supabase and Postgres underneath.",
    tech: ["Next.js", "React Native", "Expo", "TypeScript", "Supabase", "Postgres", "Python", "XGBoost"],
    website: "https://shownspace.com",
    appStore: "https://apps.apple.com/ca/app/shown-space/id6802221800",
  },
  {
    id: "macroboard",
    year: "2025",
    category: "Full-stack",
    type: "Dashboard",
    title: "MacroBoard",
    description: "A full-stack economic data visualization dashboard with AI-powered insights",
    journalFile: "macroboard",
    image: "/macroboardSS.png",
    longDescription:
      "A full-stack dashboard that pulls U.S. economic indicators from the Federal Reserve's FRED API and layers AI-generated analysis on top. A FastAPI backend handles caching and insight generation; a React frontend makes the series interactive. I built it to have one place to track macro data, and to put my interest in economics next to full-stack work.",
    tech: ["FastAPI", "React", "Python", "OpenAI", "Vercel", "Render"],
    website: "https://macroboard.org",
  },
  {
    id: "sample8",
    category: "Full-stack",
    type: "Web app",
    title: "SAMPLE 8",
    description: "A music production inspiration platform for exploring modern production techniques",
    journalFile: "sample8",
    image: "/sample8home.png",
    longDescription:
      "A full-stack platform that documents modern music production techniques through interactive pages, audio examples, and curated breakdowns. It pairs a Pinterest-style visual discovery interface with structured production knowledge, so producers can browse techniques, hear how a sound was made, and save ideas for their own work. I built it because the techniques I kept finding were scattered across YouTube and forums with no central archive.",
    tech: ["Next.js", "React", "TypeScript", "Supabase", "Postgres", "Tailwind", "Vercel"],
    website: "https://sample8-nine.vercel.app/",
  },
  {
    id: "dealsignal-ai",
    year: "2026",
    category: "AI & ML",
    type: "Web app",
    title: "DealSignal AI",
    description: "An AI copilot that reads deal documents and drafts first-pass investment memos.",
    journalFile: "dealsignal-ai",
    image: "/DealAI.png",
    longDescription:
      "An AI-assisted diligence application for first-pass CIM review. It surfaces high-impact claims, grounds them in evidence from the source documents, and returns a structured investment read with explicit uncertainty. The goal isn't to replace judgment — it's to compress the repetitive “is this directionally true?” pass into a workflow that stays traceable and skeptical.",
    tech: ["React", "TypeScript", "FastAPI", "Anthropic", "Tavily", "pdfplumber", "Vercel", "Railway"],
    website: "https://cim-analyzer-theta.vercel.app/",
  },
  {
    id: "realtor-website",
    gallery: ["/realtorAdminSS.png"],
    year: "2025",
    category: "Full-stack",
    type: "Website",
    title: "Realtor Website",
    description: "A personal realtor website made with React",
    journalFile: "realtor-website",
    image: "/realtor.png",
    longDescription:
      "A professional realtor site built with React, Tailwind, and Firebase. Admin authentication and Firestore let the owner add and manage property listings without touching code, and the layout holds up for buyers browsing on their phones.",
    tech: ["React", "Tailwind", "Firebase"],
    website: "https://carolwangprec.com",
  },
  {
    id: "live-chord-detector",
    year: "2025",
    category: "AI & ML",
    type: "ML system",
    title: "Live Chord Detector v1.0",
    description: "Real-time machine learning system that identifies musical chords from live audio",
    journalFile: "live-chord-detector",
    image: "/chordDetectorSS.png",
    video: "https://youtu.be/TBEmuShEw2E",
    longDescription:
      "A machine learning system that identifies musical chords from live audio in real time, covering 24 chord types across major and minor. I generated 22,680 training samples from 24 base MIDI chords with pitch, velocity, octave, and inversion variations, then trained a 300-tree random forest. I started with around 100 features — MFCCs, spectral statistics, tempo — and cut down to 12 chroma features once the rest stopped earning their latency.",
    tech: ["Python", "Machine Learning", "Audio Processing", "Random Forest", "Real-time"],
    github: "https://github.com/hansonq888/Chord-Detector-ML-Version",
    download: "https://drive.google.com/uc?export=download&id=1N83rAu9avdOqpdn7tuwPQVj3uWGsBDAy",
  },
  {
    id: "priority-email-labeler",
    year: "2025",
    category: "AI & ML",
    type: "Automation",
    title: "Priority Email Labeler",
    description: "Machine Learning-powered Gmail integration that automatically labels important emails using AI. This is an evolution of my spam email detector project.",
    journalFile: "priority-email-labeler",
    image: "/priorityEmailSS.png",
    video: "https://www.youtube.com/watch?v=mb3Y9vvnRr4",
    longDescription:
      "An AI system that labels important Gmail messages automatically. It connects through Google's API and analyzes sender, subject, and content as mail arrives, applying a Priority label in real time. It grew out of an earlier spam detector: that project taught me email classification and the Gmail API, and this one goes past filtering spam to organizing what actually matters.",
    tech: ["Machine Learning", "Python", "FastAPI", "Gmail API", "Google Cloud"],
    relatedProject: "spam-email-detector",
  },
  {
    id: "mini-shell",
    category: "Systems",
    type: "CLI",
    title: "Mini-shell",
    description: "A Unix shell implementation in C built as a class project. Features process management, pipelines, redirection, and job control using system calls like fork(), execvp(), and signal handling.",
    journalFile: "mini-shell",
    image: "/shellGif.gif",
    longDescription:
      "A Unix shell written in C for a systems programming course. It handles command execution, I/O redirection, pipelines, and conditional operators, plus built-ins like cd, history, and jobs. The hardest part was job control — managing foreground and background processes, handling SIGINT and SIGTSTP, and tracking process state through fork(), execvp(), and waitpid().",
    tech: ["C", "System Programming", "Unix", "Process Management", "Signals"],
  },
  {
    id: "mini-compiler",
    category: "Systems",
    type: "Compiler",
    title: "Mini-Compiler",
    description: "A tiny BASIC-like compiler that lexes, parses, and transpiles to C.",
    journalFile: "mini-compiler",
    image: "/compilerGIF.gif",
    longDescription:
      "A compiler for a BASIC-like language that I kept building after the class ended. It runs the usual front-end phases: a hand-rolled lexer, a recursive-descent parser, and an emitter that transpiles to C so GCC can take it the rest of the way. It supports integer expressions, labels and gotos, conditionals, and while loops. Because it started as coursework and still shares scaffolding, there's no public repo.",
    tech: ["C++", "Compilers", "Parsing", "Transpilation"],
  },
  {
    id: "my-allocator",
    title: "My Allocator",
    description: "A custom memory allocator implementation with malloc, calloc, and free functions built for a systems programming class.",
    journalFile: "my-allocator",
    image: "/allocator_gif.gif",
    tech: ["C", "Systems Programming", "Memory Management", "sbrk", "mmap"],
  },
  {
    id: "personal-website",
    title: "My Personal Website!",
    description: "A website to act as my portfolio.",
    journalFile: "personal-website",
    image: "/personalWebsiteSS.png",
    tech: ["TailwindCSS", "Javascript"],
    github: "https://github.com/hansonq888/Chord-Detector-ML-Version",
  },
  {
    id: "typing-game",
    title: "Typing Game",
    description: "A simple speed typing game",
    journalFile: "typing-game",
    image: "/typingGameSS.png",
    tech: ["Javascript", "CSS", "HTML"],
    github: "https://github.com/hansonq888/typing-game",
  },
  {
    id: "spam-email-detector",
    title: "ML Spam Email Detector",
    description: "A desktop app that detects spam emails",
    journalFile: "spam-detector",
    image: "/SpamDetectorSS.png",
    tech: ["Python", "API", "ML"],
  },
];

// Which projects appear on /projects, in order. Shared with ProjectDetail so
// each page can link through to its neighbours.
export const featuredIds = [
  "shown-space",
  "webrack",
  "kudex",
  "sample8",
  "dealsignal-ai",
  "macroboard",
  "realtor-website",
  "live-chord-detector",
  "priority-email-labeler",
  "mini-shell",
  "mini-compiler",
];

export const featuredProjects = featuredIds
  .map((id) => projects.find((p) => p.id === id))
  .filter(Boolean);
