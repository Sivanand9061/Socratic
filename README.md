# 🏛️ The Socratic

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-v12-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Groq](https://img.shields.io/badge/AI_Powered-Groq_Llama--3.3-f55036?style=for-the-badge)

**The Socratic** is an intelligent, high-fidelity EdTech platform that transforms static study materials (PDFs, text) into interactive, AI-driven learning experiences. It shifts the paradigm of AI from "giving you the answers" to actively guiding your brain to figure them out.

Built with performance, responsiveness, and user experience in mind, this platform natively integrates Large Language Models into modern web workflows using cutting-edge client-side and server-side APIs.

---

## ✨ Core Features

*   📂 **AI Document Ingestion (PDF-Centric Flow)**
    Upload any PDF textbook, lecture transcript, or syllabus. The application parses the document locally on the server, and a Groq-powered `llama-3.3-70b-versatile` model extracts the core chapters and topics to build your custom study context.
*   💬 **Interactive Document Chat** (New!)
    A fully responsive, text-based chat workspace to converse with your uploaded document. Features:
    *   **Mode Selector**: Toggle between **Direct Q&A** (for straight answers and code explanations) and **Socratic Hints** (where the AI guides you to the answers with leading questions).
    *   **Mobile-First Native Feel**: Complete viewport isolation (`touch-none` and strict flex rules) to prevent screen jitter or background scroll bounce when keyboard is open.
    *   **Zoom Protection**: Designed at `text-base` size to bypass mobile iOS Safari auto-zooming on focus.
    *   **Copy Bubble Toolbar**: Built-in clipboard utility for copying AI responses.
*   🎙️ **The Socratic Voice Tutor (Web Speech API)**
    An interactive, voice-to-voice AI tutor. Instead of spoon-feeding answers, it uses the Socratic method to ask leading questions based on your specific document context. Features real-time Speech-to-Text (STT), smart 5-second silence detection, and native Text-to-Speech (TTS).
*   🗂️ **Instant Contextual Flashcards**
    Dynamically generates beautiful, interactive flashcards based strictly on the active context of your uploaded material. Decks are automatically saved to your profile if logged in.
*   🧠 **Blind Mock Exams & Analytics**
    Generates a 4-question multiple-choice exam on any topic. Upon completion, the system grades your answers, visualizes your performance using custom UI charts, and logs the attempt.
*   🔐 **Secure Authentication & DB Saving**
    Full Email & Password authentication backed by Firebase. Logged-in users automatically persist their generated flashcard decks and mock exam scores to Google Cloud Firestore.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion (for fluid micro-animations and layout transitions).
*   **Backend & Server Actions:** Next.js Server Actions handle secure API calls and complex logic (like PDF parsing and AI extraction) without exposing secrets to the client.
*   **AI Engine:** Groq SDK utilizing `llama-3.3-70b-versatile` for lightning-fast, high-accuracy contextual generation.
*   **Database & Auth:** Firebase Authentication (Client SDK) and Firestore.
*   **Browser APIs:** Native `window.SpeechRecognition` and `window.speechSynthesis` APIs for a seamless, zero-dependency voice experience, alongside `localStorage` for client session persistence.

---

## 💾 State Persistence & Firestore Schema

### Client Persistence
The platform utilizes React Context (`StudyContext`) backed by `localStorage` synchronization. This ensures that your active PDF text, extracted topics, and selected chapter persist seamlessly across page refreshes without needing to re-upload.

### Firestore Collections
When authenticated, the app writes to the following Firestore collections:
1.  `flashcard_decks`
    ```typescript
    {
      userId: string;
      topic: string;
      cards: Array<{ front: string; back: string }>;
      createdAt: string; // ISO String
    }
    ```
2.  `exam_attempts`
    ```typescript
    {
      userId: string;
      topic: string;
      score: number; // 0 to 100
      correctCount: number;
      totalQuestions: number;
      userAnswers: Array<number>;
      createdAt: string; // ISO String
    }
    ```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18.x or higher) installed.

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory and configure your keys:

```bash
# Groq AI Key
GROQ_API_KEY=gsk_your_groq_api_key_here

# Firebase Configuration (Public Credentials)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies
Run the following command to download packages:
```bash
npm install
```

### 4. Run the Development Server
Launch the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
To build and verify compilation for deployment:
```bash
npm run build
npm run start
```

---

## 💡 Engineering Highlights

*   **Graceful Degradation:** The Firebase authentication and Firestore saving layer is designed to fail-soft. If API keys are missing or not configured during local development, the app will safely bypass database operations rather than failing, allowing full local usage in-memory.
*   **Client/Server Boundaries:** Heavy operations like PDF ingestion (`pdf-parse`) and Groq AI calls are strictly isolated in Server Actions, securing API keys from the browser and keeping the client-side bundle size minimal.
*   **iOS Zoom Prevention:** Increased input font-size to 16px to prevent mobile iOS viewports from zooming in on input focus, preserving layout styling.
*   **Bouncing Scroll Elimination:** Isolated scroll boxes (`overscroll-contain`) combined with absolute body boundaries (`overflow-hidden`) prevent scrolling bleed on mobile viewports.
