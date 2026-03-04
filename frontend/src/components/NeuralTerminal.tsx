import React, { useState, useRef, useEffect } from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, ShieldCheck, ChevronUp, ChevronDown, Command, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const NeuralTerminal = () => {
  const { logs, addLog, networkStatus, blockNumber, gasEfficiency } = useAoxcStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    addLog(`> ${input}`, 'info');

    switch (cmd) {
      case '/help':
        addLog('Available commands: /status, /clear, /scan, /version', 'ai');
        break;
      case '/status':
        addLog(`System Status: ${networkStatus.toUpperCase()} | Block: ${blockNumber} | Gas: ${gasEfficiency}%`, 'ai');
        break;
      case '/clear':
        // In a real app, we might want a clearLogs action in store
        addLog('Console buffer cleared.', 'info');
        break;
      case '/scan':
        addLog('Initiating deep system scan...', 'warning');
        setTimeout(() => addLog('Scan complete. No anomalies detected.', 'success'), 2000);
        break;
      case '/version':
        addLog('AOXC Neural OS v2.4.0-beta (Build 2026.03.03)', 'info');
        break;
      default:
        addLog(`Command not recognized: ${cmd}. Type /help for options.`, 'error');
    }
    setInput('');
  };

  return (
    <motion.div 
      animate={{ height: isExpanded ? 320 : 32 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "border-t border-white/10 bg-black/95 flex flex-col font-mono text-[10px] overflow-hidden shadow-2xl relative z-50",
        isExpanded ? "absolute bottom-0 left-0 right-0" : "relative"
      )}
    >
      {/* Header / Minimized View */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-8 flex items-center px-4 cursor-pointer hover:bg-white/5 transition-colors shrink-0"
      >
        <div className="flex items-center gap-2 text-cyan-500 border-r border-white/10 pr-4 mr-4 shrink-0">
          <Terminal size={12} />
          <span className="font-bold uppercase tracking-widest">Neural Console</span>
        </div>

        <div className="flex-1 overflow-hidden relative flex items-center">
          {!isExpanded && (
            <AnimatePresence mode="wait">
              {logs[0] && (
                <motion.div
                  key={logs[0].id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="flex items-center gap-3 truncate"
                >
                  <span className="text-white/40 shrink-0">[{new Date(logs[0].timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                  <span className={cn(
                    "truncate",
                    logs[0].type === 'ai' ? 'text-cyan-400' : 
                    logs[0].type === 'error' ? 'text-rose-500' : 
                    logs[0].type === 'success' ? 'text-emerald-500' :
                    logs[0].type === 'warning' ? 'text-amber-500' :
                    'text-white/60'
                  )}>
                    {logs[0].type === 'ai' ? 'GEMINI: ' : 'SYSTEM: '}
                    {logs[0].message}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="flex items-center gap-6 text-white/40 shrink-0 ml-4 border-l border-white/10 pl-4">
          <div className="hidden md:flex items-center gap-2">
            <Cpu size={12} className="text-emerald-500" />
            <span>RETH: 1.2ms</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ShieldCheck size={12} className="text-cyan-500" />
            <span>SENTINEL: ACTIVE</span>
          </div>
          <div className="text-white/20 hover:text-white transition-colors">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="flex-1 flex flex-col min-h-0 bg-black/50 backdrop-blur-md">
          {/* Log History */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[11px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {[...logs].reverse().map((log) => (
              <div key={log.id} className="flex gap-3 hover:bg-white/[0.02] px-2 py-0.5 rounded">
                <span className="text-white/20 shrink-0 select-none">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={cn(
                  "break-all",
                  log.type === 'ai' ? 'text-cyan-400' : 
                  log.type === 'error' ? 'text-rose-500' : 
                  log.type === 'success' ? 'text-emerald-500' :
                  log.type === 'warning' ? 'text-amber-500' :
                  'text-white/70'
                )}>
                  {log.type === 'ai' && <span className="font-bold mr-2 text-cyan-600">GEMINI_SENTINEL{'>'}</span>}
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleCommand} className="p-2 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
            <div className="text-cyan-500 pl-2">
              <Command size={14} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter system command (try /help)..."
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder:text-white/20 h-8 font-mono text-[11px]"
              autoFocus
            />
            <button 
              type="button" 
              onClick={() => setIsExpanded(false)}
              className="p-1.5 hover:bg-white/10 rounded text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </form>
        </div>
      )}
    </motion.div>
  );
};
