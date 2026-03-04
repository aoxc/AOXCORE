import React from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export const SentinelGuard = () => {
  const logs = useAoxcStore((state) => state.logs);

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border-l border-white/10 p-4 font-mono text-xs">
      <div className="flex items-center gap-2 mb-4 text-emerald-400 border-b border-emerald-400/20 pb-2">
        <ShieldCheck size={16} />
        <span className="uppercase tracking-widest font-bold">Sentinel Guard</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "p-2 rounded border transition-colors",
                log.type === 'ai' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" :
                log.type === 'warning' ? "bg-amber-500/10 border-amber-500/30 text-amber-300" :
                log.type === 'error' ? "bg-red-500/10 border-red-500/30 text-red-300" :
                "bg-white/5 border-white/10 text-white/60"
              )}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="break-words">{log.message}</span>
                <span className="opacity-30 text-[10px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 pt-2 border-t border-white/10 flex items-center gap-2 text-white/40">
        <Terminal size={12} />
        <span>AoxcSentinel v1.0.4-stable</span>
      </div>
    </div>
  );
};
