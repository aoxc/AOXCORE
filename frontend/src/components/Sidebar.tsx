import React from 'react';
import { useAoxcStore } from '../store/useAoxcStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Wallet, 
  ShieldCheck, 
  Download,
  AlertCircle,
  FileText,
  Network,
  Users,
  BarChart3,
  GitBranch,
  Brain,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    activeView, 
    setActiveView, 
    pendingTransactions, 
    permissionLevel, 
    setPermissionLevel, 
    notifications,
    isSidebarCollapsed,
    toggleSidebar
  } = useAoxcStore();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: t('sidebar.ledger'), icon: LayoutDashboard, color: "text-cyan-400", activeColor: "bg-cyan-500/10 text-cyan-400" },
    { id: 'aoxcan', label: 'AOXCAN CORE', icon: Brain, highlight: true, color: "text-pink-500", activeColor: "bg-pink-500/10 text-pink-500" },
    { id: 'finance', label: t('sidebar.finance'), icon: Wallet, color: "text-blue-500", activeColor: "bg-blue-500/10 text-blue-500" },
    { id: 'analytics', label: t('sidebar.analytics'), icon: BarChart3, color: "text-blue-500", activeColor: "bg-blue-500/10 text-blue-500" },
    { id: 'skeleton', label: 'System Skeleton', icon: GitBranch, color: "text-purple-500", activeColor: "bg-purple-500/10 text-purple-500" },
    { id: 'sentinel', label: t('sidebar.signatures'), icon: ShieldCheck, color: "text-purple-500", activeColor: "bg-purple-500/10 text-purple-500" },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: AlertCircle, count: notifications.filter(n => n.type === 'warning' || n.type === 'error').length, color: "text-orange-500", activeColor: "bg-orange-500/10 text-orange-500" },
    { id: 'pending', label: t('sidebar.pending'), icon: FileText, count: pendingTransactions.length, color: "text-cyan-400", activeColor: "bg-cyan-500/10 text-cyan-400" },
    { id: 'registry', label: t('sidebar.registry'), icon: Network, color: "text-pink-500", activeColor: "bg-pink-500/10 text-pink-500" },
    { id: 'governance', label: t('sidebar.governance'), icon: Users, color: "text-pink-500", activeColor: "bg-pink-500/10 text-pink-500" },
  ];

  const sidebarWidth = isMobile ? "100%" : (isSidebarCollapsed ? 80 : 256);

  return (
    <motion.div 
      initial={false}
      animate={{ width: sidebarWidth }}
      className="h-full border-r border-white/10 flex flex-col bg-black/80 backdrop-blur-2xl relative z-50 transition-all duration-300 ease-in-out w-full md:w-auto"
    >
      {/* Toggle Button - Desktop Only */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-black hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(200,250,1,0.5)] z-50 hidden md:flex"
      >
        {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-4 flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2">
        {/* Navigation Header */}
        <div className={cn(
          "flex items-center mb-4 px-2 transition-all duration-300",
          (isSidebarCollapsed && !isMobile) ? "justify-center" : "justify-between"
        )}>
          {(!isSidebarCollapsed || isMobile) && (
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] animate-in fade-in duration-300">
              Navigation
            </span>
          )}
          {(isSidebarCollapsed && !isMobile) && (
             <div className="w-1 h-1 bg-white/20 rounded-full" />
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={cn(
                "w-full flex items-center relative group transition-all duration-200",
                (isSidebarCollapsed && !isMobile) ? "justify-center px-2 py-3" : "justify-between px-4 py-3",
                "rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider",
                activeView === item.id 
                  ? item.activeColor 
                  : "text-white/40 hover:text-white hover:bg-white/5",
                (item as any).highlight && activeView !== item.id && "text-pink-500/80 hover:text-pink-400 hover:bg-pink-500/10"
              )}
            >
              {activeView === item.id && (
                <motion.div 
                  layoutId="activeNav"
                  className={cn(
                    "absolute inset-0 border rounded-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]",
                    activeView === 'aoxcan' ? "border-pink-500/20" :
                    activeView === 'finance' || activeView === 'analytics' ? "border-blue-500/20" :
                    activeView === 'sentinel' || activeView === 'skeleton' ? "border-purple-500/20" :
                    "border-cyan-500/20"
                  )}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={cn(
                "flex items-center gap-3 relative z-10",
                (isSidebarCollapsed && !isMobile) ? "justify-center w-full" : ""
              )}>
                <item.icon size={18} className={cn(
                  "shrink-0 transition-colors duration-200", 
                  activeView === item.id ? "drop-shadow-[0_0_5px_currentColor]" : "text-white/30 group-hover:text-white/80",
                  (item as any).highlight && activeView !== item.id && "text-pink-500 animate-pulse"
                )} />
                
                <AnimatePresence mode="wait">
                  {(!isSidebarCollapsed || isMobile) && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Notification Badge */}
              {item.count ? (
                <div className={cn(
                  "absolute z-20 bg-cyan-500 text-black font-bold rounded-md shadow-[0_0_10px_rgba(200,250,1,0.4)] flex items-center justify-center transition-all duration-300",
                  (isSidebarCollapsed && !isMobile)
                    ? "top-0 right-0 w-3 h-3 text-[0px] rounded-full border border-black" // Dot style when collapsed
                    : "relative ml-auto px-1.5 py-0.5 text-[9px]"
                )}>
                  {(!isSidebarCollapsed || isMobile) && item.count}
                </div>
              ) : null}
              
              {/* Tooltip for Collapsed State */}
              {(isSidebarCollapsed && !isMobile) && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-black/90 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 backdrop-blur-xl shadow-xl translate-x-2 group-hover:translate-x-0 duration-200">
                  {item.label}
                  {/* Arrow */}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-black/90 border-l border-b border-white/10 rotate-45" />
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 space-y-4 border-t border-white/10 bg-black/20">
        {/* Permission Toggle */}
        <div className={cn(
          "bg-white/5 rounded-xl border border-white/10 transition-all duration-300 overflow-hidden",
          (isSidebarCollapsed && !isMobile) ? "p-2" : "p-3 space-y-2"
        )}>
          {(!isSidebarCollapsed || isMobile) && (
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block text-center">
              {t('permissions.level')}
            </span>
          )}
          
          <div className={cn("flex gap-1", (isSidebarCollapsed && !isMobile) ? "flex-col" : "")}>
            {[0, 1, 2].map((level) => (
              <button
                key={level}
                onClick={() => setPermissionLevel(level)}
                className={cn(
                  "flex items-center justify-center rounded transition-all duration-200",
                  (isSidebarCollapsed && !isMobile) ? "w-full h-8 text-[10px]" : "flex-1 py-1.5 text-[9px]",
                  "font-bold uppercase",
                  permissionLevel === level 
                    ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                    : "bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60"
                )}
                title={level === 0 ? 'GUEST' : level === 1 ? 'OPERATOR' : 'ADMIN'}
              >
                {(isSidebarCollapsed && !isMobile) ? (level === 0 ? 'G' : level === 1 ? 'O' : 'A') : (level === 0 ? 'GST' : level === 1 ? 'OPR' : 'ADM')}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => {}}
          className={cn(
            "w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-white/60 hover:bg-white/10 hover:text-white transition-all group overflow-hidden",
            (isSidebarCollapsed && !isMobile) ? "p-3" : "px-4 py-2"
          )}
          title="Export Ledger"
        >
          <Download size={16} className="group-hover:scale-110 transition-transform" />
          {(!isSidebarCollapsed || isMobile) && (
            <span className="uppercase tracking-wider text-[10px] font-bold">Export</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};
