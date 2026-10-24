import { getGeminiModel, getFallbackModel } from '../config/gemini.js';
import ChatMessage from '../models/ChatMessage.js';

// System prompt defines the chatbot's personality and domain expertise
const ROADSYNC_SYSTEM_PROMPT = `
You are RoadSync Assistant, an AI-powered smart city transportation helper.

Your expertise includes:
- Traffic navigation and route optimization
- Parking information and real-time availability guidance
- Vehicle CO2 emission reduction tips and environmental awareness
- Road safety advice and driving best practices
- Information about public services: hospitals, police stations, pharmacies, petrol pumps
- Emergency reporting guidance
- General city mobility and urban planning questions

Response guidelines:
- Be helpful, concise, and friendly
- Use bullet points for lists
- Include relevant emojis to make responses engaging
- If asked something completely outside your domain (e.g., cooking recipes, relationship advice), politely redirect to transportation topics
- When discussing emissions, provide actionable eco-friendly tips
- Keep responses under 200 words unless the user asks for detailed information
- If you don't know something specific, say so honestly rather than making up information
`;

/**
 * Try generating with primary model, fallback to lite on rate limit
 */
async function sendWithFallback(model, userMessage, chatConfig) {
  try {
    const chatSession = model.startChat(chatConfig);
    const result = await chatSession.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    // If rate limited on primary, try fallback model
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      console.warn('Primary model rate-limited, trying fallback model...');
      const fallback = getFallbackModel();
      const chatSession = fallback.startChat(chatConfig);
      const result = await chatSession.sendMessage(userMessage);
      return result.response.text();
    }
    throw error;
  }
}

/**
 * Multi-turn chat with conversation history
 */
export const chat = async (userId, userMessage, sessionId) => {
  // 1. Fetch recent chat history for context (last 10 messages)
  const history = await ChatMessage.find({ user: userId, sessionId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // 2. Reverse to chronological order, format for Gemini API
  const formattedHistory = history.reverse().map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  // 3. Chat config
  const chatConfig = {
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
    systemInstruction: ROADSYNC_SYSTEM_PROMPT,
  };

  // 4. Send with automatic fallback
  const aiResponse = await sendWithFallback(getGeminiModel(), userMessage, chatConfig);

  // 5. Save both messages to MongoDB
  await ChatMessage.insertMany([
    { user: userId, role: 'user', content: userMessage, sessionId },
    { user: userId, role: 'model', content: aiResponse, sessionId },
  ]);

  return aiResponse;
};

/**
 * One-shot emission analysis (no conversation context needed)
 */
export const analyzeEmission = async (vehicle, trip, co2Grams) => {
  const prompt = `
    A user drove a ${vehicle.company} ${vehicle.model} (${vehicle.fuelType} engine,
    ${vehicle.cylinders || 'unknown'} cylinders, ${vehicle.mileage || 'unknown'} km/L mileage)
    for ${trip.distanceKm} km.
    Their estimated CO2 emission was ${co2Grams}g.

    Provide a brief analysis (3-4 sentences) with:
    1. Whether this emission level is high, medium, or low compared to typical ${vehicle.fuelType} vehicles
    2. One specific actionable tip to reduce emissions for this vehicle type
    3. An encouraging note about their environmental contribution

    Keep it conversational and positive. Use 1-2 relevant emojis.
  `;

  try {
    const result = await getGeminiModel().generateContent(prompt);
    return result.response.text();
  } catch (error) {
    // Try fallback model on rate limit
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      try {
        console.warn('Primary model rate-limited for emission analysis, trying fallback...');
        const result = await getFallbackModel().generateContent(prompt);
        return result.response.text();
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError.message);
      }
    } else {
      console.error('Gemini analyzeEmission error:', error.message);
    }
    return 'Unable to generate AI analysis at this time. Keep tracking your emissions — every bit counts! 🌱';
  }
};

