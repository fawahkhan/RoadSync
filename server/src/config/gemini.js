import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.0-flash for free tier — fast, capable, generous limits
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export default genAI;
