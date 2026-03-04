import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { useAoxcStore } from '../store/useAoxcStore';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

export const SentinelChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { chatMessages, addChatMessage } = useAoxcStore();
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    addChatMessage(userMsg, 'user');

    // Call Gemini API
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are Gemini Sentinel, the AI core of AOXC Neural OS. 
        The system skeleton consists of 35 contracts across 9 modules:
        - Core: Registry, Nexus, Core
        - Access: Gateway, Sentinel
        - Finance: Change, Cpex, Vault
        - Gov: AuditVoice, DaoManager
        - Infra: AutoRepair, Build, Clock, Factory
        
        The user is asking: "${userMsg}". 
        Provide a concise, technical, and helpful response in the style of a high-tech OS assistant. 
        Reference specific contracts if relevant. Keep it under 3 sentences.`,
      });
      
      const aiResponse = response.text || "I'm sorry, I couldn't process that request at the moment.";
      addChatMessage(aiResponse, 'ai');
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      addChatMessage("Neural connection interrupted. Please retry.", 'ai');
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 h-[450px] bg-zinc-950 border border-cyan-500/30 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-cyan-500/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <Bot size={14} className="text-black" />
                </div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Sentinel Chat</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === 'user' ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-3 rounded-2xl text-[11px] leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-cyan-500 text-black font-medium rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-white/80 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[8px] text-white/20 mt-1 uppercase">
                    {msg.role === 'ai' ? 'Sentinel' : 'Operator'}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Sentinel..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 pr-10 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500 hover:text-cyan-400 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
          isOpen ? "bg-rose-500 rotate-90" : "bg-cyan-500 shadow-cyan-500/20"
        )}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-black" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#050505] animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};
