"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, MessageSquare, AlertCircle } from "lucide-react";
import { getTutorResponse } from "../actions";
import { useStudyContext } from "@/components/StudyContext";

export default function VoiceTutorPage() {
  const { selectedTopic, pdfText } = useStudyContext();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<{ role: "user" | "tutor"; text: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullTranscriptRef = useRef<string>("");

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            fullTranscriptRef.current += finalTranscript + " ";
          }

          const currentText = fullTranscriptRef.current + interimTranscript;
          setLiveTranscript(currentText);

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          if (currentText.trim().length > 0) {
            silenceTimerRef.current = setTimeout(async () => {
              recognitionRef.current.stop();
              setIsListening(false);
              setLiveTranscript("");

              const textToSubmit = currentText.trim();
              fullTranscriptRef.current = ""; // Reset

              if (textToSubmit) {
                await processUserMessage(textToSubmit);
              }
            }, 5000);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          setLiveTranscript("");
          if (event.error !== 'no-speech') {
            setErrorMsg(`Microphone error: ${event.error}`);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setLiveTranscript("");
        };
      } else {
        setErrorMsg("Your browser does not support Speech Recognition. Please use Chrome, Edge, or Safari.");
      }
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha") || v.lang === "en-US");
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const processUserMessage = async (userMessage: string) => {
    setIsSpeaking(true);
    const newHistory = [...conversation, { role: "user" as const, text: userMessage }];
    setConversation(newHistory);

    try {
      const contextObj = selectedTopic && pdfText ? { topic: selectedTopic, text: pdfText } : undefined;
      const response = await getTutorResponse(newHistory, contextObj);
      setConversation(prev => [...prev, { role: "tutor", text: response }]);
      speakText(response);
    } catch (error) {
      console.error(error);
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorMsg("Speech recognition is not supported in this browser.");
      return;
    }

    setErrorMsg("");

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      const textToSubmit = liveTranscript.trim();
      setLiveTranscript("");
      fullTranscriptRef.current = "";
      if (textToSubmit) {
        processUserMessage(textToSubmit);
      }
    } else {
      // If AI is currently speaking, stop it
      if (isSpeaking) {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      }

      fullTranscriptRef.current = "";
      setLiveTranscript("");
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting recognition", e);
      }
    }
  };

  // Autoscroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [conversation, isSpeaking, liveTranscript]);

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive-100 dark:bg-olive-900/30 text-olive-800 dark:text-olive-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Volume2 className="w-3.5 h-3.5" /> Socratic Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
          The Socratic <span className="text-olive-600">Voice Tutor</span>
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed max-w-2xl mx-auto">
          A voice-to-voice AI tutor that refuses to give you the direct answer. It guides your brain into figuring it out yourself.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 w-full max-w-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl border border-olive-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-[400px] mb-8">
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-olive-100 dark:border-zinc-800 p-4 flex items-center justify-between">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-olive-600" /> Live Transcript
          </span>
          {selectedTopic && (
            <span className="text-xs font-bold bg-olive-100 dark:bg-olive-900/30 text-olive-700 dark:text-olive-400 px-2 py-1 rounded-md">
              Context: {selectedTopic}
            </span>
          )}
          {isSpeaking && (
            <span className="text-xs font-bold text-olive-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-olive-600 animate-pulse" /> Tutor Speaking
            </span>
          )}
        </div>
        <div ref={chatRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
          {conversation.length === 0 && !liveTranscript ? (
            <div className="flex-1 flex items-center justify-center text-zinc-400 dark:text-zinc-500 italic">
              Tap the microphone and ask a question to begin...
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user"
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 self-end rounded-tr-sm"
                    : "bg-olive-50 dark:bg-olive-900/20 text-olive-900 dark:text-olive-100 border border-olive-100 dark:border-olive-900/50 self-start rounded-tl-sm"
                  }`}
              >
                <span className="block text-xs font-bold uppercase mb-1 opacity-50 tracking-wider">
                  {msg.role === "user" ? "You" : "Tutor"}
                </span>
                {msg.text}
              </motion.div>
            ))
          )}

          {/* Live Transcript Bubble */}
          {liveTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[80%] rounded-2xl p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 self-end rounded-tr-sm opacity-70"
            >
              <span className="block text-xs font-bold uppercase mb-1 opacity-50 tracking-wider flex items-center gap-2">
                You <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              </span>
              {liveTranscript}
            </motion.div>
          )}

          {isSpeaking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-olive-50 dark:bg-olive-900/20 border border-olive-100 dark:border-olive-900/50 self-start rounded-2xl rounded-tl-sm p-4 w-24 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 bg-olive-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-olive-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-olive-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center mt-4">
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-red-400/30 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-red-400/20 rounded-full"
            />
          </>
        )}
        {isSpeaking && (
          <>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-olive-400/30 rounded-full"
            />
          </>
        )}

        <button
          onClick={toggleListening}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isListening
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/30"
              : isSpeaking
                ? "bg-olive-400 cursor-pointer shadow-olive-400/30"
                : "bg-olive-600 hover:bg-olive-700 shadow-olive-600/30"
            }`}
        >
          {isListening ? <MicOff className="w-8 h-8" /> : isSpeaking ? <Volume2 className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
        </button>
      </div>
      <div className="mt-6 text-sm font-medium text-zinc-400 text-center">
        {isListening ? "Listening..." : isSpeaking ? "Tutor is responding... (Click to interrupt)" : "Tap the mic and start talking"}
      </div>
    </main>
  );
}
