import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;
let _primaryModel;
let _fallbackModel;

function getGenAI() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

// Primary model — fast and capable
export function getGeminiModel() {
  if (!_primaryModel) {
    _primaryModel = getGenAI().getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return _primaryModel;
}

// Fallback model — lighter, separate quota pool
export function getFallbackModel() {
  if (!_fallbackModel) {
    _fallbackModel = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return _fallbackModel;
}

// Keep backward-compatible export
export const geminiModel = new Proxy({}, {
  get(_, prop) {
    return getGeminiModel()[prop];
  }
});

export default { getGenAI, getGeminiModel, getFallbackModel };
