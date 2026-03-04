import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAoxcStore } from '../store/useAoxcStore';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export const Toaster = () => {
  const { notifications } = useAoxcStore();

  const icons = {
    info: <Info size={16} className="text-cyan-500" />,
    warning: <AlertCircle size={16} className="text-amber-500" />,
    error: <XCircle size={16} className="text-rose-500" />,
    success: <CheckCircle2 size={16} className="text-emerald-500" />,
  };

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={cn(
              "relative p-4 rounded-xl border bg-black/90 backdrop-blur-xl shadow-2xl flex items-start gap-4 min-w-[300px] max-w-[400px] pointer-events-auto overflow-hidden group",
              n.type === 'info' ? "border-cyan-500/20 shadow-cyan-500/10" :
              n.type === 'warning' ? "border-amber-500/20 shadow-amber-500/10" :
              n.type === 'error' ? "border-rose-500/20 shadow-rose-500/10" :
              "border-emerald-500/20 shadow-emerald-500/10"
            )}
          >
            {/* Progress Bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 h-0.5",
                n.type === 'info' ? "bg-cyan-500" :
                n.type === 'warning' ? "bg-amber-500" :
                n.type === 'error' ? "bg-rose-500" :
                "bg-emerald-500"
              )}
            />

            <div className={cn(
              "p-2 rounded-lg shrink-0",
              n.type === 'info' ? "bg-cyan-500/10 text-cyan-500" :
              n.type === 'warning' ? "bg-amber-500/10 text-amber-500" :
              n.type === 'error' ? "bg-rose-500/10 text-rose-500" :
              "bg-emerald-500/10 text-emerald-500"
            )}>
              {icons[n.type]}
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  n.type === 'info' ? "text-cyan-400" :
                  n.type === 'warning' ? "text-amber-400" :
                  n.type === 'error' ? "text-rose-400" :
                  "text-emerald-400"
                )}>
                  {n.type} Alert
                </span>
                <span className="text-[9px] text-white/20 font-mono">NOW</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mt-1 font-medium">{n.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
