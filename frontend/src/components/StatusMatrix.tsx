import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useAoxcStore, StatusColor } from '../store/useAoxcStore';
import { cn } from '../lib/utils';

const colorMap: Record<StatusColor, string> = {
  green: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
  yellow: 'bg-amber-400 shadow-[0_0_10px_#fbbf24]',
  orange: 'bg-orange-500 shadow-[0_0_10px_#f97316]',
  red: 'bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse',
  blue: 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]',
};

export const StatusMatrix = () => {
  const { statusMatrix } = useAoxcStore();
  const { t } = useTranslation();

  const panels = [
    { key: 'core', label: t('status_matrix.core'), color: statusMatrix.core },
    { key: 'access', label: t('status_matrix.access'), color: statusMatrix.access },
    { key: 'finance', label: t('status_matrix.finance'), color: statusMatrix.finance },
    { key: 'infra', label: t('status_matrix.infra'), color: statusMatrix.infra },
    { key: 'gov', label: t('status_matrix.gov'), color: statusMatrix.gov },
  ];

  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-black/40 border-b border-white/5 backdrop-blur-md">
      {panels.map((panel) => (
        <div key={panel.key} className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl group relative overflow-hidden">
          {/* Cam Görünümlü Arka Plan Efekti */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-[0.1em]">{panel.label}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <motion.div 
                animate={{ 
                  scale: panel.color === 'red' ? [1, 1.2, 1] : 1,
                  opacity: panel.color === 'red' ? [0.7, 1, 0.7] : 1
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={cn("w-2 h-2 rounded-full transition-all duration-500", colorMap[panel.color])} 
              />
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-tighter transition-colors duration-500",
                panel.color === 'green' ? "text-emerald-500" :
                panel.color === 'yellow' ? "text-amber-400" :
                panel.color === 'orange' ? "text-orange-500" :
                panel.color === 'red' ? "text-rose-500" :
                "text-cyan-500"
              )}>
                {t(`status_matrix.states.${panel.color}`)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
