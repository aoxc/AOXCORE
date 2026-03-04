import React, { useState } from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, FileText, CheckCircle, X, ArrowRight, Activity, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export const ContractNotary = () => {
  const { activeNotary, setActiveNotary, addLedgerEntry, addLog, addPendingTx, blockNumber } = useAoxcStore();
  const [isSigning, setIsSigning] = useState(false);
  const { t } = useTranslation();

  if (!activeNotary) return null;

  const handleConfirm = async () => {
    setIsSigning(true);
    
    // Simulate physical signature delay
    setTimeout(() => {
      const isMultiSig = activeNotary.operation.includes('Governance') || activeNotary.operation.includes('Vault');
      
      if (isMultiSig) {
        addPendingTx({
          module: activeNotary.module,
          operation: activeNotary.operation,
          details: activeNotary.details,
          requiredSignatures: 3
        });
        addLedgerEntry({
          module: activeNotary.module,
          operation: activeNotary.operation,
          status: 'PROVISIONAL',
          aiVerification: 'Awaiting DAO Multi-sig consensus.'
        });
        addLog(`Gemini: Multi-sig required for ${activeNotary.operation}. Transaction moved to Pending.`, 'ai');
      } else {
        addLedgerEntry({
          module: activeNotary.module,
          operation: activeNotary.operation,
          status: 'SUCCESS',
          aiVerification: activeNotary.aiAnalysis || 'Verified by Sentinel.'
        });
        addLog(`${activeNotary.operation} successfully notarized and committed.`, 'info');
      }
      
      setIsSigning(false);
      setActiveNotary(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <FileText className="text-cyan-400" size={24} />
            <h2 className="font-mono font-bold text-lg tracking-tighter uppercase">{t('notary.title')}</h2>
          </div>
          <button onClick={() => setActiveNotary(null)} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content - Accounting Slip Style */}
        <div className="flex-1 flex divide-x divide-white/10 overflow-hidden">
          {/* Left: User Command */}
          <div className="flex-1 p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{t('notary.command_label')}</span>
              <h3 className="text-xl font-bold text-white">{activeNotary.operation}</h3>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-white/40 block mb-1 uppercase">{t('notary.module_label')}</span>
                  <span className="text-cyan-400">{activeNotary.module}</span>
                </div>
                <div>
                  <span className="text-white/40 block mb-1 uppercase">{t('notary.target_label')}</span>
                  <span className="text-white">Aoxc{activeNotary.module}Gateway</span>
                </div>
                <div className="col-span-2">
                  <span className="text-white/40 block mb-1 uppercase">{t('notary.details_label')}</span>
                  <div className="bg-black/60 p-3 rounded-lg text-white/60 break-all">
                    {JSON.stringify(activeNotary.details)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-amber-400/80 text-xs font-mono bg-amber-400/5 p-4 rounded-xl border border-amber-400/10">
              <Lock size={16} />
              <p>{activeNotary.humanTranslation}</p>
            </div>
          </div>

          {/* Right: AI Analysis & Flow */}
          <div className="w-80 p-8 bg-cyan-500/[0.02] flex flex-col gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{t('notary.analysis_label')}</span>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Shield size={16} />
                <span>APPROVED</span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{t('notary.audit_trail')}</span>
              <div className="space-y-3 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
                {['AoxcGateway', 'AoxcSentinel', `Aoxc${activeNotary.module}`, 'AoxcRegistry'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    </div>
                    <span className="text-[10px] font-mono text-white/60">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <p className="text-[9px] font-mono text-cyan-400 leading-relaxed">
                "{t('notary.disclaimer')}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer: Signature Action */}
        <div className="p-8 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white/40 font-mono text-[10px]">
            <Activity size={14} className="animate-pulse text-emerald-500" />
            <span>XLayer-Reth Node Health: 100%</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isSigning}
            className={cn(
              "relative group px-12 py-4 rounded-2xl font-mono font-bold text-sm transition-all overflow-hidden",
              isSigning 
                ? "bg-white/10 text-white/40 cursor-not-allowed" 
                : "bg-cyan-500 text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            )}
          >
            <AnimatePresence mode="wait">
              {isSigning ? (
                <motion.div 
                  key="signing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="animate-spin" size={16} />
                  {t('notary.signing')}
                </motion.div>
              ) : (
                <motion.div 
                  key="sign"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  {t('notary.approve')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const RefreshCw = ({ className, size }: any) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);
