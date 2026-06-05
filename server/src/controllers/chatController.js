import ChatMessage from '../models/ChatMessage.js';
import * as geminiService from '../services/geminiService.js';
import * as gamificationService from '../services/gamificationService.js';

// @desc    Send a message and get AI response
// @route   POST /api/chat/message
// @access  Protected
export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user._id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    if (message.length > 500) {
      return res.status(400).json({ message: 'Message cannot exceed 500 characters' });
    }

    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }

    // Call the Gemini service
    const aiResponse = await geminiService.chat(userId, message.trim(), sessionId);

    // Award small gems for engagement
    await gamificationService.awardGems(userId, 2, 'chat_interaction');

    res.json({
      response: aiResponse,
      sessionId,
    });
  } catch (error) {
    // Handle Gemini-specific errors
    if (error.message?.includes('RATE_LIMIT') || error.message?.includes('429')) {
      return res.status(429).json({
        message: 'AI service is busy. Please try again in a moment.',
      });
    }
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to get AI response. Please try again.' });
  }
};

// @desc    Get chat history for a session
// @route   GET /api/chat/history
// @access  Protected
export const getHistory = async (req, res) => {
  try {
    const { sessionId, limit = 50 } = req.query;
    const userId = req.user._id;

    const filter = { user: userId };
    if (sessionId) filter.sessionId = sessionId;

    const messages = await ChatMessage.find(filter)
      .sort({ createdAt: 1 })
      .limit(parseInt(limit))
      .select('role content sessionId createdAt');

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Protected
export const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const userId = req.user._id;

    const filter = { user: userId };
    if (sessionId) filter.sessionId = sessionId;

    await ChatMessage.deleteMany(filter);

    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
