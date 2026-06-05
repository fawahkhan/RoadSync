import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../lib/api';
import { Send, Bot, User, Trash2, Loader2 } from 'lucide-react';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    setMessages([{
      role: 'model',
      content: "Hello! 👋 I'm your RoadSync Assistant. I can help you with:\n\n🚗 Traffic & route optimization\n🅿️ Parking information\n🌱 CO₂ emission tips\n🛡️ Road safety advice\n🏥 Finding nearby services\n\nHow can I help you today?",
      timestamp: new Date(),
    }]);
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add user message immediately (optimistic update)
    const userMessage = {
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await chatAPI.sendMessage(trimmed, sessionId);
      const aiMessage = {
        role: 'model',
        content: res.data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMsg = error.response?.status === 429
        ? "I'm a bit busy right now. Please try again in a moment! 😊"
        : "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, {
        role: 'model',
        content: errorMsg,
        timestamp: new Date(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await chatAPI.clearHistory(sessionId);
      setMessages([{
        role: 'model',
        content: "Chat cleared! 🧹 How can I help you?",
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="text-blue-600" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">RoadSync Assistant</h1>
            <p className="text-xs text-green-500">● Online</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {msg.role === 'user'
                  ? <User size={16} className="text-white" />
                  : <Bot size={16} className="text-gray-600" />
                }
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : msg.isError
                    ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Bot size={16} className="text-gray-600" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about traffic, parking, emissions..."
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {input.length}/500 characters
        </p>
      </div>
    </div>
  );
}
