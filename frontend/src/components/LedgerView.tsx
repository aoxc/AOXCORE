import React, { useState } from 'react';
import { useAoxcStore, LedgerEntry } from '../store/useAoxcStore';
import { cn } from '../lib/utils';
import { Shield, CheckCircle2, XCircle, Clock, Lock, ChevronRight, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export const LedgerView = () => {
  const { ledgerEntries, activeView, permissionLevel, gasEfficiency, networkLoad } = useAoxcStore();
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const { t } = useTranslation();

  const filteredEntries = ledgerEntries.filter(entry => {
    if (activeView === 'finance') return entry.module === 'Finance';
    if (activeView === 'sentinel') return entry.module === 'Sentinel' || entry.aiVerification;
    if (activeView === 'pending') return entry.status === 'PROVISIONAL';
    return true;
  });

  const getTitle = () => {
    if (activeView === 'dashboard') return t('ledger.title');
    if (activeView === 'finance') return t('sidebar.finance');
    if (activeView === 'pending') return t('sidebar.pending');
    return t('sidebar.signatures');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a] relative">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex flex-col">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
            {getTitle()}
          </h2>
          <span className="text-[8px] font-mono text-white/20 mt-1 uppercase tracking-widest">Neural Ledger Protocol v4.2</span>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono">
          <div className="flex flex-col items-end">
            <span className="text-white/20 uppercase text-[8px]">Network Load</span>
            <span className="text-cyan-400/80">{networkLoad}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/20 uppercase text-[8px]">Gas Efficiency</span>
            <span className={cn(
              gasEfficiency > 90 ? "text-emerald-400" : "text-amber-500"
            )}>{gasEfficiency}%</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-white/20 uppercase text-[8px]">{t('permissions.level')}</span>
            <span className={cn(
              permissionLevel === 2 ? "text-emerald-400" : permissionLevel === 1 ? "text-cyan-400" : "text-amber-500"
            )}>
              {permissionLevel === 2 ? t('permissions.admin') : permissionLevel === 1 ? t('permissions.operator') : t('permissions.guest')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto relative scrollbar-hide">
          {/* Permission Blur Overlay for Guest */}
          {permissionLevel === 0 && (
            <div className="absolute inset-0 z-20 backdrop-blur-[4px] bg-black/40 flex items-center justify-center">
              <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-xs border-cyan-500/20 shadow-cyan-500/5">
                <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500">
                  <Lock size={32} />
                </div>
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Yetkisiz Erişim</h3>
                <p className="text-white/40 text-[10px] leading-relaxed">Defter kayıtlarını görmek için AoxcRegistry üzerinden yetki almanız gerekmektedir.</p>
                <button className="mt-2 px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:bg-white/10 transition-all">
                  YETKİ TALEBİ GÖNDER
                </button>
              </div>
            </div>
          )}

          <table className="w-full border-collapse font-mono text-[11px]">
            <thead className="sticky top-0 bg-[#0a0a0a] z-10">
              <tr className="text-white/20 text-left border-b border-white/10">
                <th className="px-6 py-4 font-medium border-r border-white/5 w-20">{t('ledger.columns.id')}</th>
                <th className="px-6 py-4 font-medium border-r border-white/5 w-40">TIMESTAMP</th>
                <th className="px-6 py-4 font-medium border-r border-white/5 w-28">{t('ledger.columns.module')}</th>
                <th className="px-6 py-4 font-medium border-r border-white/5">{t('ledger.columns.operation')}</th>
                <th className="px-6 py-4 font-medium border-r border-white/5 w-24 text-center">{t('ledger.columns.status')}</th>
                <th className="px-6 py-4 font-medium border-r border-white/5 w-32">{t('ledger.columns.verdict')}</th>
                <th className="px-6 py-4 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody className={cn("divide-y divide-white/5", permissionLevel === 0 && "opacity-20 select-none")}>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-white/20 italic relative">
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <Clock size={24} className="opacity-20" />
                      <span>{t('ledger.empty')}</span>
                    </div>
                    {/* Typewriter Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                      <span className="text-6xl font-black uppercase tracking-[0.5em] rotate-[-15deg]">
                        {t('ledger.empty')}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <motion.tr 
                    key={entry.id} 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: "rgba(6,182,212,0.03)", x: 4 }}
                    onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                    className={cn(
                      "border-b border-white/5 transition-all group cursor-pointer relative overflow-hidden",
                      selectedEntry?.id === entry.id ? "bg-cyan-500/[0.05]" : ""
                    )}
                  >
                    <td className="px-6 py-4 border-r border-white/5 text-white/30 font-mono text-[10px] group-hover:text-cyan-400/60 transition-colors">
                      {entry.index.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 border-r border-white/5 text-cyan-400/40 tabular-nums text-[10px]">
                      {entry.timestamp}
                    </td>
                    <td className="px-6 py-4 border-r border-white/5">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all",
                        entry.module === 'Finance' ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black" :
                        entry.module === 'Infra' ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-black" :
                        entry.module === 'Gov' ? "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-black" :
                        entry.module === 'Core' ? "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black" :
                        "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black"
                      )}>
                        {entry.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-white/5 text-white/70 font-medium group-hover:text-white transition-colors">
                      {entry.operation}
                    </td>
                    <td className="px-6 py-4 border-r border-white/5 text-center">
                      <div className="flex justify-center">
                        {entry.status === 'SUCCESS' ? (
                          <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full animate-pulse" />
                            <CheckCircle2 size={16} className="text-emerald-500 relative z-10" />
                          </div>
                        ) : entry.status === 'FAILED' ? (
                          <XCircle size={16} className="text-rose-500" />
                        ) : entry.status === 'PROVISIONAL' ? (
                          <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full animate-pulse" />
                            <Clock size={16} className="text-amber-500 relative z-10" />
                          </div>
                        ) : (
                          <Activity size={16} className="text-cyan-500 animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-white/5">
                      <div className="flex items-center gap-2 text-[10px] text-white/30 italic group-hover:text-white/60 transition-colors">
                        <Shield size={12} className="text-cyan-500/50 group-hover:text-cyan-500 transition-colors" />
                        <span className="truncate max-w-[120px]">{entry.aiVerification}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ChevronRight size={14} className={cn(
                        "text-white/10 transition-all group-hover:text-cyan-500",
                        selectedEntry?.id === entry.id ? "rotate-90 text-cyan-500" : "group-hover:translate-x-1"
                      )} />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Neural Detail Side Panel */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 border-l border-white/10 bg-black/40 p-6 flex flex-col gap-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Entry Details</h3>
                <button onClick={() => setSelectedEntry(null)} className="text-white/20 hover:text-white transition-colors">
                  <XCircle size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[8px] text-white/20 uppercase block mb-2 tracking-widest">AI Verification</span>
                  <div className="flex gap-3">
                    <Shield className="text-cyan-500 shrink-0" size={16} />
                    <p className="text-[11px] text-cyan-100/80 leading-relaxed italic">
                      "{selectedEntry.aiVerification}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[8px] text-white/20 uppercase block mb-1">Block</span>
                    <span className="text-xs text-white/80 tabular-nums">#{selectedEntry.index + 1024}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-[8px] text-white/20 uppercase block mb-1">Entropy</span>
                    <span className="text-xs text-white/80 truncate">0x{Math.random().toString(16).slice(2, 8)}</span>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[8px] text-white/20 uppercase block mb-3 tracking-widest">Audit Trail</span>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span className="text-[10px] text-white/60">AoxcGateway.call()</span>
                    </div>
                    <div className="w-px h-3 bg-white/10 ml-[2.5px]" />
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                      <span className="text-[10px] text-white/60">AoxcSentinel.verify()</span>
                    </div>
                    <div className="w-px h-3 bg-white/10 ml-[2.5px]" />
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                      <span className="text-[10px] text-white/60">{selectedEntry.module}.execute()</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button className="w-full py-3 bg-cyan-500 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all">
                  VIEW ON EXPLORER
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
