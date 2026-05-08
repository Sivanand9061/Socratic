"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Flashcards", href: "/flashcards" },
    { name: "Voice Tutor", href: "/voice-tutor" },
    { name: "Exam Simulator", href: "/exam" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-olive-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-olive-600 text-white p-2 rounded-lg shadow-sm">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-olive-900 dark:text-white hidden sm:inline-block">The Socratic</span>
      </Link>
      
      <div className="flex gap-4 md:gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors py-1 hidden md:block ${
                isActive ? "text-olive-700 dark:text-olive-400 font-semibold border-b-2 border-olive-600 dark:border-olive-500" : "hover:text-olive-600 dark:hover:text-olive-300"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              <div className="w-7 h-7 rounded-full bg-olive-100 dark:bg-olive-900/50 flex items-center justify-center text-olive-700 dark:text-olive-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[120px] lg:max-w-none">{user.email?.split('@')[0]}</span>
            </div>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-full text-sm font-medium transition-all"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-sm">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
