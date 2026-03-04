import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldCheck, Cpu, Wifi } from 'lucide-react';

export const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [steps, setSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLines = [
    "INITIALIZING AOXC NEURAL KERNEL v2.0...",
    "LOADING CORE MODULES [MEM, CPU, NET]...",
    "ESTABLISHING SECURE HANDSHAKE...",
    "VERIFYING INTEGRITY HASHES...",
    "MOUNTING VIRTUAL FILE SYSTEM...",
    "CONNECTING TO XLAYER-RETH NODE...",
    "SYNCING LEDGER STATE...",
    "STARTING SENTINEL AI WATCHDOG...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep >= bootLines.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }

      setSteps(prev => [...prev, bootLines[currentStep]]);
      setProgress(((currentStep + 1) / bootLines.length) * 100);
      currentStep++;
    }, 150); // Speed of lines

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono text-cyan-500 overflow-hidden"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-md p-8 relative">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
        
        <div className="flex items-center justify-center mb-12">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 border-2 border-cyan-500 rounded-full flex items-center justify-center relative"
          >
            <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-ping opacity-20" />
            <ShieldCheck size={32} />
          </motion.div>
        </div>

        <div className="space-y-2 mb-8 min-h-[200px]">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs md:text-sm flex items-center gap-3"
            >
              <span className="text-cyan-500/50">{`>`}</span>
              <span className={i === steps.length - 1 ? "text-cyan-400 font-bold" : "text-cyan-500/70"}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-cyan-900/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-[10px] text-cyan-500/40 uppercase tracking-widest">
          <span>Bootloader v2.4.1</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </motion.div>
  );
};
