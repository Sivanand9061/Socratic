"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface StudyContextType {
  pdfText: string;
  setPdfText: (text: string) => void;
  extractedTopics: string[];
  setExtractedTopics: (topics: string[]) => void;
  selectedTopic: string | null;
  setSelectedTopic: (topic: string | null) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [pdfText, setPdfText] = useState("");
  const [extractedTopics, setExtractedTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <StudyContext.Provider
      value={{
        pdfText,
        setPdfText,
        extractedTopics,
        setExtractedTopics,
        selectedTopic,
        setSelectedTopic,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudyContext() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudyContext must be used within a StudyProvider");
  }
  return context;
}
