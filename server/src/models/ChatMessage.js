import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'model'], // Gemini's terminology: 'user' vs 'model'
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [5000, 'Message cannot exceed 5000 characters'],
  },
  sessionId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index for fast retrieval of a user's chat history within a session
chatMessageSchema.index({ user: 1, sessionId: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
