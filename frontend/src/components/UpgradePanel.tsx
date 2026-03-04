import React from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ArrowUpCircle, X } from 'lucide-react';

export const UpgradePanel = () => {
  const { upgradeAvailable, dismissUpgrade, addLog } = useAoxcStore();

  const handleUpgrade = () => {
    addLog('Initiating AoxcFactory V2 deployment...', 'info');
    addLog('Gemini: New module architecture validated. Upgrading...', 'ai');
    dismissUpgrade();
  };

  return (
    <AnimatePresence>
      {upgradeAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-12 right-6 z-50"
        >
          <div className="bg-cyan-500 text-black p-4 rounded-2xl shadow-2xl shadow-cyan-500/20 flex items-center gap-4 border border-white/20">
            <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
              <ArrowUpCircle size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Yeni Modül Algılandı (V2)</h4>
              <p className="text-[10px] font-medium opacity-80">AoxcFactory üzerinden yeni bir kayıt defteri modülü mevcut.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleUpgrade}
                className="px-3 py-1.5 bg-black text-white rounded-lg text-[10px] font-bold uppercase hover:bg-black/80 transition-all"
              >
                İşle
              </button>
              <button 
                onClick={dismissUpgrade}
                className="p-1.5 hover:bg-black/10 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
