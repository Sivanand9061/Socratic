"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-side only to avoid hydration mismatches)
  useEffect(() => {
    try {
      const storedPdfText = localStorage.getItem("socratic_pdf_text");
      const storedTopics = localStorage.getItem("socratic_extracted_topics");
      const storedTopic = localStorage.getItem("socratic_selected_topic");

      if (storedPdfText) setPdfText(storedPdfText);
      if (storedTopics) setExtractedTopics(JSON.parse(storedTopics));
      if (storedTopic) setSelectedTopic(storedTopic);
    } catch (e) {
      console.error("Failed to load study context from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("socratic_pdf_text", pdfText);
      localStorage.setItem("socratic_extracted_topics", JSON.stringify(extractedTopics));
      if (selectedTopic) {
        localStorage.setItem("socratic_selected_topic", selectedTopic);
      } else {
        localStorage.removeItem("socratic_selected_topic");
      }
    } catch (e) {
      console.error("Failed to save study context to localStorage:", e);
    }
  }, [pdfText, extractedTopics, selectedTopic, isLoaded]);

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
