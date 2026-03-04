import React from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, XCircle, Trash2, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export const NotificationCenter = () => {
  const { notifications, addNotification } = useAoxcStore();
  const { t } = useTranslation();

  // Mock function to clear notifications (would need store update)
  const clearNotification = (id: string) => {
    // In a real app, this would dispatch an action to remove the notification
    console.log("Dismissing", id);
  };

  const icons = {
    info: <Info size={16} className="text-cyan-500" />,
    warning: <AlertCircle size={16} className="text-amber-500" />,
    error: <XCircle size={16} className="text-rose-500" />,
    success: <CheckCircle2 size={16} className="text-emerald-500" />,
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] p-6 overflow-hidden font-mono">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-cyan-400 font-bold text-xl tracking-tight uppercase flex items-center gap-3">
            <Bell className="animate-pulse" />
            System Alerts
          </h2>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">Active Warnings & Reminders</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/40 uppercase tracking-widest">
            Total: {notifications.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-white/20"
            >
              <CheckCircle2 size={48} className="mb-4 opacity-20" />
              <p className="text-xs uppercase tracking-widest">All Systems Nominal</p>
            </motion.div>
          ) : (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={cn(
                  "p-4 rounded-xl border bg-white/[0.02] flex items-start gap-4 group hover:bg-white/[0.05] transition-colors",
                  n.type === 'error' ? "border-rose-500/20" :
                  n.type === 'warning' ? "border-amber-500/20" :
                  "border-white/10"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  n.type === 'error' ? "bg-rose-500/10" :
                  n.type === 'warning' ? "bg-amber-500/10" :
                  "bg-cyan-500/10"
                )}>
                  {icons[n.type]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      n.type === 'error' ? "text-rose-400" :
                      n.type === 'warning' ? "text-amber-400" :
                      "text-cyan-400"
                    )}>
                      {n.type} Alert
                    </span>
                    <span className="text-[9px] text-white/20 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">
                    {n.message}
                  </p>
                </div>

                <button 
                  onClick={() => clearNotification(n.id)}
                  className="p-2 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
