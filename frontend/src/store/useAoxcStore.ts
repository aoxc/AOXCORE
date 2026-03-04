import { create } from 'zustand';

export interface LedgerEntry {
  id: string;
  index: number;
  timestamp: number;
  module: 'Infra' | 'Finance' | 'Gov' | 'Sentinel' | 'Core';
  operation: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'PROVISIONAL';
  aiVerification: string;
  auditTrail?: string[];
}

export interface PendingTx {
  id: string;
  module: 'Infra' | 'Finance' | 'Gov' | 'Core';
  operation: string;
  details: any;
  requiredSignatures: number;
  currentSignatures: number;
}

export type StatusColor = 'green' | 'yellow' | 'red' | 'blue' | 'orange';

export interface StatusMatrix {
  core: StatusColor;
  access: StatusColor;
  finance: StatusColor;
  infra: StatusColor;
  gov: StatusColor;
}

interface AoxcState {
  blockNumber: number;
  epochTime: number;
  networkStatus: 'healthy' | 'warning' | 'critical';
  repairState: 'stable' | 'syncing' | 'error';
  repairTarget: string | null;
  statusMatrix: StatusMatrix;
  gasEfficiency: number; // 0-100
  networkLoad: string; // e.g. "1.2ms"
  permissionLevel: number; // 0: Guest, 1: Operator, 2: Admin
  logs: { id: string; message: string; type: 'info' | 'warning' | 'error' | 'ai' | 'success'; timestamp: number }[];
  ledgerEntries: LedgerEntry[];
  pendingTransactions: PendingTx[];
  analyticsData: { timestamp: number; gas: number; load: number; treasury: number }[];
  activeView: 'dashboard' | 'finance' | 'sentinel' | 'pending' | 'governance' | 'registry' | 'analytics' | 'skeleton' | 'notifications' | 'aoxcan';
  isProcessing: boolean;
  upgradeAvailable: boolean;
  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;
  isRightPanelOpen: boolean;
  activeNotary: {
    module: 'Infra' | 'Finance' | 'Gov' | 'Core';
    operation: string;
    details: any;
    aiAnalysis?: string;
    humanTranslation?: string;
  } | null;
  chatMessages: { id: string; role: 'user' | 'ai'; content: string; timestamp: number }[];
  notifications: { id: string; message: string; type: 'info' | 'warning' | 'error' | 'success'; timestamp: number }[];
  addLog: (message: string, type?: 'info' | 'warning' | 'error' | 'ai' | 'success') => void;
  addNotification: (message: string, type?: 'info' | 'warning' | 'error' | 'success') => void;
  addChatMessage: (content: string, role: 'user' | 'ai') => void;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id' | 'index' | 'timestamp'>) => void;
  incrementBlock: () => void;
  setProcessing: (val: boolean) => void;
  setActiveView: (view: 'dashboard' | 'finance' | 'sentinel' | 'pending' | 'governance' | 'registry' | 'analytics' | 'skeleton' | 'notifications' | 'aoxcan') => void;
  toggleMobileMenu: () => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  triggerUpgrade: () => void;
  dismissUpgrade: () => void;
  setPermissionLevel: (level: number) => void;
  setActiveNotary: (notary: any) => void;
  addPendingTx: (tx: Omit<PendingTx, 'id' | 'currentSignatures'>) => void;
  approvePendingTx: (id: string) => void;
  triggerRepair: (target?: string) => void;
  syncNetwork: () => Promise<void>;
}

import { getNetworkTelemetry } from '../services/aiBridge';

