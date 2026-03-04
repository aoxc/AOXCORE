import React from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { Shield, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

export const PendingSignatures = () => {
  const { pendingTransactions, approvePendingTx } = useAoxcStore();
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
          {t('pending.title')}
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {pendingTransactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
            <CheckCircle size={48} className="opacity-20" />
            <p className="font-mono text-sm italic">{t('pending.empty')}</p>
          </div>
        ) : (
          pendingTransactions.map((tx) => (
            <div key={tx.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[9px] font-bold uppercase">
                      {tx.module}
                    </span>
                    <h3 className="text-white font-bold">{tx.operation}</h3>
                  </div>
                  <p className="text-[10px] text-white/40 font-mono">TX_ID: {tx.id}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase">{t('pending.status')}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: tx.requiredSignatures }).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "w-2 h-2 rounded-full",
                          i < tx.currentSignatures ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-white/10"
                        )} 
                       />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-[10px] font-mono text-white/60">
                {JSON.stringify(tx.details)}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-amber-500/60">
                  <Clock size={12} />
                  <span>{t('pending.awaiting')} ({tx.currentSignatures}/{tx.requiredSignatures})</span>
                </div>
                <button
                  onClick={() => approvePendingTx(tx.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-400 transition-all"
                >
                  <UserCheck size={14} />
                  {t('pending.sign_button')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
