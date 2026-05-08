# 🏛️ The Socratic

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Groq](https://img.shields.io/badge/AI_Powered-Groq_Llama--3-f55036?style=for-the-badge)

**The Socratic** is an intelligent, high-fidelity EdTech platform that transforms static study materials into interactive, AI-driven learning experiences. It shifts the paradigm of AI from "giving you the answers" to actively guiding your brain to figure them out.

Built with performance and user experience in mind, this platform is an exploration of integrating Large Language Models natively into modern web applications using cutting-edge APIs.

---

## ✨ Core Features

*   📄 **AI Document Ingestion (PDF-Centric Flow)**
    Upload any PDF textbook, lecture transcript, or syllabus. The application parses the document locally, and a Groq-powered Llama-3 model extracts the core chapters to build a custom study context.
*   🎙️ **The Socratic Voice Tutor (Web Speech API)**
    An interactive, voice-to-voice AI tutor. Instead of spoon-feeding answers, it uses the Socratic method to ask leading questions based on your specific document context. Features real-time Speech-to-Text (STT), smart 5-second silence detection, and native Text-to-Speech (TTS).
*   🗂️ **Instant Contextual Flashcards**
    Dynamically generates beautiful, interactive flashcards based strictly on the active context of your uploaded material.
*   🧠 **Blind Mock Exams & Analytics**
    Generates dynamic, multiple-choice exams. Upon completion, the system grades the exam and visualizes your weak points using custom UI charts, allowing you to focus your revision.
*   🔐 **Secure Authentication**
    Full Email & Password authentication backed by Firebase, allowing users to securely log in and maintain their learning context.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend:** Next.js (App Router), React 19, Tailwind CSS v4, Framer Motion (for fluid micro-animations and layout transitions).
*   **Backend & Server Actions:** Next.js Server Actions handle secure API calls and complex logic (like PDF parsing and AI extraction) without exposing secrets to the client.
*   **AI Engine:** Groq SDK utilizing `llama-3.3-70b-versatile` for lightning-fast, high-accuracy contextual generation.
*   **Database & Auth:** Firebase Authentication (Client SDK) and Firestore.
*   **Browser APIs:** Leverages the native `window.SpeechRecognition` and `window.speechSynthesis` APIs for a seamless, zero-dependency voice experience.

---

## 🚀 Getting Started

To run this project locally, you will need Node.js and a couple of API keys.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sivanand9061/Socratic.git
   cd Socratic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💡 Engineering Highlights

*   **Graceful Degradation:** The Firebase authentication layer is designed to gracefully degrade. If API keys are missing during local development, the app will safely bypass the crash rather than failing entirely.
*   **Client/Server Boundaries:** Heavy operations like PDF ingestion (`pdf-parse`) and Groq AI calls are strictly isolated in Next.js Server Actions to protect API keys and reduce the client-side bundle size.
*   **Complex UI State Management:** Employs the React Context API (`StudyContext`) to act as the "Source of Truth", seamlessly persisting the parsed PDF text and active study topics across the Flashcard, Voice Tutor, and Exam Simulator features without redundant prop-drilling.