export const useAoxcStore = create<AoxcState>((set) => ({
  blockNumber: 262600,
  epochTime: 1740990000,
  networkStatus: 'healthy',
  repairState: 'stable',
  repairTarget: null,
  statusMatrix: {
    core: 'green',
    access: 'green',
    finance: 'green',
    infra: 'green',
    gov: 'green',
  },
  gasEfficiency: 94,
  networkLoad: '1.2ms',
  permissionLevel: 1, // Default to Operator for demo
  logs: [
    { id: '1', message: 'AOXC Neural OS Initialized.', type: 'info', timestamp: Date.now() - 5000 },
    { id: '2', message: 'Sentinel: Monitoring XLayer-Reth node...', type: 'ai', timestamp: Date.now() - 4000 },
    { id: '3', message: 'AoxcRegistry: Core contracts verified.', type: 'info', timestamp: Date.now() - 3000 },
    { id: '4', message: 'Gemini: All systems nominal. Gas efficiency 94%.', type: 'ai', timestamp: Date.now() - 2000 },
    { id: '5', message: 'AoxcClock: Epoch synchronization complete.', type: 'info', timestamp: Date.now() - 1000 },
  ],
  ledgerEntries: [
    { id: 'l1', index: 1, timestamp: 1740990000, module: 'Core', operation: 'Registry Init', status: 'SUCCESS', aiVerification: 'Genesis block verified by Sentinel.' },
    { id: 'l2', index: 2, timestamp: 1740990005, module: 'Finance', operation: 'Vault Setup', status: 'SUCCESS', aiVerification: 'Liquidity pools initialized.' },
    { id: 'l3', index: 3, timestamp: 1740990010, module: 'Infra', operation: 'Clock Sync', status: 'SUCCESS', aiVerification: 'Network time-lock synchronized.' },
    { id: 'l4', index: 4, timestamp: 1740990015, module: 'Gov', operation: 'DAO Bootstrap', status: 'SUCCESS', aiVerification: 'Governance parameters established.' },
    { id: 'l5', index: 5, timestamp: 1740990020, module: 'Sentinel', operation: 'Traffic Scan', status: 'SUCCESS', aiVerification: 'No high-risk vectors detected.' },
  ],
  analyticsData: Array.from({ length: 20 }, (_, i) => ({
    timestamp: 1740990000 + i * 60,
    gas: 85 + Math.random() * 10,
    load: 1.0 + Math.random() * 0.5,
    treasury: 1250000 + i * 1000 + Math.random() * 500
  })),
  pendingTransactions: [],
  activeView: 'dashboard',
  isProcessing: false,
  upgradeAvailable: false,
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,
  isRightPanelOpen: false,
  activeNotary: null,
  chatMessages: [
    { id: '1', role: 'ai', content: 'Hello, I am Gemini Sentinel. How can I assist with your AOXC Neural OS today?', timestamp: Date.now() }
  ],
  notifications: [],
  syncNetwork: async () => {
    try {
      const telemetry = await getNetworkTelemetry();
      if (telemetry.status === 'ONLINE') {
        set((state) => ({
          blockNumber: parseInt(telemetry.blockHeight),
          networkLoad: telemetry.gasPrice, // Using gas price as load metric for now
          networkStatus: 'healthy',
          statusMatrix: { ...state.statusMatrix, infra: 'green' }
        }));
      } else {
        set((state) => ({
          networkStatus: 'critical',
          statusMatrix: { ...state.statusMatrix, infra: 'red' },
          logs: [{ id: Math.random().toString(36).substr(2, 9), message: "RPC Connection Failed: XLayer unreachable.", type: 'error', timestamp: Date.now() }, ...state.logs]
        }));
      }
    } catch (e) {
      console.error("Sync Error:", e);
    }
  },
  addLog: (message, type = 'info') => set((state) => ({
    logs: [{ id: Math.random().toString(36).substr(2, 9), message, type, timestamp: Date.now() }, ...state.logs].slice(0, 50)
  })),
  addNotification: (message, type = 'info') => set((state) => {
    const id = Math.random().toString(36).substr(2, 9);
    setTimeout(() => {
      set((s) => ({ notifications: s.notifications.filter(n => n.id !== id) }));
    }, 5000);
    return { notifications: [...state.notifications, { id, message, type, timestamp: Date.now() }] };
  }),
  addChatMessage: (content, role) => set((state) => ({
    chatMessages: [...state.chatMessages, { id: Math.random().toString(36).substr(2, 9), content, role, timestamp: Date.now() }]
  })),
  addLedgerEntry: (entry) => set((state) => {
    const newEntry: LedgerEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      index: state.ledgerEntries.length + 1,
      timestamp: state.epochTime,
    };
    return { ledgerEntries: [newEntry, ...state.ledgerEntries] };
  }),
  incrementBlock: () => set((state) => {
    // Randomize network load and gas for realism
    const newLoad = (1 + Math.random() * 0.5).toFixed(1) + 'ms';
    const newGas = Math.floor(85 + Math.random() * 15);
    const newStatus = newGas < 90 ? 'warning' : 'healthy';
    
    // Randomly fluctuate status matrix for demo
    const newMatrix: StatusMatrix = {
      core: Math.random() > 0.95 ? 'yellow' : 'green',
      access: Math.random() > 0.9 ? 'orange' : 'green',
      finance: Math.random() > 0.95 ? 'yellow' : 'green',
      infra: state.repairState === 'syncing' ? 'orange' : (Math.random() > 0.98 ? 'red' : 'green'),
      gov: Math.random() > 0.9 ? 'blue' : 'green',
    };

    // Add AI logs and notifications for status changes
    const logs = [...state.logs];
    
    if (newMatrix.infra === 'red' && state.statusMatrix.infra !== 'red') {
      const msg = "Critical state inconsistency in INFRA. AutoRepair required.";
      logs.unshift({ id: Math.random().toString(36).substr(2, 9), message: msg, type: 'ai', timestamp: Date.now() });
      state.addNotification(msg, 'error');
    } else if (newMatrix.access === 'orange' && state.statusMatrix.access !== 'orange') {
      const msg = "Sentinel: High-risk traffic detected. Monitoring Access Gateway.";
      logs.unshift({ id: Math.random().toString(36).substr(2, 9), message: msg, type: 'ai', timestamp: Date.now() });
      state.addNotification(msg, 'warning');
    } else if (newMatrix.gov === 'blue' && state.statusMatrix.gov !== 'blue') {
      const msg = "AuditVoice: New DAO proposal detected. Voting period active.";
      logs.unshift({ id: Math.random().toString(36).substr(2, 9), message: msg, type: 'ai', timestamp: Date.now() });
      state.addNotification(msg, 'info');
    }

    return { 
      blockNumber: state.blockNumber + 1,
      epochTime: state.epochTime + 3,
      networkLoad: newLoad,
      gasEfficiency: newGas,
      networkStatus: newStatus as any,
      statusMatrix: newMatrix,
      logs: logs.slice(0, 50),
      analyticsData: [...state.analyticsData.slice(1), {
        timestamp: state.epochTime + 3,
        gas: newGas,
        load: parseFloat(newLoad),
        treasury: state.analyticsData[state.analyticsData.length - 1].treasury + (Math.random() * 100 - 20)
      }]
    };
  }),
  setProcessing: (val) => set({ isProcessing: val }),
  setActiveView: (view) => set({ activeView: view, isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  triggerUpgrade: () => set({ upgradeAvailable: true }),
  dismissUpgrade: () => set({ upgradeAvailable: false }),
  setPermissionLevel: (level) => set({ permissionLevel: level }),
  setActiveNotary: (notary) => set({ activeNotary: notary }),
  addPendingTx: (tx) => set((state) => ({
    pendingTransactions: [...state.pendingTransactions, { ...tx, id: Math.random().toString(36).substr(2, 9), currentSignatures: 0 }]
  })),
  triggerRepair: (target = 'Global State') => set((state) => {
    state.addLog(`Sentinel: Initiating Auto-Repair sequence for ${target}...`, "ai");
    setTimeout(() => {
      set({ repairState: 'stable', repairTarget: null });
      useAoxcStore.getState().addLog(`Gemini: ${target} state restored. System stable.`, "ai");
    }, 5000);
    return { repairState: 'syncing', repairTarget: target };
  }),
  approvePendingTx: (id) => set((state) => {
    const tx = state.pendingTransactions.find(t => t.id === id);
    if (!tx) return state;
    
    const updatedTx = { ...tx, currentSignatures: tx.currentSignatures + 1 };
    if (updatedTx.currentSignatures >= updatedTx.requiredSignatures) {
      // Execute transaction
      const newEntry: LedgerEntry = {
        id: Math.random().toString(36).substr(2, 9),
        index: state.ledgerEntries.length + 1,
        timestamp: state.epochTime,
        module: updatedTx.module,
        operation: updatedTx.operation,
        status: 'SUCCESS',
        aiVerification: 'DAO Multi-sig consensus achieved.'
      };
      return {
        pendingTransactions: state.pendingTransactions.filter(t => t.id !== id),
        ledgerEntries: [newEntry, ...state.ledgerEntries]
      };
    }
    return {
      pendingTransactions: state.pendingTransactions.map(t => t.id === id ? updatedTx : t)
    };
  }),
}));
