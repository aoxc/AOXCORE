import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, Users, BarChart3, MessageSquare, Bug } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { useAoxcStore } from '../store/useAoxcStore';
import { debugTrace } from '../services/xlayer';

const pastDecisions = [
  { id: '1', title: 'Vault Yield Strategy v2', status: 'Passed', impact: 'Positive', date: '2026-02-15' },
  { id: '2', title: 'Emergency Brake Activation', status: 'Executed', impact: 'Neutral', date: '2026-02-20' },
  { id: '3', title: 'Asset Factory Mint Limit', status: 'Passed', impact: 'Positive', date: '2026-03-01' },
];

export const WarRoom = () => {
  const [selectedProposal, setSelectedProposal] = useState(pastDecisions[2]);
  const { t } = useTranslation();
  const { addLog } = useAoxcStore();
  const [isDebugging, setIsDebugging] = useState(false);

  const handleDebug = async () => {
    setIsDebugging(true);
    addLog("Sentinel: Initiating debug_traceTransaction on XLayer...", "ai");
    // Mock TX Hash for demo purposes (real hash would come from selected proposal if connected)
    const result = await debugTrace('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    
    if (result) {
      addLog(`Debug Trace Complete. Gas Used: ${result.gasUsed}`, "success");
      addLog(`Effective Gas Price: ${result.effectiveGasPrice}`, "info");
    } else {
      addLog("Debug Trace Failed: Transaction not found or RPC limit.", "error");
    }
    setIsDebugging(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0a0a0a]">
      {/* Left Side: Past Decisions */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 bg-black/20">
          <h2 className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-[0.3em]">{t('war_room.history_title')}</h2>
          <p className="text-white/20 text-[8px] mt-1 uppercase tracking-widest">{t('war_room.history_subtitle')}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pastDecisions.map((decision) => (
            <div 
              key={decision.id}
              onClick={() => setSelectedProposal(decision)}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer group",
                selectedProposal.id === decision.id 
                  ? "bg-cyan-500/5 border-cyan-500/30" 
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[8px] font-mono text-white/40">{decision.date}</span>
                <span className={cn(
                  "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded",
                  decision.status === 'Passed' ? "bg-emerald-500/10 text-emerald-500" : "bg-cyan-500/10 text-cyan-500"
                )}>{decision.status}</span>
              </div>
              <h3 className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{decision.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side: Impact Prediction */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-white/10 bg-black/20 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-cyan-400 font-mono text-[10px] font-bold uppercase tracking-[0.3em]">{t('war_room.impact_title')}</h2>
            <p className="text-white/20 text-[8px] mt-1 uppercase tracking-widest">{t('war_room.impact_subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-tighter">{t('war_room.ai_active')}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <StatCard title={t('war_room.stats.liquidity')} value="+12.4%" icon={TrendingUp} color="emerald" />
            <StatCard title={t('war_room.stats.risk')} value="-4.2%" icon={Shield} color="cyan" />
            <StatCard title={t('war_room.stats.growth')} value="+2.1k" icon={Users} color="emerald" />
          </div>

          <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-cyan-500" size={20} />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">AoxcAuditVoice Analysis</h3>
            </div>
            <p className="text-xs text-cyan-100/70 leading-relaxed italic">
              "Based on the {selectedProposal.title} parameters, AoxcAuditVoice has synchronized with AoxcDaoManager. My neural simulation predicts a sustained increase in capital efficiency. 
              The proposed mint limits will reduce AOXC volatility by 15% over the next 3 epochs. 
              I recommend proceeding with the current configuration."
            </p>
            <div className="flex gap-2 pt-2">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[9px] font-bold uppercase">Audit Verified</span>
              <span className="px-2 py-1 bg-cyan-500/10 text-cyan-500 rounded text-[9px] font-bold uppercase">DAO Ready</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{t('war_room.simulation_metrics')}</h3>
            <div className="space-y-4">
              <ProgressBar label={t('war_room.metrics.stability')} value={92} />
              <ProgressBar label={t('war_room.metrics.utilization')} value={78} />
              <ProgressBar label={t('war_room.metrics.participation')} value={64} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/40 flex gap-2">
          <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-[0.2em]">
            {t('war_room.run_simulation')}
          </button>
          <button 
            onClick={handleDebug}
            disabled={isDebugging}
            className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 hover:bg-red-500 hover:text-black transition-all uppercase tracking-[0.2em] flex items-center gap-2 disabled:opacity-50"
          >
            <Bug size={14} className={isDebugging ? "animate-spin" : ""} />
            {isDebugging ? "TRACING..." : "DEBUG TRACE"}
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
    <div className={cn(
      "p-2 w-fit rounded-lg",
      color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" : "bg-cyan-500/10 text-cyan-500"
    )}>
      <Icon size={16} />
    </div>
    <div className="flex flex-col">
      <span className="text-[8px] text-white/20 uppercase tracking-widest">{title}</span>
      <span className={cn(
        "text-lg font-bold tabular-nums",
        color === 'emerald' ? "text-emerald-400" : "text-cyan-400"
      )}>{value}</span>
    </div>
  </div>
);

const ProgressBar = ({ label, value }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[9px] font-mono">
      <span className="text-white/40 uppercase">{label}</span>
      <span className="text-cyan-400">{value}%</span>
    </div>
    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-cyan-500 h-full"
      />
    </div>
  </div>
);
