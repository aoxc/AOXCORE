import React from 'react';
import { motion } from 'motion/react';
import { Folder, FileCode, ChevronRight, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const skeletonData = [
  {
    name: 'abstract',
    type: 'dir',
    children: [{ name: 'AoxcStorage.sol', type: 'file' }]
  },
  {
    name: 'access',
    type: 'dir',
    children: [
      { name: 'AoxcGateway.sol', type: 'file' },
      { name: 'AoxcSentinel.sol', type: 'file' }
    ]
  },
  { name: 'AOXC.sol', type: 'file' },
  {
    name: 'core',
    type: 'dir',
    children: [
      { name: 'AoxcCore.sol', type: 'file' },
      { name: 'AoxcNexus.sol', type: 'file' },
      { name: 'AoxcRegistry.sol', type: 'file' }
    ]
  },
  {
    name: 'finance',
    type: 'dir',
    children: [
      { name: 'AoxcChange.sol', type: 'file' },
      { name: 'AoxcCpex.sol', type: 'file' },
      { name: 'AoxcVault.sol', type: 'file' }
    ]
  },
  {
    name: 'gov',
    type: 'dir',
    children: [
      { name: 'AoxcAuditVoice.sol', type: 'file' },
      { name: 'AoxcDaoManager.sol', type: 'file' }
    ]
  },
  {
    name: 'infra',
    type: 'dir',
    children: [
      { name: 'AoxcAutoRepair.sol', type: 'file' },
      { name: 'AoxcBuild.sol', type: 'file' },
      { name: 'AoxcClock.sol', type: 'file' },
      { name: 'AoxcFactory.sol', type: 'file' }
    ]
  },
  {
    name: 'interfaces',
    type: 'dir',
    children: [
      { name: 'IAoxcAuditVoice.sol', type: 'file' },
      { name: 'IAoxcAutoRepair.sol', type: 'file' },
      { name: 'IAoxcBuild.sol', type: 'file' },
      { name: 'IAoxcChange.sol', type: 'file' },
      { name: 'IAoxcClock.sol', type: 'file' },
      { name: 'IAoxcConstants.sol', type: 'file' },
      { name: 'IAoxcCore.sol', type: 'file' },
      { name: 'IAoxcCpex.sol', type: 'file' },
      { name: 'IAoxcDaoManager.sol', type: 'file' },
      { name: 'IAoxcFactory.sol', type: 'file' },
      { name: 'IAoxcGateway.sol', type: 'file' },
      { name: 'IAoxcNexus.sol', type: 'file' },
      { name: 'IAoxcRegistry.sol', type: 'file' },
      { name: 'IAoxcSentinel.sol', type: 'file' },
      { name: 'IAoxcStorage.sol', type: 'file' },
      { name: 'IAoxcVault.sol', type: 'file' }
    ]
  },
  {
    name: 'libraries',
    type: 'dir',
    children: [
      { name: 'AoxcConstants.sol', type: 'file' },
      { name: 'AoxcErrors.sol', type: 'file' },
      { name: 'AoxcEvents.sol', type: 'file' }
    ]
  }
];

export const SkeletonView = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col bg-[#050505] p-8 overflow-hidden font-mono">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em]">System Skeleton</h2>
          <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">35 Files • 9 Directories • Core Architecture</p>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-[10px]">
          <Terminal size={12} />
          <span>orcun@ns1:~/Work/AOXCORE/src(main) $ tree</span>
        </div>
      </div>

      <div className="flex-1 bg-black/40 border border-white/5 rounded-3xl p-8 overflow-y-auto scrollbar-hide relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-cyan-500 mb-4">
            <Folder size={16} />
            <span className="text-sm font-bold">.</span>
          </div>
          
          {skeletonData.map((item, i) => (
            <TreeItem key={item.name} item={item} depth={1} isLast={i === skeletonData.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TreeItem = ({ item, depth, isLast }: any) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="flex flex-col">
      <div 
        className="flex items-center gap-2 group cursor-pointer py-0.5"
        onClick={() => item.type === 'dir' && setIsOpen(!isOpen)}
      >
        <span className="text-white/20 select-none">
          {'│  '.repeat(depth - 1)}
          {isLast ? '└── ' : '├── '}
        </span>
        {item.type === 'dir' ? (
          <Folder size={14} className={cn("transition-colors", isOpen ? "text-cyan-500" : "text-cyan-900")} />
        ) : (
          <FileCode size={14} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
        )}
        <span className={cn(
          "text-[11px] tracking-tight transition-colors",
          item.type === 'dir' ? "text-white/80 font-bold" : "text-white/50 group-hover:text-white"
        )}>
          {item.name}
        </span>
      </div>

      {item.type === 'dir' && isOpen && item.children && (
        <div className="flex flex-col">
          {item.children.map((child: any, i: number) => (
            <TreeItem 
              key={child.name} 
              item={child} 
              depth={depth + 1} 
              isLast={i === item.children.length - 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
