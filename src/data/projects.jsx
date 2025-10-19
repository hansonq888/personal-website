import ReactMarkdown from "react-markdown";
import ProjectJournal from "../components/ProjectJournal";



export const projects = [
  {
    id: "macroboard",
    title: "MacroBoard",
    description: "A full-stack economic data visualization dashboard with AI-powered insights",
    journalFile: "macroboard",
    image: "/macroboardSS.png",
    tech: ["FastAPI", "React", "Python", "OpenAI", "Vercel", "Render"],
    github: "https://github.com/hansonq888/econ-dashboard",
    website: "https://macroboard.org",
  },
  {
    id: "realtor-website",
    title: "Realtor Website",
    description: "A personal realtor website made with React",
    journalFile: "realtor-website",
    image: "/realtor.png",
    tech: ["React", "Tailwind", "Firebase"],
    github: "https://github.com/hansonq888/carol-wang-realtor",
  },
  {
    id: "live-chord-detector",
    title: "Live Chord Detector v1.0",
    description: "Real-time machine learning system that identifies musical chords from live audio",
    journalFile: "live-chord-detector",
    image: "/chordDetectorSS.png",
    tech: ["Python", "Machine Learning", "Audio Processing", "Random Forest", "Real-time"],
    github: "https://github.com/hansonq888/Chord-Detector-ML-Version",
    download: "https://drive.google.com/uc?export=download&id=1N83rAu9avdOqpdn7tuwPQVj3uWGsBDAy",
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
    github: "https://github.com/hansonq888/priority-email-detector",
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
];
