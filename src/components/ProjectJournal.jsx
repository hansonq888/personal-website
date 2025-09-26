// src/components/ProjectJournal.jsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ProjectJournal({ fileName }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/journals/${fileName}.md`)
      .then(res => res.text())
      .then(setContent);
  }, [fileName]);

  return <ReactMarkdown>{content}</ReactMarkdown>;
}
