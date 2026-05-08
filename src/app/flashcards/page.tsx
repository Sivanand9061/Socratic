"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RefreshCw, BrainCircuit, GraduationCap, FileText } from "lucide-react";
import { generateFlashcards } from "../actions";
import { useStudyContext } from "@/components/StudyContext";
import Link from "next/link";

export default function FlashcardsPage() {
  const { pdfText, selectedTopic } = useStudyContext();
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<{ front: string; back: string }[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    // If context exists, we send a targeted prompt along with the text.
    // If no context, we just use the pasted text.
    const promptText = selectedTopic 
      ? `Generate flashcards strictly regarding the topic "${selectedTopic}" based on the following text:\n\n${pdfText.substring(0, 30000)}` 
      : text;

    if (!promptText.trim()) return;
    
    setIsGenerating(true);
    try {
      const generatedCards = await generateFlashcards(promptText);
      setFlashcards(generatedCards);
      setActiveCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error(error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setActiveCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start w-full">
      {/* Left Column: Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Instant Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
            Instant Flashcard <span className="text-olive-600">Generator</span>
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed">
            {selectedTopic 
              ? `You are currently studying "${selectedTopic}". Click generate to extract flashcards from your uploaded document.`
              : `Paste your lecture transcript or textbook chapter below. Our AI will extract the core concepts and build a custom, interactive deck in seconds.`
            }
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-olive-200 to-olive-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-olive-100 dark:border-zinc-800 overflow-hidden focus-within:ring-2 focus-within:ring-olive-500 transition-all flex flex-col h-64 lg:h-80">
            {selectedTopic ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-olive-500 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">PDF Context Active</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                  We'll use your uploaded PDF to generate flashcards specifically for <strong>{selectedTopic}</strong>.
                </p>
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your study material here... (e.g. 'Photosynthesis is a process used by plants...')"
                className="w-full flex-1 p-6 resize-none outline-none text-zinc-700 dark:text-zinc-300 bg-transparent placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            )}
            
            <div className="bg-zinc-50 dark:bg-zinc-800/50 border-t border-olive-100 dark:border-zinc-800 p-4 flex justify-between items-center shrink-0">
              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {selectedTopic ? "Context Mode" : `${text.length} characters`}
              </span>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || (!selectedTopic && !text.trim())}
                className="bg-olive-600 hover:bg-olive-700 disabled:opacity-50 disabled:hover:bg-olive-600 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 shadow-sm shadow-olive-600/20"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Extracting...
                  </>
                ) : (
                  <>
                    Generate Deck <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {selectedTopic && (
          <Link href="/dashboard" className="text-sm font-medium text-olive-600 hover:text-olive-700 text-center mt-2">
            Want to study a different topic? Change it in your Dashboard.
          </Link>
        )}
      </motion.div>

      {/* Right Column: Flashcard Display */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center justify-center min-h-[500px]"
      >
        {flashcards.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-olive-200 dark:border-zinc-800 p-12 py-24">
            <div className="bg-olive-50 dark:bg-olive-900/20 text-olive-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Awaiting Knowledge</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
              {selectedTopic ? "Click generate to extract flashcards from your PDF." : "Submit your text to generate a beautiful deck of study cards tailored just for you."}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto relative perspective-1000">
            {/* Progress Indicator */}
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-sm font-semibold text-olive-600 dark:text-olive-400 bg-olive-50 dark:bg-olive-900/30 px-3 py-1 rounded-full">
                Card {activeCardIndex + 1} of {flashcards.length}
              </span>
              <div className="flex gap-1">
                {flashcards.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeCardIndex ? 'w-6 bg-olive-600 dark:bg-olive-500' : 'w-2 bg-olive-200 dark:bg-olive-800'}`}
                  />
                ))}
              </div>
            </div>

            {/* Flashcard */}
            <div className="relative w-full aspect-[4/3] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeCardIndex + (isFlipped ? 'back' : 'front')}
                  initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col text-center shadow-xl border ${
                    isFlipped 
                      ? 'bg-olive-600 text-white border-olive-700 shadow-olive-600/20 dark:shadow-none' 
                      : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-olive-100 dark:border-zinc-700'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {!isFlipped && (
                    <div className="absolute top-6 left-6 text-olive-300 dark:text-olive-700">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  )}
                  
                  <div className="flex-1 flex items-center justify-center overflow-y-auto mb-8 px-2 custom-scrollbar">
                    <div className={`font-medium leading-snug w-full ${
                      isFlipped 
                        ? 'text-base sm:text-lg text-white text-left' 
                        : 'text-xl sm:text-2xl md:text-3xl text-zinc-800 dark:text-zinc-100 text-center'
                    }`}>
                      {isFlipped ? flashcards[activeCardIndex].back : flashcards[activeCardIndex].front}
                    </div>
                  </div>
                  
                  <div className={`absolute bottom-6 left-0 right-0 mx-auto w-full text-center text-sm font-medium tracking-widest uppercase bg-transparent ${isFlipped ? 'text-olive-300' : 'text-zinc-400 dark:text-zinc-500'}`}>
                    Click to flip
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mt-10">
              <button 
                onClick={prevCard}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-olive-300 dark:hover:border-olive-500 hover:text-olive-600 transition-all shadow-sm"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                Use arrows to navigate
              </div>
              <button 
                onClick={nextCard}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-olive-300 dark:hover:border-olive-500 hover:text-olive-600 transition-all shadow-sm"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
