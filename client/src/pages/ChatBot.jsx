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

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
    setMessages(prev => [...prev, { role: 'user', content: trimmed, timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await chatAPI.sendMessage(trimmed, sessionId);
      setMessages(prev => [...prev, { role: 'model', content: res.data.response, timestamp: new Date() }]);
    } catch (error) {
      const errorMsg = error.response?.status === 429
        ? "I'm a bit busy right now. Please try again in a moment! 😊"
        : "Sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'model', content: errorMsg, timestamp: new Date(), isError: true }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const clearChat = async () => {
    try { await chatAPI.clearHistory(sessionId); setMessages([{ role: 'model', content: "Chat cleared! 🧹 How can I help you?", timestamp: new Date() }]); }
    catch (error) { console.error('Failed to clear chat:', error); }
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
            <Bot className="text-teal-600" size={18} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">RoadSync AI</h1>
            <p className="text-xs text-green-600 font-medium">● Online</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Clear chat">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gray-50 min-h-0">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2.5 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'user' ? 'bg-teal-600' : 'bg-white border border-gray-200'
              }`}>
                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-teal-600" />}
              </div>
              <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-sm'
                  : msg.isError
                    ? 'bg-red-50 text-red-600 border border-red-200 rounded-tl-sm'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[11px] mt-1.5 ${msg.role === 'user' ? 'text-teal-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <Bot size={14} className="text-teal-600" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-xl rounded-tl-sm">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Ask about traffic, parking, emissions..."
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors outline-none"
            maxLength={500} disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={!input.trim() || isLoading}
            className="p-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-40">
            <Send size={16} />
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 text-center">{input.length}/500</p>
      </div>
    </div>
  );
}
