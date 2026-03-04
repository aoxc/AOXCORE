import { useEffect } from 'react';
import { useAoxcStore } from '../store/useAoxcStore';

export const useAoxcClock = () => {
  const { incrementBlock, addLog, syncNetwork } = useAoxcStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // Try to sync with real network
      syncNetwork().then(() => {
        // Optional: Add logic here if needed after sync
      });

      // Keep simulation running for visual liveliness (or remove if fully real)
      incrementBlock(); 
      
      if (Math.random() > 0.8) {
        const repairs = ['AoxcAutoRepair checking state...', 'Optimizing gas limits...', 'Syncing AoxcClock...'];
        addLog(repairs[Math.floor(Math.random() * repairs.length)], 'info');
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [incrementBlock, addLog, syncNetwork]);
};
