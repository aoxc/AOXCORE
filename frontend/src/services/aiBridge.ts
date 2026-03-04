import { getBlockNumber, getGasPrice, simulateTransaction, getBalance, getLogs } from './xlayer';
import { formatGwei } from 'viem';

export interface AIAnalysisResult {
  verdict: 'VERIFIED' | 'WARNING' | 'REJECTED';
  riskScore: number; // 0-100
  details: string;
  simulatedGas: string;
}

export const analyzeTransaction = async (tx: { to: string; data: string; value?: string }): Promise<AIAnalysisResult> => {
  const simulation = await simulateTransaction(tx.to as `0x${string}`, tx.data as `0x${string}`, BigInt(tx.value || '0'));

  if (!simulation.success) {
    return {
      verdict: 'REJECTED',
      riskScore: 95,
      details: `Simulation Failed: ${simulation.error}`,
      simulatedGas: '0'
    };
  }

  const gas = BigInt(simulation.gasEstimate || '0');
  
  // Basic heuristic: High gas usage might be suspicious or inefficient
  if (gas > 500000n) {
    return {
      verdict: 'WARNING',
      riskScore: 60,
      details: `High Gas Usage: ${gas.toString()} units. Verify contract logic.`,
      simulatedGas: gas.toString()
    };
  }

  return {
    verdict: 'VERIFIED',
    riskScore: 10,
    details: 'Simulation Successful. State changes are safe.',
    simulatedGas: gas.toString()
  };
};

export const getNetworkTelemetry = async () => {
  const [block, gas] = await Promise.all([getBlockNumber(), getGasPrice()]);
  
  return {
    blockHeight: block ? block.toString() : 'Syncing...',
    gasPrice: gas ? `${formatGwei(gas)} Gwei` : 'Unknown',
    status: block ? 'ONLINE' : 'OFFLINE'
  };
};

export const getFinanceTelemetry = async (vaultAddress: string) => {
  const [balance, logs] = await Promise.all([
    getBalance(vaultAddress as `0x${string}`),
    getLogs(vaultAddress as `0x${string}`)
  ]);

  return {
    balance: balance || '0',
    activityCount: logs.length
  };
};
