"use server";

import Groq from "groq-sdk";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI PDF Parsing & Topic Extraction
export async function parsePDF(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file uploaded");

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Use require and point directly to the lib to bypass the pdf-parse module.parent isDebugMode bug
    const pdfParse = require("pdf-parse/lib/pdf-parse.js");
    let data;
    try {
      data = await pdfParse(buffer);
    } catch (parseErr: any) {
      return { error: `PDF Parse Library Error: ${parseErr.message}` };
    }
    
    const text = data.text;
    if (!text || text.trim() === "") {
      return { error: "No text could be extracted from this PDF. It might be scanned or image-based." };
    }

    // Limit text to avoid blowing up the context window (first ~30k chars is usually enough for a table of contents/topics)
    const truncatedText = text.substring(0, 30000);

    let response;
    try {
      response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert tutor analyzing a textbook or lecture transcript. Extract the main chapters, core concepts, or topics covered in this text. Return ONLY a JSON object with an array 'topics' containing strings. Example: {\"topics\": [\"Cellular Respiration\", \"Mitosis\", \"Genetics\"]}"
          },
          {
            role: "user",
            content: `Extract topics from this text:\n\n${truncatedText}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });
    } catch (groqErr: any) {
      return { error: `Groq AI Error: ${groqErr.message}` };
    }

    const content = response.choices[0]?.message?.content || "{\"topics\": []}";
    const parsed = JSON.parse(content);
    
    return {
      text, // Return the full text to store in Context
      topics: parsed.topics || []
    };
  } catch (error: any) {
    console.error("PDF Parse/Groq Error:", error);
    return { error: `System Error: ${error.message}` };
  }
}

// AI Flashcard Generation
export async function generateFlashcards(text: string) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert tutor. Extract the core concepts from the provided text and output a JSON array of flashcards. Each flashcard must have a 'front' (question/concept) and 'back' (answer/definition). Return ONLY valid JSON array of objects, e.g. [{\"front\":\"...\",\"back\":\"...\"}]"
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" } // Using json object might require the prompt to return an object.
    });

    // Handle groq returning JSON object wrap
    let content = response.choices[0]?.message?.content || "[]";
    let parsed;
    try {
      parsed = JSON.parse(content);
      // If the model wrapped it in an object like { "flashcards": [...] }
      if (!Array.isArray(parsed) && parsed.flashcards) {
        parsed = parsed.flashcards;
      }
    } catch (e) {
      console.error("Failed to parse JSON", content);
      parsed = [];
    }

    // Attempt to save to Firebase (will fail gracefully if not configured)
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
         await addDoc(collection(db, "flashcard_decks"), {
           sourceText: text,
           cards: parsed,
           createdAt: new Date().toISOString()
         });
      }
    } catch(err) {
      console.log("Firebase not configured or failed", err);
    }

    return parsed;
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to generate flashcards");
  }
}

// AI Voice Tutor Socratic Response
export async function getTutorResponse(history: {role: "user"|"tutor", text: string}[], context?: { topic: string, text: string }) {
  try {
    const formattedHistory = history.map(h => ({
      role: h.role === "tutor" ? "assistant" as const : "user" as const,
      content: h.text
    }));

    let systemPrompt = "You are 'The Socratic', an AI voice tutor. You NEVER give direct answers. Instead, you guide the student to the answer by asking leading questions. Keep your responses short, conversational, and spoken-style.";
    
    if (context && context.topic && context.text) {
      // Provide the context to the tutor
      const truncatedText = context.text.substring(0, 5000); // Only first 5000 chars to avoid overwhelming the prompt
      systemPrompt += `\n\nYour student is currently studying the topic "${context.topic}" from the following document excerpt. Base your questions and guidance strictly on this context if applicable:\n\nDOCUMENT CONTEXT:\n${truncatedText}`;
    }

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...formattedHistory
      ],
      model: "llama-3.3-70b-versatile",
    });

    return response.choices[0]?.message?.content || "I'm having trouble thinking right now. What were we talking about?";
  } catch (error) {
    console.error("Groq Error:", error);
    return "I'm sorry, I'm having connection issues. Can you repeat that?";
  }
}

// AI Exam Generation
export async function generateExam(topic: string) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert examiner. Generate a 4-question multiple choice exam on the requested topic. Return ONLY a JSON object with an array 'questions'. Each question object must have 'category' (string), 'question' (string), 'options' (array of 4 strings), and 'correct' (integer 0-3 representing the index of the correct option). Example: {\"questions\": [{\"category\": \"Genetics\", \"question\": \"...\", \"options\": [\"A\",\"B\",\"C\",\"D\"], \"correct\": 1}]}"
        },
        {
          role: "user",
          content: `Topic: ${topic}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || "{\"questions\": []}";
    const parsed = JSON.parse(content);
    
    // Attempt to save to Firebase
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
         await addDoc(collection(db, "exams"), {
           topic,
           questions: parsed.questions,
           createdAt: new Date().toISOString()
         });
      }
    } catch(err) {
      console.log("Firebase not configured or failed", err);
    }

    return parsed.questions || [];
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to generate exam");
  }
}
