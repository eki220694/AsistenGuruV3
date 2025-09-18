import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, LessonPlan } from '../types';
import api from './apiService';

// Initialize Gemini AI with API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const generateLessonPlanIdea = async (topic: string, gradeLevel: string): Promise<Omit<LessonPlan, 'id' | 'date' | 'title' | 'topic'>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Buat rencana pelajaran untuk kelas ${gradeLevel} tentang topik "${topic}". Rencana pelajaran harus mencakup: Tujuan Pembelajaran, Materi yang Diperlukan, rencana Kegiatan langkah-demi-langkah, dan metode Penilaian.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Daftar tujuan pembelajaran.'
            },
            materials: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Daftar materi yang dibutuhkan.'
            },
            activities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Kegiatan langkah-demi-langkah untuk pelajaran.'
            },
            assessment: {
              type: Type.STRING,
              description: 'Metode untuk menilai pemahaman siswa.'
            }
          },
          required: ["objectives", "materials", "activities", "assessment"]
        },
      },
    });
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw new Error("Gagal membuat rencana pelajaran dari AI.");
  }
};

export const generateQuizQuestions = async (topic: string, count: number): Promise<QuizQuestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Berdasarkan topik "${topic}", buat ${count} soal kuis pilihan ganda. Setiap soal harus memiliki 4 pilihan, dengan hanya satu jawaban yang benar.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                           type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswer: { type: Type.STRING }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        }
                    },
                    required: ["questions"]
                }
            }
        });

        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.questions;
    } catch (error) {
        console.error("Error generating quiz questions:", error);
        throw new Error("Gagal membuat soal kuis dari AI.");
    }
};

// New function to save lesson plan to backend
export const saveLessonPlan = async (lessonPlan: Omit<LessonPlan, 'id'>) => {
  try {
    const response = await api.post('/lessons', lessonPlan);
    return response.data.lesson;
  } catch (error) {
    console.error("Error saving lesson plan:", error);
    throw new Error("Gagal menyimpan rencana pelajaran.");
  }
};

// New function to save quiz to backend
export const saveQuiz = async (quiz: Omit<Quiz, 'id'>) => {
  try {
    const response = await api.post('/quizzes', quiz);
    return response.data.quiz;
  } catch (error) {
    console.error("Error saving quiz:", error);
    throw new Error("Gagal menyimpan kuis.");
  }
};