import React from 'react';
import { motion } from 'motion/react';
import { Database, Lock, Zap, Cpu, Settings, Shield, Activity, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

const contracts = [
  // CORE
  { id: 'registry', name: 'AoxcRegistry', icon: Database, type: 'Core', address: '0x71C...3A2' },
  { id: 'nexus', name: 'AoxcNexus', icon: Settings, type: 'Core', address: '0xNexus...001' },
  { id: 'core', name: 'AoxcCore', icon: Cpu, type: 'Core', address: '0xCore...002' },
  
  // ACCESS
  { id: 'gateway', name: 'AoxcGateway', icon: Activity, type: 'Access', address: '0x92B...F11' },
  { id: 'sentinel', name: 'AoxcSentinel', icon: Shield, type: 'Access', address: '0xA1D...E44' },
  
  // FINANCE
  { id: 'vault', name: 'AoxcVault', icon: Lock, type: 'Finance', address: '0x55E...C22' },
  { id: 'change', name: 'AoxcChange', icon: RefreshCw, type: 'Finance', address: '0xChange...003' },
  { id: 'cpex', name: 'AoxcCpex', icon: Zap, type: 'Finance', address: '0xCpex...004' },
  
  // GOV
  { id: 'audit', name: 'AoxcAuditVoice', icon: Activity, type: 'Gov', address: '0xAudit...005' },
  { id: 'dao', name: 'AoxcDaoManager', icon: Settings, type: 'Gov', address: '0xDao...006' },
  
  // INFRA
  { id: 'repair', name: 'AoxcAutoRepair', icon: RefreshCw, type: 'Infra', address: '0x88C...A77' },
  { id: 'build', name: 'AoxcBuild', icon: Cpu, type: 'Infra', address: '0xBuild...007' },
  { id: 'clock', name: 'AoxcClock', icon: Settings, type: 'Infra', address: '0x11A...B88' },
  { id: 'factory', name: 'AoxcFactory', icon: Zap, type: 'Infra', address: '0x33F...D99' },
  
  // MAIN
  { id: 'aoxc', name: 'AOXC', icon: Shield, type: 'Main', address: '0xAOXC...F26' },
];

export const RegistryMap = () => {
  const { t } = useTranslation();

  // Group contracts for layout
  const core = contracts.filter(c => c.type === 'Core');
  const access = contracts.filter(c => c.type === 'Access');
  const finance = contracts.filter(c => c.type === 'Finance');
  const gov = contracts.filter(c => c.type === 'Gov');
  const infra = contracts.filter(c => c.type === 'Infra');
  const main = contracts.filter(c => c.type === 'Main')[0];

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#0a0a0a] overflow-hidden relative">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-[0.3em]">{t('registry_map.title')}</h2>
          <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">35 Contracts • 9 Modules • Neural Backbone</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Skeleton Verified</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center scale-90 md:scale-100 transition-transform duration-500">
        {/* Main AOXC Node */}
        <ContractNode contract={main} className="z-30 scale-125 shadow-[0_0_50px_rgba(6,182,212,0.2)] border-cyan-500/50" t={t} isMain />

        {/* Connections SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
            </linearGradient>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#06b6d4" opacity="0.5" />
            </marker>
          </defs>
          
          {/* Orbital Rings */}
          <circle cx="50%" cy="50%" r="180" fill="none" stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_60s_linear_infinite]" />
          <circle cx="50%" cy="50%" r="320" fill="none" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="10 10" className="animate-[spin_120s_linear_infinite_reverse]" />
          
          {/* Connection Lines (Simulated for visual structure) */}
          <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="url(#lineGrad)" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="url(#lineGrad)" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="url(#lineGrad)" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="url(#lineGrad)" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="url(#lineGrad)" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>

        {/* CORE Cluster */}
        <div className="absolute top-[10%] flex gap-6">
          {core.map(c => <ContractNode key={c.id} contract={c} t={t} />)}
        </div>

        {/* ACCESS Cluster */}
        <div className="absolute left-[5%] md:left-[10%] flex flex-col gap-6">
          {access.map(c => <ContractNode key={c.id} contract={c} t={t} />)}
        </div>

        {/* FINANCE Cluster */}
        <div className="absolute right-[5%] md:right-[10%] flex flex-col gap-6">
          {finance.map(c => <ContractNode key={c.id} contract={c} t={t} />)}
        </div>

        {/* INFRA Cluster */}
        <div className="absolute bottom-[10%] flex gap-6">
          {infra.map(c => <ContractNode key={c.id} contract={c} t={t} />)}
        </div>

        {/* GOV Cluster */}
        <div className="absolute top-[30%] left-[20%] flex flex-col gap-6">
          {gov.map(c => <ContractNode key={c.id} contract={c} t={t} />)}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-[8px] text-white/40 uppercase tracking-widest">{t('registry_map.legend_core')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[8px] text-white/40 uppercase tracking-widest">{t('registry_map.legend_active')}</span>
        </div>
      </div>
    </div>
  );
};

const ContractNode = ({ contract, className, t, isMain }: any) => (
  <motion.div 
    whileHover={{ scale: 1.1 }}
    className={cn(
      "group relative flex flex-col items-center gap-2 p-4 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-md cursor-pointer hover:border-cyan-500/50 transition-all z-20",
      isMain ? "w-32 h-32 justify-center rounded-full border-cyan-500/30 bg-cyan-950/30" : "w-24",
      className
    )}
  >
    <div className={cn(
      "p-3 rounded-xl transition-all duration-500",
      isMain ? "bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)]" : "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black"
    )}>
      <contract.icon size={isMain ? 32 : 20} />
    </div>
    <span className={cn(
      "font-bold text-white/80 uppercase tracking-widest text-center leading-tight",
      isMain ? "text-xs" : "text-[9px]"
    )}>
      {contract.name}
    </span>
    
    {/* Tooltip */}
    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-56 bg-black/90 border border-cyan-500/30 p-4 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded">{contract.type}</span>
        <span className="text-[9px] text-white/40 font-mono">v2.0.1</span>
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-[8px] text-white/20 uppercase tracking-widest block mb-0.5">Contract Address</span>
          <p className="text-[10px] text-white/80 font-mono break-all leading-tight bg-white/5 p-1.5 rounded border border-white/5 select-all hover:bg-white/10 transition-colors">
            {contract.address}
          </p>
        </div>
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-[9px] text-white/40 uppercase tracking-widest">Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">{t('registry_map.node_linked')}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
