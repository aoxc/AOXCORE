import React from 'react';
import { Pulse } from './components/Pulse';
import { Sidebar } from './components/Sidebar';
import { LedgerView } from './components/LedgerView';
import { ModularControl } from './components/ModularControl';
import { NeuralTerminal } from './components/NeuralTerminal';
import { UpgradePanel } from './components/UpgradePanel';
import { RegistryMap } from './components/RegistryMap';
import { WarRoom } from './components/WarRoom';
import { NeuralAnalytics } from './components/NeuralAnalytics';
import { SkeletonView } from './components/SkeletonView';
import { SentinelChat } from './components/SentinelChat';
import { Toaster } from './components/Toaster';
import { useAoxcClock } from './hooks/useAoxcClock';
import { useAoxcStore } from './store/useAoxcStore';
import { NotificationCenter } from './components/NotificationCenter';
import { AoxcanInterface } from './components/AoxcanInterface';

import { ContractNotary } from './components/ContractNotary';
import { PendingSignatures } from './components/PendingSignatures';
import { StatusMatrix } from './components/StatusMatrix';

import { cn } from './lib/utils';

import { BootSequence } from './components/BootSequence';

export default function App() {
  // Initialize the network clock
  useAoxcClock();
  const { activeView, isMobileMenuOpen, isRightPanelOpen, toggleMobileMenu, toggleRightPanel } = useAoxcStore();
  const [bootComplete, setBootComplete] = React.useState(false);

  const renderMainContent = () => {
    switch (activeView) {
      case 'pending':
        return <PendingSignatures />;
      case 'registry':
        return <RegistryMap />;
      case 'governance':
        return <WarRoom />;
      case 'analytics':
        return <NeuralAnalytics />;
      case 'skeleton':
        return <SkeletonView />;
      case 'notifications':
        return <NotificationCenter />;
      case 'aoxcan':
        return <AoxcanInterface />;
      default:
        return <LedgerView />;
    }
  };

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col selection:bg-cyan-500/30 font-mono overflow-hidden">
      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      
      <div className="scanline" />
      
      {/* Top Bar: The Pulse */}
      <Pulse />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Navigation - Mobile Drawer & Desktop Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 md:w-auto bg-black/90 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-transparent md:backdrop-blur-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Width is now handled by the Sidebar component itself via motion on desktop
        )}>
          <Sidebar />
        </div>

        {/* Mobile Overlay for Sidebar */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
        )}

        <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a] relative w-full">
          {/* Status Matrix - Scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-hide">
            <StatusMatrix />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Ledger View (Accounting Style) */}
            <div className="flex-1 flex flex-col border-r border-white/10 min-w-0 overflow-hidden">
              {renderMainContent()}
            </div>

            {/* Action Panel (Right Side) - Mobile Drawer & Desktop Panel */}
            <div className={cn(
              "fixed inset-y-0 right-0 z-50 w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out xl:relative xl:translate-x-0 xl:bg-transparent xl:backdrop-blur-none xl:flex xl:flex-col",
              isRightPanelOpen ? "translate-x-0" : "translate-x-full",
              "xl:block hidden" // Hide by default on mobile/tablet unless toggled, but force show on xl desktop
            )}>
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between shrink-0">
                  <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em]">Neural Control</h3>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-cyan-500/50" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ModularControl />
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Right Panel (Drawer) */}
            <div className={cn(
              "fixed inset-y-0 right-0 z-50 w-80 bg-black/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out xl:hidden flex flex-col",
              isRightPanelOpen ? "translate-x-0" : "translate-x-full"
            )}>
               <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between shrink-0">
                  <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em]">Neural Control</h3>
                  <button onClick={toggleRightPanel} className="text-white/40 hover:text-white">
                    <span className="sr-only">Close</span>
                    &times;
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ModularControl />
                </div>
            </div>

             {/* Mobile Overlay for Right Panel */}
            {isRightPanelOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 xl:hidden backdrop-blur-sm"
                onClick={toggleRightPanel}
              />
            )}
          </div>

          {/* Neural Terminal Console */}
          <div className="shrink-0">
            <NeuralTerminal />
          </div>
        </main>
      </div>

      {/* Overlays */}
      <ContractNotary />
      <UpgradePanel />
      <SentinelChat />
      <Toaster />
    </div>
  );
}
