import React from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion } from 'motion/react';
import { Activity, Cpu, Clock, Shield, Globe, Menu, PanelRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Pulse = () => {
  const { blockNumber, epochTime, toggleMobileMenu, toggleRightPanel } = useAoxcStore();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-4 md:gap-8 relative z-10">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-white font-mono font-bold tracking-tighter text-lg leading-none uppercase whitespace-nowrap overflow-hidden text-ellipsis">AOXC OS</h1>
              <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] text-cyan-400 font-bold tracking-widest flex-shrink-0">V2.0</span>
            </div>
            <p className="text-white/20 text-[9px] font-mono uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden text-ellipsis mt-1">
              Neural Governance Engine
            </p>
          </div>
        </div>

        <div className="hidden md:block h-8 w-px bg-white/10" />

        <div className="hidden md:flex items-center gap-6 font-mono">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Block Height</span>
            <motion.span 
              key={blockNumber}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-400 font-bold text-sm tabular-nums"
            >
              #{blockNumber.toLocaleString()}
            </motion.span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Network Load</span>
            <div className="flex items-center gap-2">
              <Activity size={10} className="text-blue-500" />
              <span className="text-white font-bold text-sm tabular-nums">1.2ms</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">AI Sentinel</span>
            <div className="flex items-center gap-2">
              <Shield size={10} className="text-purple-500" />
              <span className="text-white font-bold text-sm uppercase tracking-tighter">Active</span>
            </div>
          </div>
        </div>
      </div>

        <div className="flex items-center gap-2 md:gap-6 relative z-10">
        {/* Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
        >
          <Globe size={12} className="text-cyan-500 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{i18n.language === 'en' ? 'TR' : 'EN'}</span>
        </button>

        <button 
          onClick={toggleRightPanel}
          className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <PanelRight size={20} />
        </button>

        <div className="hidden md:flex flex-col items-end font-mono">
          <span className="text-[9px] text-white/40 uppercase tracking-widest">Blockchain Epoch Time</span>
          <div className="flex items-center gap-2 text-cyan-400 font-bold tabular-nums">
            <Clock size={12} />
            <motion.span
              key={epochTime}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {epochTime}
            </motion.span>
          </div>
        </div>
        <div className="hidden md:block h-8 w-px bg-white/10" />
        <div className="hidden md:flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
          <span className="text-xs text-cyan-500 font-mono font-bold tracking-widest">SYNCED</span>
        </div>
      </div>
    </div>
  );
};
