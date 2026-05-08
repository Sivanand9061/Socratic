# The Socratic - Project Documentation

## Overview
"The Socratic" is an AI-powered EdTech platform designed to help students study smarter. It transforms raw study materials (PDFs, text) into interactive learning experiences using advanced AI models.

## Core Features
- **Smart Dashboard**: Upload and parse PDF textbooks or lecture notes to extract core topics automatically.
- **AI Flashcard Generator**: Instantly generates interactive flashcards based on the uploaded document or custom text.
- **AI Exam Simulator**: Creates multiple-choice exams tailored to specific study topics.
- **Voice Tutor**: An interactive AI tutor that uses the Socratic method to guide students to answers rather than just giving them away.

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion
- **Backend/AI**: Groq API (LLaMA 3.3 70B) for instant AI generation, Next.js Server Actions
- **Authentication & Database**: Firebase Authentication (Email/Password), Firestore (NoSQL)
- **Document Processing**: PDF-Parse for extracting text from study materials

## How to Run Locally (No VS Code Required)
Simply double-click the `start.bat` file in the main folder. It will automatically:
1. Check if dependencies need to be installed.
2. Start the local server.
3. Open `http://localhost:3000` in your default web browser.
