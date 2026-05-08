"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, Volume2 } from "lucide-react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="flex flex-col relative w-full overflow-hidden">
      
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-900 text-white">
        {/* Background Parallax Elements */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-olive-500 rounded-full mix-blend-screen filter blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[120px]" />
        </motion.div>

        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-olive-400 animate-pulse" /> Welcome to the future of learning
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            Learn <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive-300 to-olive-600">
              Actively.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-medium"
          >
            The Socratic doesn't just give you the answers. It forces your brain to work, using AI to turn static notes into interactive, unforgettable mastery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              href="/dashboard"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-zinc-900 bg-white rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-olive-400 scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-[#fafafa] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6">
              Choose your <span className="text-olive-600">weapon.</span>
            </h2>
            <p className="text-xl text-zinc-500 max-w-2xl">
              Three powerful AI-driven tools designed to hack your learning process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/flashcards" className="group">
              <div className="bg-white rounded-3xl p-8 h-full border border-zinc-200 hover:border-olive-400 transition-colors shadow-sm hover:shadow-xl flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-olive-50 flex items-center justify-center text-olive-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">Instant Flashcards</h3>
                <p className="text-zinc-500 flex-1">
                  Paste any textbook chapter or lecture transcript. The AI instantly extracts the core concepts and builds an interactive 3D deck.
                </p>
                <div className="mt-8 flex items-center text-olive-600 font-semibold gap-2 group-hover:gap-4 transition-all">
                  Try it out <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            <Link href="/voice-tutor" className="group">
              <div className="bg-white rounded-3xl p-8 h-full border border-zinc-200 hover:border-olive-400 transition-colors shadow-sm hover:shadow-xl flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-olive-50 flex items-center justify-center text-olive-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Volume2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">Voice Tutor</h3>
                <p className="text-zinc-500 flex-1">
                  A voice-to-voice AI tutor that refuses to give direct answers. It uses the Socratic method to guide you to the solution.
                </p>
                <div className="mt-8 flex items-center text-olive-600 font-semibold gap-2 group-hover:gap-4 transition-all">
                  Try it out <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            <Link href="/exam" className="group">
              <div className="bg-white rounded-3xl p-8 h-full border border-zinc-200 hover:border-olive-400 transition-colors shadow-sm hover:shadow-xl flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-olive-50 flex items-center justify-center text-olive-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4">Blind Exam</h3>
                <p className="text-zinc-500 flex-1">
                  Generate a custom mock exam on any topic instantly. Answer blindly, get graded by AI, and visualize your weak points.
                </p>
                <div className="mt-8 flex items-center text-olive-600 font-semibold gap-2 group-hover:gap-4 transition-all">
                  Try it out <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
