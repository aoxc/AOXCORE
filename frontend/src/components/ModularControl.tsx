import React, { useState } from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { analyzeAction, humanizeError } from '../services/geminiSentinel';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { 
  Settings, 
  Wallet, 
  Wrench, 
  ShieldAlert, 
  ArrowRightLeft, 
  Database,
  Lock,
  RefreshCw,
  Zap,
  Cpu,
  Search,
  Sparkles,
  ChevronRight,
  Info,
  Users
} from 'lucide-react';

export const ModularControl = () => {
  const { 
    addLog, 
    setProcessing, 
    isProcessing, 
    blockNumber, 
    setActiveNotary, 
    permissionLevel,
    gasEfficiency,
    networkLoad,
    repairState,
    repairTarget,
    triggerRepair,
    setActiveView
  } = useAoxcStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'core' | 'finance' | 'infra' | 'gov'>('core');
  const [command, setCommand] = useState('');

  const handleAction = async (actionName: string, module: 'Infra' | 'Finance' | 'Gov' | 'Core') => {
    if (isProcessing) return;

    // Special view triggers
    if (actionName === 'Registry Update') {
      setActiveView('registry');
      return;
    }
    if (actionName === 'Governance Proposal') {
      setActiveView('governance');
      return;
    }
    
    if (permissionLevel < 1 && module !== 'Infra') {
      const humanError = await humanizeError("ERR_UNAUTHORIZED_ACCESS");
      addLog(humanError || "Yetkisiz erişim denemesi.", 'error');
      return;
    }

    setProcessing(true);
    addLog(`Sentinel: Analyzing ${actionName} request...`, 'ai');
    
    const result = await analyzeAction(actionName, { module, blockNumber });
    
    if (result.status === 'APPROVED') {
      setActiveNotary({
        module,
        operation: actionName,
        details: { block: blockNumber, entropy: Math.random().toString(36).substr(2, 9) },
        aiAnalysis: result.verdict,
        humanTranslation: result.humanTranslation
      });
    } else {
      addLog(`Sentinel REJECTED: ${result.verdict}`, 'error');
    }
    
    setProcessing(false);
  };

  const handleAICommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;

    setProcessing(true);
    addLog(`Neural Interpreter: Processing command "${command}"...`, 'ai');
    
    // Simulate AI interpreting the command and mapping it to an action
    setTimeout(async () => {
      const result = await analyzeAction(`AI Command: ${command}`, { type: 'natural_language', blockNumber });
      addLog(`Gemini: I've interpreted your request. Proceeding with ${result.verdict}`, 'ai');
      
      setActiveNotary({
        module: 'Core',
        operation: 'AI Interpreted Action',
        details: { raw_command: command, interpreted: result.verdict },
        aiAnalysis: result.verdict,
        humanTranslation: result.humanTranslation
      });
      setCommand('');
      setProcessing(false);
    }, 1500);
  };

  const tabs = [
    { id: 'core', label: t('control.tabs.core'), icon: Settings },
    { id: 'finance', label: t('control.tabs.finance'), icon: Wallet },
    { id: 'infra', label: t('control.tabs.infra'), icon: Wrench },
    { id: 'gov', label: 'GOV', icon: Users },
  ];

  return (
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-md">
      {/* AI Command Bar */}
      <div className="p-4 border-b border-white/10 bg-cyan-500/[0.02] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <form onSubmit={handleAICommand} className="relative z-10">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <input 
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder={t('control.neural_command')}
            className="w-full bg-black/60 border border-cyan-500/20 rounded-xl py-2.5 pl-9 pr-4 text-xs font-mono text-cyan-100 placeholder:text-cyan-900/50 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all shadow-inner"
          />
        </form>
        
        {/* Gas Advice */}
        <div className={cn(
          "mt-3 flex items-start gap-2 px-3 py-2 rounded-lg border transition-all duration-500 relative z-10",
          gasEfficiency < 80 ? "bg-rose-500/10 border-rose-500/20" : 
          gasEfficiency < 90 ? "bg-amber-500/10 border-amber-500/20" : 
          "bg-emerald-500/10 border-emerald-500/20"
        )}>
          <Info size={10} className={cn(
            "mt-0.5 shrink-0",
            gasEfficiency < 80 ? "text-rose-500" : 
            gasEfficiency < 90 ? "text-amber-500" : 
            "text-emerald-500"
          )} />
          <p className={cn(
            "text-[9px] leading-tight italic font-medium",
            gasEfficiency < 80 ? "text-rose-200/80" : 
            gasEfficiency < 90 ? "text-amber-200/80" : 
            "text-emerald-200/80"
          )}>
            {gasEfficiency < 80 
              ? t('control.gas_critical')
              : gasEfficiency < 90 
                ? t('control.gas_high')
                : t('control.gas_optimal')}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto scrollbar-hide">
        {/* Tab Navigation - Vertical/Compact */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all relative overflow-hidden group",
                activeTab === tab.id 
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={12} className={cn(activeTab === tab.id ? "animate-pulse" : "group-hover:scale-110 transition-transform")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area - Single Column */}
        <div className="space-y-3">
          {activeTab === 'core' && (
            <>
              <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-2xl mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings size={14} className="text-cyan-500" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Nexus Core</span>
                </div>
                <button 
                  onClick={() => handleAction('Nexus Calibration', 'Core')}
                  className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/60 hover:bg-cyan-500 hover:text-black transition-all"
                >
                  CALIBRATE NEXUS
                </button>
              </div>
              <ControlCard 
                title={t('control.cards.registry.title')} 
                desc={t('control.cards.registry.desc')}
                icon={Database}
                onAction={() => handleAction('Registry Update', 'Core')}
                loading={isProcessing}
              />
              <ControlCard 
                title={t('control.cards.audit.title')} 
                desc={t('control.cards.audit.desc')}
                icon={ShieldAlert}
                onAction={() => handleAction('Governance Proposal', 'Core')}
                loading={isProcessing}
              />
              <ControlCard 
                title={t('control.cards.sentinel.title')} 
                desc={t('control.cards.sentinel.desc')}
                icon={Lock}
                onAction={() => handleAction('Sentinel Tuning', 'Core')}
                loading={isProcessing}
              />
            </>
          )}

          {activeTab === 'finance' && (
            <>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => handleAction('Cpex Swap', 'Finance')}
                  className="py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/60 hover:bg-emerald-500 hover:text-black transition-all flex flex-col items-center gap-1"
                >
                  <Zap size={14} />
                  AOXC CPEX
                </button>
                <button 
                  onClick={() => handleAction('Change Sync', 'Finance')}
                  className="py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/60 hover:bg-cyan-500 hover:text-black transition-all flex flex-col items-center gap-1"
                >
                  <RefreshCw size={14} />
                  AOXC CHANGE
                </button>
              </div>
              <ControlCard 
                title={t('control.cards.vault.title')} 
                desc={t('control.cards.vault.desc')}
                icon={Lock}
                onAction={() => handleAction('Vault Rebalance', 'Finance')}
                loading={isProcessing}
              />
              <ControlCard 
                title={t('control.cards.change.title')} 
                desc={t('control.cards.change.desc')}
                icon={ArrowRightLeft}
                onAction={() => handleAction('Liquidity Injection', 'Finance')}
                loading={isProcessing}
              />
              <ControlCard 
                title={t('control.cards.factory.title')} 
                desc={t('control.cards.factory.desc')}
                icon={Zap}
                onAction={() => handleAction('Asset Minting', 'Finance')}
                loading={isProcessing}
              />
            </>
          )}

          {activeTab === 'infra' && (
            <>
              {/* Auto-Repair Panel */}
              <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-2xl space-y-4 mb-4 shadow-lg shadow-cyan-500/5 group">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{t('control.repair.title')}</span>
                    <span className={cn(
                      "text-[8px] font-mono uppercase",
                      repairState === 'stable' ? "text-emerald-500" : "text-amber-500 animate-pulse"
                    )}>
                      {repairState === 'stable' ? t('control.repair.stable') : `${t('control.repair.syncing')} [${repairTarget}]`}
                    </span>
                  </div>
                  <div className="flex items-end gap-0.5 h-6">
                    {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6].map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [`${h*100}%`, `${(h*0.5)*100}%`, `${h*100}%`] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                        className={cn(
                          "w-1 rounded-full",
                          repairState === 'stable' ? "bg-emerald-500/40" : "bg-amber-500/40"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => triggerRepair('Core')}
                    disabled={repairState === 'syncing'}
                    className="py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/60 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50"
                  >
                    REPAIR CORE
                  </button>
                  <button 
                    onClick={() => triggerRepair('Finance')}
                    disabled={repairState === 'syncing'}
                    className="py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/60 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50"
                  >
                    REPAIR FINANCE
                  </button>
                </div>
                <button 
                  onClick={() => triggerRepair('Global')}
                  disabled={repairState === 'syncing'}
                  className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:bg-cyan-500 hover:text-black hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group-hover:border-cyan-500/30 disabled:opacity-50"
                >
                  <RefreshCw size={12} className={repairState === 'syncing' ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                  {t('control.repair.button')}
                </button>
              </div>

              {/* Advanced Infra Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">AoxcAutoRepair Logs</span>
                  <span className="text-[8px] text-cyan-500/40 font-mono">v1.0.4-stable</span>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-[9px] space-y-1 h-24 overflow-y-auto scrollbar-hide">
                  <div className="text-white/40">[{new Date().toLocaleTimeString()}] AoxcClock: Syncing...</div>
                  <div className="text-emerald-500/60">[{new Date().toLocaleTimeString()}] AoxcFactory: Ready.</div>
                  <div className="text-white/40">[{new Date().toLocaleTimeString()}] AoxcBuild: Manifest verified.</div>
                  {repairState === 'syncing' && (
                    <div className="text-amber-500 animate-pulse">[{new Date().toLocaleTimeString()}] Repairing {repairTarget}...</div>
                  )}
                </div>
              </div>

              <ControlCard 
                title={t('control.cards.autorepair.title')} 
                desc={t('control.cards.autorepair.desc')}
                icon={RefreshCw}
                onAction={() => handleAction('State Repair', 'Infra')}
                loading={isProcessing}
              />
              <ControlCard 
                title={t('control.cards.node.title')} 
                desc={t('control.cards.node.desc')}
                icon={Cpu}
                onAction={() => handleAction('Node Restart', 'Infra')}
                loading={isProcessing}
              />
              <ControlCard 
                title={t('control.cards.clock.title')} 
                desc={t('control.cards.clock.desc')}
                icon={Settings}
                onAction={() => handleAction('Clock Sync', 'Infra')}
                loading={isProcessing}
              />
            </>
          )}

          {activeTab === 'gov' && (
            <>
              <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-2xl mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={14} className="text-purple-500" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">DAO Management</span>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleAction('Audit Voice Sync', 'Gov')}
                    className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/60 hover:bg-purple-500 hover:text-black transition-all"
                  >
                    SYNC AUDIT VOICE
                  </button>
                  <button 
                    onClick={() => handleAction('DAO Parameter Update', 'Gov')}
                    className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/60 hover:bg-purple-500 hover:text-black transition-all"
                  >
                    DAO MANAGER CONFIG
                  </button>
                </div>
              </div>
              <ControlCard 
                title={t('control.cards.governance.title')} 
                desc={t('control.cards.governance.desc')}
                icon={Users}
                onAction={() => handleAction('Governance Proposal', 'Gov')}
                loading={isProcessing}
              />
            </>
          )}
        </div>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <div className="bg-zinc-950 border border-cyan-500/30 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 max-w-sm text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse" />
                <RefreshCw className="text-cyan-500 animate-spin relative z-10" size={56} />
                <ShieldAlert className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 relative z-10" size={24} />
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-bold text-xl tracking-tight uppercase">Sentinel Analysis</h3>
                <p className="text-white/40 text-xs mt-3 leading-relaxed">Gemini AI is vetting the transaction on XLayer-Reth neural network...</p>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-cyan-500 h-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ControlCard = ({ title, desc, icon: Icon, onAction, loading }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02, x: 4 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all group cursor-pointer shadow-sm relative overflow-hidden" 
    onClick={onAction}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-center gap-4 relative z-10">
      <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-inner">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-xs tracking-wide group-hover:text-cyan-400 transition-colors uppercase">{title}</h3>
          <ChevronRight size={14} className="text-white/10 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
        </div>
        <p className="text-white/30 text-[10px] leading-tight mt-1 line-clamp-1 font-medium">{desc}</p>
      </div>
    </div>
  </motion.div>
);
