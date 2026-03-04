import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAoxcStore } from '../store/useAoxcStore';
import { 
  Cpu, 
  Activity, 
  Send, 
  Shield, 
  Zap, 
  Database, 
  Lock, 
  Globe,
  Terminal,
  Volume2,
  VolumeX,
  Mic
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AoxcanInterface = () => {
  const { chatMessages, addChatMessage, networkStatus, blockNumber } = useAoxcStore();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiState, setAiState] = useState<'idle' | 'processing' | 'analyzing' | 'speaking'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isThinking]);

  // Initialize speech
  useEffect(() => {
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance();
      u.rate = 1.1; // Slightly faster
      u.pitch = 0.9; // Slightly deeper
      u.volume = 1;
      speechRef.current = u;
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (isMuted || !speechRef.current) return;
    
    window.speechSynthesis.cancel();
    speechRef.current.text = text;
    
    // Try to find a good "tech" voice
    const voices = window.speechSynthesis.getVoices();
    const techVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices[0];
    if (techVoice) speechRef.current.voice = techVoice;

    speechRef.current.onstart = () => setAiState('speaking');
    speechRef.current.onend = () => setAiState('idle');
    
    window.speechSynthesis.speak(speechRef.current);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addChatMessage(input, 'user');
    setInput('');
    setIsThinking(true);
    setAiState('processing');

    // Simulate AI processing
    setTimeout(() => {
      setAiState('analyzing');
      setTimeout(() => {
        const responses = [
          "Analyzing ledger integrity... No anomalies detected in the last 12 blocks.",
          "I've optimized the gas routing for the pending transaction pool. Efficiency increased by 4.2%.",
          "Access control protocols are holding steady. Sentinel is active.",
          "Governance proposal #42 requires your attention. Shall I summarize the impact analysis?",
          "My neural link to the XLayer node is stable. Latency is at 1.2ms.",
          "I am AOXCAN. I see all transactions. Your request is being processed.",
          "Warning: Slight variance in the treasury checksum. Re-verifying now... Match confirmed."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        addChatMessage(randomResponse, 'ai');
        speak(randomResponse);
        
        setIsThinking(false);
        if (isMuted) {
             setAiState('speaking'); // Visual feedback even if muted
             setTimeout(() => setAiState('idle'), 2000);
        }
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex-1 h-full bg-[#030303] text-white flex overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Left Panel: AI Core Visualization */}
      <div className="w-80 border-r border-white/10 bg-black/40 backdrop-blur-sm flex flex-col p-6 relative z-10">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black font-mono tracking-tighter text-cyan-500 mb-1">AOXCAN</h2>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Neural Avatar v2.0</span>
          </div>
          <button 
            onClick={() => {
                setIsMuted(!isMuted);
                window.speechSynthesis.cancel();
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-500 transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* The Core Animation - FACE */}
        <div className="flex-1 flex flex-col items-center justify-center relative mb-8">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Holographic Projection Rays */}
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-purple-500/10 to-transparent opacity-50 blur-xl" />
            
            {/* Outer Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-blue-500/10 rounded-full border-dashed"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border border-pink-500/20 rounded-full border-dotted"
            />
            
            {/* THE FACE - FRIENDLY ROBOT */}
            <div className="relative z-10 w-48 h-48">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_20px_rgba(200,250,1,0.4)]">
                    <defs>
                        <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#C8FA01" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#A6D100" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Head Shape */}
                    <motion.rect
                        x="40" y="40" width="120" height="100" rx="30"
                        fill="url(#faceGrad)"
                        stroke="#C8FA01"
                        strokeWidth="2"
                        initial={{ scale: 0.9 }}
                        animate={{ 
                            scale: 1, 
                            y: [0, -5, 0],
                            rotate: aiState === 'processing' ? [0, 2, -2, 0] : 0
                        }}
                        transition={{ 
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 0.5, repeat: Infinity }
                        }}
                    />

                    {/* Antenna */}
                    <motion.line x1="100" y1="40" x2="100" y2="20" stroke="#C8FA01" strokeWidth="2" />
                    <motion.circle 
                        cx="100" cy="15" r="6" 
                        fill={aiState === 'processing' || aiState === 'analyzing' ? "#EC4899" : "#C8FA01"} 
                        animate={{ opacity: [0.4, 1, 0.4] }} 
                        transition={{ duration: 1, repeat: Infinity }} 
                    />

                    {/* Eyes Container */}
                    <g transform="translate(0, 10)">
                        {/* Left Eye */}
                        <motion.ellipse
                            cx="70" cy="80" rx="12" ry="16"
                            fill="#3B82F6"
                            animate={{
                                scaleY: aiState === 'processing' ? [1, 0.1, 1] : 1, // Blink fast when thinking
                                ry: aiState === 'speaking' ? [16, 14, 16] : 16 // Squint slightly when talking
                            }}
                            transition={{ 
                                duration: 0.2, 
                                repeat: aiState === 'processing' ? Infinity : 0, 
                                repeatDelay: aiState === 'processing' ? 0.1 : 0 
                            }}
                        />
                        {/* Right Eye */}
                        <motion.ellipse
                            cx="130" cy="80" rx="12" ry="16"
                            fill="#3B82F6"
                            animate={{
                                scaleY: aiState === 'processing' ? [1, 0.1, 1] : 1,
                                ry: aiState === 'speaking' ? [16, 14, 16] : 16
                            }}
                            transition={{ 
                                duration: 0.2, 
                                repeat: aiState === 'processing' ? Infinity : 0, 
                                repeatDelay: aiState === 'processing' ? 0.1 : 0 
                            }}
                        />
                        
                        {/* Eye Highlights (Sparkle) */}
                        <circle cx="74" cy="74" r="3" fill="white" opacity="0.8" />
                        <circle cx="134" cy="74" r="3" fill="white" opacity="0.8" />
                    </g>

                    {/* Cheeks (Blush) */}
                    <circle cx="55" cy="105" r="8" fill="#EC4899" opacity="0.4" />
                    <circle cx="145" cy="105" r="8" fill="#EC4899" opacity="0.4" />

                    {/* Mouth - Animated Smile */}
                    <motion.path
                        d="M 80 115 Q 100 135 120 115" // Base Smile
                        fill="none"
                        stroke="#C8FA01"
                        strokeWidth="3"
                        strokeLinecap="round"
                        animate={{
                            d: aiState === 'speaking'
                                ? [
                                    "M 80 115 Q 100 135 120 115", // Closed Smile
                                    "M 80 115 Q 100 145 120 115", // Open Mouth (Happy)
                                    "M 85 120 Q 100 130 115 120"  // Smaller Mouth
                                  ]
                                : "M 80 115 Q 100 135 120 115" // Resting Smile
                        }}
                        transition={{ 
                            duration: 0.3, 
                            repeat: aiState === 'speaking' ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    />
                </svg>
            </div>
          </div>

          {/* Status Text */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                aiState === 'idle' ? "bg-cyan-500" :
                aiState === 'processing' ? "bg-purple-500" :
                "bg-pink-500"
              )} />
              <span className="text-xs font-mono uppercase tracking-widest text-white/60">
                {aiState === 'idle' ? 'ONLINE & READY' : 
                 aiState === 'processing' ? 'THINKING...' : 
                 aiState === 'analyzing' ? 'SCANNING...' : 'SPEAKING'}
              </span>
            </div>
            <p className="text-[10px] text-white/30 max-w-[200px] mx-auto leading-relaxed">
              Audio Output: {isMuted ? 'MUTED' : 'ACTIVE'}
            </p>
          </div>
        </div>

        {/* System Metrics */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <MetricRow label="Cognitive Load" value="12%" icon={Cpu} />
          <MetricRow label="Network Latency" value="1.2ms" icon={Activity} />
          <MetricRow label="Security Level" value="MAXIMUM" icon={Shield} color="text-emerald-500" />
        </div>
      </div>

      {/* Center Panel: Communication Stream */}
      <div className="flex-1 flex flex-col relative z-0">
        {/* Chat Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-cyan-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/60">Secure Uplink // Encrypted</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <Globe size={12} className="text-cyan-500" />
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">Online</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" ref={scrollRef}>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-3xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border overflow-hidden",
                msg.role === 'ai' 
                  ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                  : "bg-white/5 border-white/10 text-white/40"
              )}>
                {msg.role === 'ai' ? (
                   <svg viewBox="0 0 100 100" className="w-8 h-8">
                       <path d="M20,30 Q50,10 80,30 L85,60 Q85,90 50,100 Q15,90 15,60 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                       <circle cx="35" cy="45" r="2" fill="currentColor" />
                       <circle cx="65" cy="45" r="2" fill="currentColor" />
                       <path d="M40,75 Q50,80 60,75" fill="none" stroke="currentColor" strokeWidth="2" />
                   </svg>
                ) : <div className="w-5 h-5 bg-white/20 rounded-full" />}
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "p-4 rounded-2xl border text-sm leading-relaxed font-mono",
                msg.role === 'ai' 
                  ? "bg-cyan-950/10 border-cyan-500/20 text-cyan-100 rounded-tl-none" 
                  : "bg-white/5 border-white/10 text-white/80 rounded-tr-none"
              )}>
                <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
                  <span>{msg.role === 'ai' ? 'AOXCAN' : 'OPERATOR'}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 max-w-3xl"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
              </div>
              <div className="flex items-center gap-1 h-10 px-4">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter command or query for AOXCAN..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 pr-14 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isThinking}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[9px] text-white/20 uppercase tracking-[0.2em]">
              Authorized Personnel Only • Level {useAoxcStore.getState().permissionLevel} Clearance
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel: Live Context */}
      <div className="w-72 border-l border-white/10 bg-black/20 backdrop-blur-sm hidden xl:flex flex-col p-6">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Active Context</h3>
        
        <div className="space-y-4">
          <ContextCard 
            title="Ledger State" 
            status="Synced" 
            detail={`Block #${blockNumber}`}
            icon={Database}
          />
          <ContextCard 
            title="Sentinel Protocol" 
            status="Active" 
            detail="Scanning Mempool"
            icon={Shield}
            active
          />
          <ContextCard 
            title="Treasury" 
            status="Secure" 
            detail="Multi-sig Active"
            icon={Lock}
          />
          <ContextCard 
            title="Network" 
            status="Optimal" 
            detail="Gas: 12 Gwei"
            icon={Zap}
          />
        </div>

        <div className="mt-auto p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Activity size={16} className="text-cyan-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">System Insight</h4>
              <p className="text-[10px] text-cyan-500/60 leading-relaxed">
                AOXCAN is currently optimizing the validator node selection algorithm based on recent latency spikes in the Asia region.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricRow = ({ label, value, icon: Icon, color = "text-cyan-400" }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3 text-white/40 group-hover:text-white/60 transition-colors">
      <Icon size={14} />
      <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
    </div>
    <span className={cn("text-xs font-mono font-bold", color)}>{value}</span>
  </div>
);

const ContextCard = ({ title, status, detail, icon: Icon, active }: any) => (
  <div className={cn(
    "p-4 rounded-xl border transition-all",
    active ? "bg-cyan-500/10 border-cyan-500/30" : "bg-white/5 border-white/5 hover:border-white/10"
  )}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon size={14} className={active ? "text-cyan-400" : "text-white/40"} />
        <span className={cn("text-[10px] font-bold uppercase tracking-wider", active ? "text-cyan-100" : "text-white/60")}>
          {title}
        </span>
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
    </div>
    <div className="flex justify-between items-end">
      <span className="text-[11px] text-white/40">{detail}</span>
      <span className={cn("text-[9px] font-bold uppercase", active ? "text-cyan-500" : "text-white/20")}>
        {status}
      </span>
    </div>
  </div>
);
