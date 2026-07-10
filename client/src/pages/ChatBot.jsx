import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../lib/api';
import { Send, Bot, User, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  useEffect(() => {
    setMessages([{
      role: 'model',
      content: "Hello! 👋 I'm RoadSync AI. I can help you optimize routes, find parking, track emissions, and more. How can I assist you today?",
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
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't process that.", timestamp: new Date(), isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-8">
      <Card className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
              <AvatarFallback className="bg-primary/10 text-primary"><Bot size={20}/></AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-semibold text-foreground">RoadSync Assistant</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-muted-foreground">Always Online</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMessages([])} className="text-muted-foreground hover:text-destructive">
            <Trash2 size={18} />
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                  {msg.role === 'user' 
                    ? <AvatarFallback className="bg-primary text-primary-foreground"><User size={16}/></AvatarFallback>
                    : <AvatarFallback className="bg-secondary text-secondary-foreground"><Bot size={16}/></AvatarFallback>
                  }
                </Avatar>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : msg.isError
                      ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-sm'
                      : 'bg-secondary text-secondary-foreground border border-border/50 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-3 max-w-[85%]"
              >
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                  <AvatarFallback className="bg-secondary text-secondary-foreground"><Bot size={16}/></AvatarFallback>
                </Avatar>
                <div className="px-5 py-4 rounded-2xl bg-secondary rounded-tl-sm flex gap-1.5 items-center">
                  <motion.div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" animate={{y: [0,-4,0]}} transition={{duration:0.6, repeat:Infinity}} />
                  <motion.div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" animate={{y: [0,-4,0]}} transition={{duration:0.6, delay:0.2, repeat:Infinity}} />
                  <motion.div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" animate={{y: [0,-4,0]}} transition={{duration:0.6, delay:0.4, repeat:Infinity}} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input */}
        <div className="p-4 bg-background/50 border-t border-border/50 backdrop-blur-md">
          <div className="relative flex items-center">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="Message RoadSync AI..."
              className="pr-12 py-6 rounded-xl bg-secondary/50 border-transparent focus-visible:ring-primary/30"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              className="absolute right-2 h-9 w-9 rounded-lg"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send size={16} className={input.trim() ? 'ml-0.5' : ''} />
            </Button>
          </div>
        </div>

      </Card>
    </div>
  );
}
