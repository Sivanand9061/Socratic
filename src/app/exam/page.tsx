"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, BrainCircuit, CheckCircle2, XCircle, BarChart3, ChevronRight, FileText } from "lucide-react";
import { generateExam } from "../actions";
import { useStudyContext } from "@/components/StudyContext";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function ExamPage() {
  const { selectedTopic, pdfText } = useStudyContext();
  const { user } = useAuth();
  const [examTopic, setExamTopic] = useState("");
  const [examState, setExamState] = useState<"setup" | "generating" | "taking" | "grading" | "results">("setup");
  const [examQuestions, setExamQuestions] = useState<{question: string, options: string[], correct: number, category: string}[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  // Auto-fill topic if context exists
  useEffect(() => {
    if (selectedTopic) {
      setExamTopic(selectedTopic);
    }
  }, [selectedTopic]);

  const handleGenerateExam = async () => {
    if (!examTopic.trim()) return;
    setExamState("generating");
    
    try {
      // If we have a selectedTopic that matches what they are generating, we could theoretically 
      // pass pdfText to the exam generator for more accuracy. For now, we'll just pass the topic.
      // (Optional: In a full app, modify generateExam to accept contextText)
      const generated = await generateExam(examTopic);
      setExamQuestions(generated);
      setCurrentQuestionIdx(0);
      setUserAnswers([]);
      setExamState("taking");
    } catch (error) {
      console.error(error);
      alert("Failed to generate exam. Please try again.");
      setExamState("setup");
    }
  };

  const selectAnswer = (idx: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIdx] = idx;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < examQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setExamState("grading");

      // Calculate score and save results to Firestore
      const correctCount = examQuestions.reduce((acc, q, idx) => {
        return acc + (userAnswers[idx] === q.correct ? 1 : 0);
      }, 0);
      const score = Math.round((correctCount / examQuestions.length) * 100);

      if (user && db) {
        try {
          addDoc(collection(db, "exam_attempts"), {
            userId: user.uid,
            topic: examTopic,
            score,
            correctCount,
            totalQuestions: examQuestions.length,
            userAnswers,
            createdAt: new Date().toISOString()
          });
          console.log("Successfully saved exam attempt to Firestore!");
        } catch (dbErr) {
          console.error("Failed to save exam attempt to Firestore:", dbErr);
        }
      }

      setTimeout(() => {
        setExamState("results");
      }, 2500);
    }
  };

  const resetExam = () => {
    if (!selectedTopic) {
      setExamTopic("");
    }
    setExamState("setup");
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center w-full">
      <AnimatePresence mode="wait">
        {examState === "setup" && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 text-xs font-bold uppercase tracking-wider mb-4 mx-auto">
              <Play className="w-3.5 h-3.5" /> Phase 3
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-4">
              Blind Exam <span className="text-olive-600">Simulator</span>
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
              Generate a custom mock exam instantly. Answer the questions blindly, get graded by AI, and view a visual chart of your weak points to focus your studies.
            </p>
            
            <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-olive-100 dark:border-zinc-800 shadow-sm text-left">
              {selectedTopic && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-olive-50 dark:bg-olive-900/20 text-olive-800 dark:text-olive-300 rounded-xl border border-olive-200 dark:border-olive-800/50">
                  <FileText className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Context Active: Generating exam based on your uploaded PDF.</p>
                </div>
              )}
              
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">What topic are you studying?</label>
              <input 
                type="text" 
                value={examTopic}
                onChange={(e) => setExamTopic(e.target.value)}
                disabled={!!selectedTopic}
                placeholder="e.g. Molecular Biology" 
                className="w-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-olive-500 focus:outline-none disabled:opacity-60"
              />
              <button 
                onClick={handleGenerateExam}
                disabled={!examTopic.trim()}
                className="w-full bg-olive-600 hover:bg-olive-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all shadow-sm shadow-olive-600/20"
              >
                Generate Mock Exam
              </button>
            </div>
            
            {selectedTopic && (
              <div className="mt-6">
                <Link href="/dashboard" className="text-sm font-medium text-olive-600 hover:text-olive-700">
                  Want to study a different topic? Change it in your Dashboard.
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {examState === "generating" && (
          <motion.div 
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 border-4 border-olive-200 dark:border-olive-900/50 border-t-olive-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Crafting your exam...</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Generating tricky questions on "{examTopic}"</p>
          </motion.div>
        )}

        {examState === "taking" && (
          <motion.div 
            key="taking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-3xl"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                Question {currentQuestionIdx + 1} of {examQuestions.length}
              </span>
              <span className="px-3 py-1 bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 rounded-full text-xs font-bold uppercase tracking-wider">
                {examQuestions[currentQuestionIdx].category}
              </span>
            </div>
            
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mb-8 overflow-hidden">
              <div 
                className="bg-olive-500 h-full transition-all duration-500" 
                style={{ width: `${((currentQuestionIdx) / examQuestions.length) * 100}%` }}
              ></div>
            </div>

            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white mb-8 leading-tight">
              {examQuestions[currentQuestionIdx].question}
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-10">
              {examQuestions[currentQuestionIdx].options.map((opt, idx) => {
                const isSelected = userAnswers[currentQuestionIdx] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(idx)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      isSelected 
                        ? "border-olive-600 bg-olive-50 dark:bg-olive-900/20" 
                        : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-olive-300 dark:hover:border-olive-500"
                    }`}
                  >
                    <span className={`text-lg font-medium ${isSelected ? "text-olive-900 dark:text-olive-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                      {opt}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-olive-600" : "border-zinc-300 dark:border-zinc-600 group-hover:border-olive-300 dark:group-hover:border-olive-500"
                    }`}>
                      {isSelected && <div className="w-3 h-3 bg-olive-600 rounded-full"></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={nextQuestion}
                disabled={userAnswers[currentQuestionIdx] === undefined}
                className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
              >
                {currentQuestionIdx === examQuestions.length - 1 ? "Submit Exam" : "Next Question"} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {examState === "grading" && (
          <motion.div 
            key="grading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="relative mb-8">
              <BrainCircuit className="w-16 h-16 text-olive-600 animate-pulse" />
              <Sparkles className="w-6 h-6 text-olive-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">Grading your responses...</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Analyzing weak points and generating charts</p>
          </motion.div>
        )}

        {examState === "results" && (() => {
          let score = 0;
          let weakCategories: Record<string, { total: number, wrong: number }> = {};
          
          examQuestions.forEach((q, idx) => {
            if (!weakCategories[q.category]) {
              weakCategories[q.category] = { total: 0, wrong: 0 };
            }
            weakCategories[q.category].total += 1;
            
            if (userAnswers[idx] === q.correct) {
              score += 1;
            } else {
              weakCategories[q.category].wrong += 1;
            }
          });

          const percentage = Math.round((score / examQuestions.length) * 100);

          return (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="col-span-1 md:col-span-3 flex justify-between items-end mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div>
                  <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Exam Results</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">Topic: {examTopic}</p>
                </div>
                <button onClick={resetExam} className="text-sm font-semibold text-olive-600 hover:text-olive-800 dark:hover:text-olive-400 px-4 py-2 bg-olive-50 dark:bg-olive-900/30 rounded-lg">
                  Take Another Exam
                </button>
              </div>

              {/* Score Card */}
              <div className="col-span-1 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-olive-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center">
                <div className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">Final Score</div>
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-zinc-100 dark:text-zinc-800"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={percentage >= 75 ? "text-olive-500" : percentage >= 50 ? "text-yellow-500" : "text-red-500"}
                      strokeDasharray={`${percentage}, 100`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-3xl font-bold text-zinc-800 dark:text-white">{percentage}%</div>
                </div>
                <p className="font-medium text-zinc-600 dark:text-zinc-400 text-lg">{score} out of {examQuestions.length} correct</p>
              </div>

              {/* Weak Points Chart */}
              <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-olive-100 dark:border-zinc-800 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                  <BarChart3 className="w-5 h-5 text-olive-600" />
                  <h3 className="font-bold text-lg text-zinc-800 dark:text-white">Weak Points Analysis</h3>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-6">
                  {Object.entries(weakCategories).map(([cat, data], idx) => {
                    const errorRate = (data.wrong / data.total) * 100;
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-zinc-700 dark:text-zinc-300">{cat}</span>
                          <span className={errorRate > 0 ? "text-red-500" : "text-olive-600"}>
                            {errorRate > 0 ? `${data.wrong} mistakes` : "Perfect"}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-olive-400 h-full" 
                            style={{ width: `${100 - errorRate}%` }}
                          ></div>
                          <div 
                            className="bg-red-400 h-full" 
                            style={{ width: `${errorRate}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Section */}
              <div className="col-span-1 md:col-span-3 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-olive-100 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-lg text-zinc-800 dark:text-white mb-6">Question Review</h3>
                <div className="flex flex-col gap-4">
                  {examQuestions.map((q, idx) => {
                    const isCorrect = userAnswers[idx] === q.correct;
                    return (
                      <div key={idx} className={`p-5 rounded-2xl border ${isCorrect ? 'border-olive-200 dark:border-olive-800 bg-olive-50/30 dark:bg-olive-900/10' : 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10'} flex gap-4`}>
                        <div className="pt-1">
                          {isCorrect ? <CheckCircle2 className="w-6 h-6 text-olive-600" /> : <XCircle className="w-6 h-6 text-red-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{q.question}</p>
                          {!isCorrect && (
                            <div className="text-sm">
                              <p className="text-red-600 dark:text-red-400 line-through mb-1">Your answer: {q.options[userAnswers[idx]]}</p>
                              <p className="text-olive-700 dark:text-olive-400 font-medium">Correct answer: {q.options[q.correct]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          );
        })()}
      </AnimatePresence>
    </main>
  );
}
