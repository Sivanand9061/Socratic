"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, BrainCircuit, ChevronRight, FileUp, Loader2, FileText, CheckCircle2, MessageSquare, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useStudyContext } from "@/components/StudyContext";
import { parsePDF } from "../actions";

export default function DashboardPage() {
  const { pdfText, setPdfText, extractedTopics, setExtractedTopics, selectedTopic, setSelectedTopic } = useStudyContext();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await parsePDF(formData);
      
      if (result.error) {
        alert(result.error);
        return;
      }
      
      setPdfText(result.text);
      setExtractedTopics(result.topics);
      setSelectedTopic(null);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to parse PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearSession = () => {
    setSelectedTopic(null);
    setExtractedTopics([]);
    setPdfText("");
  };

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* Step 1: Upload PDF / Material */}
        {!selectedTopic && (
          <motion.div 
            key="setup-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 text-xs font-bold uppercase tracking-wider mb-4">
                Step 1: Provide Material
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                What are we studying <span className="text-olive-600">today?</span>
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-4 max-w-2xl mx-auto">
                Upload your syllabus, lecture slides, or textbook chapter. The AI will read the document, break it down into core chapters, and prepare your tools.
              </p>
            </div>

            {extractedTopics.length === 0 ? (
              <div className="w-full max-w-2xl">
                <label className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-olive-300 dark:border-olive-700/50 rounded-3xl bg-olive-50/50 dark:bg-olive-900/10 hover:bg-olive-50 dark:hover:bg-olive-900/20 transition-all cursor-pointer group overflow-hidden">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-olive-600 animate-spin mb-4" />
                      <p className="text-lg font-semibold text-olive-900 dark:text-olive-300">Parsing Document...</p>
                      <p className="text-sm text-olive-600 dark:text-olive-500 mt-2">Extracting chapters and concepts using AI</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-6">
                      <div className="w-20 h-20 rounded-full bg-olive-100 dark:bg-olive-900/50 flex items-center justify-center text-olive-600 mb-6 group-hover:scale-110 group-hover:bg-olive-600 group-hover:text-white transition-all duration-300">
                        <FileUp className="w-10 h-10" />
                      </div>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Click to upload PDF document</p>
                      <p className="text-zinc-500 dark:text-zinc-400">or drag and drop here (Max 10MB)</p>
                    </div>
                  )}
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            ) : (
              <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                    Step 2: Select a Topic
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">We found the following topics in your document.</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-2">Select the specific chapter you want to focus on for this session.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {extractedTopics.map((topic, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedTopic(topic)}
                      className="text-left p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-olive-400 dark:hover:border-olive-600 hover:shadow-lg transition-all group flex flex-col justify-between h-full"
                    >
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-lg leading-tight mb-4 group-hover:text-olive-600 transition-colors">
                        {topic}
                      </span>
                      <div className="flex items-center text-sm font-bold text-olive-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Launch Study Session <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                  <button 
                    onClick={clearSession}
                    className="text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors underline underline-offset-4"
                  >
                    Upload a different document instead
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Launch Pad (Topic Selected) */}
        {selectedTopic && (
          <motion.div
            key="launchpad-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="text-center mb-12 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 text-xs font-bold uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" /> Context Locked & Ready
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
                Study <span className="text-olive-600">Launchpad</span>
              </h1>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm inline-block w-full">
                <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Active Topic</p>
                <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center justify-center gap-3">
                  <FileText className="w-6 h-6 text-olive-500" /> {selectedTopic}
                </p>
              </div>
            </div>

            <div className="w-full">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 text-center">Choose your study method:</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {/* Tool 1: Document Chat */}
                <Link href="/doc-chat" className="group bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-olive-400 dark:hover:border-olive-500 transition-all flex flex-col items-center text-center hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-olive-50 dark:bg-olive-900/20 flex items-center justify-center text-olive-600 mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Document Chat</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-1">
                    Ask questions and chat with your uploaded material using direct Q&A or Socratic hints.
                  </p>
                  <div className="flex items-center font-bold text-olive-600">
                    Launch <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                {/* Tool 2: Instant Flashcards */}
                <Link href="/flashcards" className="group bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-olive-400 dark:hover:border-olive-500 transition-all flex flex-col items-center text-center hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-olive-50 dark:bg-olive-900/20 flex items-center justify-center text-olive-600 mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Instant Flashcards</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-1">
                    Generate an interactive deck of flashcards specifically tailored to this chapter.
                  </p>
                  <div className="flex items-center font-bold text-olive-600">
                    Launch <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
                
                {/* Tool 3: Socratic Voice Tutor */}
                <Link href="/voice-tutor" className="group bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-olive-400 dark:hover:border-olive-500 transition-all flex flex-col items-center text-center hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-olive-50 dark:bg-olive-900/20 flex items-center justify-center text-olive-600 mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Socratic Voice Tutor</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-1">
                    Talk to an AI tutor that asks leading questions about this topic until you understand it.
                  </p>
                  <div className="flex items-center font-bold text-olive-600">
                    Launch <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>

                {/* Tool 4: Blind Mock Exam */}
                <Link href="/exam" className="group bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-olive-400 dark:hover:border-olive-500 transition-all flex flex-col items-center text-center hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-olive-50 dark:bg-olive-900/20 flex items-center justify-center text-olive-600 mb-6 group-hover:scale-110 transition-transform">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Blind Mock Exam</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 flex-1">
                    Take a completely blind test on this specific chapter and get AI grading and analytics.
                  </p>
                  <div className="flex items-center font-bold text-olive-600">
                    Launch <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>

              <div className="mt-16 text-center">
                <button 
                  onClick={clearSession}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <PlusCircle className="w-4 h-4" /> Start a New Session (Clear Context)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
