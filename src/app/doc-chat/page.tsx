"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  BookOpen, 
  AlertCircle, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  ChevronRight, 
  HelpCircle,
  Sparkle
} from "lucide-react";
import { getDocumentChatResponse } from "../actions";
import { useStudyContext } from "@/components/StudyContext";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DocumentChatPage() {
  const { pdfText, selectedTopic } = useStudyContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<"direct" | "socratic">("direct");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Load welcome message when context is loaded
  useEffect(() => {
    if (pdfText) {
      const topicString = selectedTopic ? ` about the topic **"${selectedTopic}"**` : "";
      setMessages([
        {
          role: "assistant",
          content: `Hi there! I've loaded your document${topicString}. 

How would you like to study this material today? You can ask me to explain complex concepts, summarize sections, or help you debug your understanding. 

Toggle between **Direct** mode for straight answers, or **Socratic** mode if you want me to guide you to the answers with questions and hints!`,
        },
      ]);
    }
  }, [pdfText, selectedTopic]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessageContent = inputValue.trim();
    setInputValue("");
    
    const userMessage: Message = { role: "user", content: userMessageContent };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsGenerating(true);

    try {
      // Get response using the server action
      const responseText = await getDocumentChatResponse(
        updatedMessages,
        pdfText,
        selectedTopic,
        mode
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, I encountered an error while processing your request. Please try again." 
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      const topicString = selectedTopic ? ` about the topic **"${selectedTopic}"**` : "";
      setMessages([
        {
          role: "assistant",
          content: `Chat cleared! Ask me anything${topicString} based on your uploaded document.`,
        },
      ]);
    }
  };

  // If no document is uploaded, show a premium empty state
  if (!pdfText) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-24 h-24 rounded-full bg-olive-50 dark:bg-olive-955/30 text-olive-600 dark:text-olive-400 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <MessageSquare className="w-10 h-10" />
          </div>
          
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            No active document
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            You need to upload a textbook chapter, syllabus, or lecture transcript before you can start chatting with it.
          </p>

          <Link href="/dashboard" className="w-full">
            <button className="w-full group bg-olive-600 hover:bg-olive-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-olive-600/20 hover:shadow-olive-600/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
              Go to Dashboard to Upload <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col lg:flex-row gap-6 md:gap-8 h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Left Sidebar: Document Info Preview */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-80 shrink-0 flex flex-col gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-fit max-h-[30vh] lg:max-h-none overflow-y-auto"
      >
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-olive-50 dark:bg-olive-950/30 text-olive-600 dark:text-olive-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-zinc-800 dark:text-zinc-100 truncate max-w-[180px]">
              {selectedTopic || "Active Study Material"}
            </h2>
            <span className="text-xs text-zinc-400 font-medium">Document Context Active</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Active Topic</h3>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {selectedTopic || "All chapters/sections"}
          </p>
        </div>

        <div className="hidden lg:block flex-1 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Document Preview</h3>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-h-[25vh] overflow-y-auto pr-2 bg-zinc-50 dark:bg-zinc-950/30 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50 select-none custom-scrollbar">
            {pdfText.substring(0, 800)}...
          </div>
        </div>

        <div className="hidden lg:block border-t border-zinc-100 dark:border-zinc-800 pt-4 text-center">
          <Link href="/dashboard" className="text-xs font-semibold text-olive-600 hover:text-olive-700 dark:text-olive-400 hover:underline transition-colors flex items-center justify-center gap-1">
            Change document / Change topic
          </Link>
        </div>
      </motion.div>

      {/* Main Chat Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm h-full"
      >
        {/* Chat Header */}
        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-bold text-zinc-800 dark:text-zinc-100 text-lg">Document Chat Assistant</h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mode Switcher */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full text-xs font-bold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setMode("direct")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                  mode === "direct"
                    ? "bg-white dark:bg-zinc-700 text-olive-800 dark:text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Direct Q&A
              </button>
              <button
                type="button"
                onClick={() => setMode("socratic")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                  mode === "socratic"
                    ? "bg-olive-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Socratic Hints
              </button>
            </div>

            {/* Clear Button */}
            <button
              onClick={clearChat}
              title="Clear Chat History"
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Message Window */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar bg-zinc-50/10 dark:bg-zinc-955/5">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser 
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300" 
                      : mode === "socratic"
                        ? "bg-olive-100 dark:bg-olive-950/50 text-olive-700 dark:text-olive-400 border border-olive-200/50 dark:border-olive-900/50"
                        : "bg-blue-50 dark:bg-blue-955/50 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50"
                  }`}>
                    {isUser ? "U" : <Sparkle className="w-4 h-4 fill-current" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col gap-1.5 group">
                    <div className={`rounded-3xl px-5 py-3.5 text-sm leading-relaxed shadow-sm relative ${
                      isUser
                        ? "bg-zinc-900 dark:bg-zinc-800 text-white rounded-tr-sm"
                        : "bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 text-zinc-800 dark:text-zinc-200 rounded-tl-sm"
                    }`}>
                      {/* Formatted Markdown (simple replacement for bolding and code blocks) */}
                      <div className="whitespace-pre-wrap select-text">
                        {msg.content.split("\n").map((line, lIdx) => {
                          // Very basic bold replacement
                          let content = line;
                          const boldRegex = /\*\*(.*?)\*\*/g;
                          const parts = [];
                          let lastIndex = 0;
                          let match;
                          
                          while ((match = boldRegex.exec(content)) !== null) {
                            if (match.index > lastIndex) {
                              parts.push(content.substring(lastIndex, match.index));
                            }
                            parts.push(<strong key={match.index} className="font-bold text-zinc-900 dark:text-white">{match[1]}</strong>);
                            lastIndex = boldRegex.lastIndex;
                          }
                          
                          if (lastIndex < content.length) {
                            parts.push(content.substring(lastIndex));
                          }
                          
                          return (
                            <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                              {parts.length > 0 ? parts : line}
                            </p>
                          );
                        })}
                      </div>

                      {/* Tool bar (Copy) */}
                      {!isUser && (
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-1 shadow-sm">
                          <button
                            onClick={() => handleCopy(msg.content, index)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
                            title="Copy message"
                          >
                            {copiedId === index ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp / Details */}
                    <span className={`text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1 ${isUser ? "text-right" : "text-left"}`}>
                      {isUser ? "You" : mode === "socratic" ? "Socratic Tutor" : "AI Assistant"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 self-start items-center"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                <Sparkle className="w-4 h-4 animate-spin text-olive-500" />
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-3xl rounded-tl-sm px-5 py-3.5 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto w-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isGenerating}
              placeholder={
                mode === "socratic" 
                  ? `Ask a question to receive a Socratic hint...`
                  : `Ask a question about "${selectedTopic || "your document"}"...`
              }
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 rounded-2xl pl-5 pr-14 py-4 outline-none text-sm transition-all text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isGenerating}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-olive-600 hover:text-white dark:hover:bg-olive-600 dark:hover:text-white disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-300 dark:disabled:text-zinc-650 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-zinc-400 text-center mt-2.5 font-medium">
            AI responses are generated based on the context of your uploaded document.
          </p>
        </div>

      </motion.div>
    </main>
  );
}
