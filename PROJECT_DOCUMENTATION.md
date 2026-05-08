# The Socratic - EdTech Platform

## Overview
"The Socratic" is a study tool designed to actively engage users in learning through three core features:
1. **Instant Flashcard Generator**: Extracts core concepts from text (lecture transcripts, textbook chapters) and generates interactive flashcards.
2. **The Socratic Voice Tutor**: A voice-to-voice AI tutor that guides users to the right answer using leading questions.
3. **Blind Exam Simulator**: Generates custom mock exams, grades answers, and visualizes weak points.

## Tech Stack
- **Framework**: T3 Stack (Next.js, TypeScript, tRPC, Prisma/Drizzle)
- **Styling**: Tailwind CSS v4
- **AI Integration**: Groq API (Llama-3 models)
- **Database**: Firebase Firestore
- **Design System**: Professional UI utilizing a palette of crisp white and olive green colors.

## Phase 1 Objectives
- [x] Initialize the T3 stack codebase (Next.js, Tailwind v4).
- [x] Implement the foundational UI with the white and olive green color scheme.
- [x] Develop the "Instant Flashcard Generator" UI and logic (text input -> AI extraction -> Flashcard deck rendering).
- [x] Refine flashcard UI to prevent text overlap on long content.

## Phase 2 Objectives
- [x] Build navigation tabs to transition between app features.
- [x] Implement the "Socratic Voice Tutor" UI interface.
- [x] Design a simulated conversational transcript area with AI/User roles.
- [x] Create pulsing microphone animations to reflect listening and speaking states.

## Phase 3 Objectives
- [x] Build the "Blind Exam Simulator" topic selection UI.
- [x] Create an interactive, step-by-step quiz interface with progress bars.
- [x] Implement answer grading logic with visual correctness indicators.
- [x] Design the "Exam Results" dashboard with a final score ring and weak-point analysis charts.
