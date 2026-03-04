import { createPublicClient, http, defineChain, formatEther, parseAbiItem } from 'viem';

export const xlayerTestnet = defineChain({
  id: 1952,
  name: 'XLayer Testnet',
  network: 'xlayer-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    default: {
      http: ['https://testrpc.xlayer.tech/terigon'],
    },
    public: {
      http: ['https://testrpc.xlayer.tech/terigon'],
    },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/xlayer-test' },
  },
});

export const publicClient = createPublicClient({
  chain: xlayerTestnet,
  transport: http(),
});

export const getBlockNumber = async () => {
  try {
    return await publicClient.getBlockNumber();
  } catch (error) {
    console.error("XLayer RPC Error (getBlockNumber):", error);
    return null;
  }
};

export const getGasPrice = async () => {
  try {
    return await publicClient.getGasPrice();
  } catch (error) {
    console.error("XLayer RPC Error (getGasPrice):", error);
    return null;
  }
};

export const getBalance = async (address: `0x${string}`) => {
  try {
    const balance = await publicClient.getBalance({ address });
    return formatEther(balance);
  } catch (error) {
    console.error("XLayer RPC Error (getBalance):", error);
    return null;
  }
};

export const getLogs = async (address: `0x${string}`, fromBlock?: bigint) => {
  try {
    return await publicClient.getLogs({
      address,
      fromBlock: fromBlock || 'earliest',
      toBlock: 'latest'
    });
  } catch (error) {
    console.error("XLayer RPC Error (getLogs):", error);
    return [];
  }
};

// Simulation for Gemini
export const simulateTransaction = async (to: `0x${string}`, data: `0x${string}`, value: bigint = 0n) => {
  try {
    const gasEstimate = await publicClient.estimateGas({
      account: '0x0000000000000000000000000000000000000000', // Simulation account
      to,
      data,
      value
    });
    
    const result = await publicClient.call({
      to,
      data,
      value
    });

    return {
      success: true,
      gasEstimate: gasEstimate.toString(),
      result: result.data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Debug Trace (Mocked if not supported by public RPC, but attempting structure)
export const debugTrace = async (txHash: string) => {
  // Note: Public RPCs usually disable debug_traceTransaction. 
  // We will try to fetch receipt as a proxy for "debugging" status.
  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash as `0x${string}` });
    return {
      status: receipt.status,
      gasUsed: receipt.gasUsed.toString(),
      logs: receipt.logs,
      effectiveGasPrice: receipt.effectiveGasPrice.toString()
    };
  } catch (error) {
    console.error("XLayer RPC Error (debugTrace):", error);
    return null;
  }
};
