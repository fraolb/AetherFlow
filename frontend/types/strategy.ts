export interface Strategy {
  id: string;
  name: string;
  description: string;
  risk: "low" | "medium" | "high";
  apy: number;
  chains: string[];
  protocols: string[];
  tvl: number;
  recommended: boolean;
  type: "bridge" | "execute" | "bridge-execute";
  executionSteps: string[];
  recommendedAmount: number;
  token: string;
  contractAddress?: string;
  functionName?: string;
}
