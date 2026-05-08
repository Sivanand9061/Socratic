import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { StudyProvider } from "@/components/StudyContext";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Socratic",
  description: "An AI-powered EdTech Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fafafa] dark:bg-[#0a0a0a] min-h-screen flex flex-col text-zinc-900 dark:text-zinc-100 selection:bg-olive-200 selection:text-olive-900`}
      >
        <AuthProvider>
          <StudyProvider>
            <Navbar />
            <div className="flex-1 flex flex-col w-full h-full">
              {children}
            </div>
          </StudyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
