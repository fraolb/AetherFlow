"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";

interface Strategy {
  id: string;
  name: string;
  description: string;
  risk: "low" | "medium" | "high";
  apy: number;
  chains: string[];
  protocols: string[];
  tvl: number;
  recommended: boolean;
}

const StrategyBuilder: React.FC = () => {
  const { address } = useAccount();
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const predefinedStrategies: Strategy[] = [
    {
      id: "yield-optimizer",
      name: "Yield Optimizer Pro",
      description:
        "Automatically moves funds to highest yielding protocols across chains with risk management",
      risk: "medium",
      apy: 12.8,
      chains: ["Ethereum", "Arbitrum", "Optimism", "Base"],
      protocols: ["Aave", "Compound", "Curve", "Uniswap V3"],
      tvl: 45000000,
      recommended: true,
    },
    {
      id: "safe-staking",
      name: "Safe Staking Suite",
      description:
        "Low-risk staking across multiple chains with insurance coverage",
      risk: "low",
      apy: 5.2,
      chains: ["Ethereum", "Polygon"],
      protocols: ["Lido", "Rocket Pool", "Stakewise"],
      tvl: 32000000,
      recommended: true,
    },
    {
      id: "airdrop-hunter",
      name: "Airdrop Hunter Max",
      description:
        "Optimizes for potential airdrops while maintaining yield generation",
      risk: "high",
      apy: 18.3,
      chains: ["Base", "Arbitrum", "zkSync", "Starknet"],
      protocols: ["LayerZero", "zkSync Era", "Starknet", "Arbitrum Nova"],
      tvl: 15600000,
      recommended: false,
    },
    {
      id: "defi-bluechip",
      name: "DeFi Blue Chip",
      description:
        "Conservative strategy focusing on established protocols with proven track records",
      risk: "low",
      apy: 7.4,
      chains: ["Ethereum", "Arbitrum"],
      protocols: ["Uniswap", "Aave", "Compound", "MakerDAO"],
      tvl: 89000000,
      recommended: false,
    },
  ];

  const riskColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const handleGenerateStrategy = async () => {
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    // Simulate AI strategy generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);

    // In real implementation, this would call your AI backend
    console.log("Generating strategy for:", customPrompt);
  };

  const executeStrategy = (strategyId: string) => {
    // In real implementation, this would execute via Avail Nexus
    console.log("Executing strategy:", strategyId);
    alert(`Strategy ${strategyId} execution started via Avail Nexus!`);
  };

  return (
    <div className="space-y-6">
      {/* AI Strategy Generator */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Strategy Generator</h2>
            <p className="text-gray-400">
              Powered by ASI Alliance & Blockscout MCP
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your strategy: 'I want medium risk yield farming across Arbitrum and Optimism...'"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGenerateStrategy}
              disabled={isGenerating || !customPrompt.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>

          {isGenerating && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <div>
                  <div className="font-semibold">
                    AI is crafting your strategy...
                  </div>
                  <div className="text-sm text-gray-400">
                    Analyzing 45+ protocols across 8 chains using Blockscout MCP
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Predefined Strategies */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-6">Predefined Strategies</h3>

        <div className="grid gap-4">
          {predefinedStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`bg-white/5 rounded-xl p-4 border transition-all hover:border-white/30 cursor-pointer ${
                selectedStrategy === strategy.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10"
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold">{strategy.name}</h4>
                  {strategy.recommended && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-400">
                    {strategy.apy}% APY
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      riskColors[strategy.risk]
                    }`}
                  >
                    {strategy.risk.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{strategy.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {strategy.chains.map((chain) => (
                  <span
                    key={chain}
                    className="bg-white/10 px-2 py-1 rounded text-sm"
                  >
                    {chain}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  TVL: ${(strategy.tvl / 1000000).toFixed(1)}M
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    executeStrategy(strategy.id);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                >
                  Execute via Avail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Details */}
      {selectedStrategy && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Strategy Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Execution Plan</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span>Cross-chain bridge via Avail</span>
                  <span className="text-green-400">Ready</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span>Protocol interactions</span>
                  <span className="text-yellow-400">Pending</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span>Risk assessment</span>
                  <span className="text-green-400">Complete</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Expected Outcomes</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Estimated APY:</span>
                  <span className="text-green-400">12.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas costs:</span>
                  <span>$12-18</span>
                </div>
                <div className="flex justify-between">
                  <span>Time to deploy:</span>
                  <span>2-5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Chains involved:</span>
                  <span>4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Status */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">Technology Integration</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              🌉
            </div>
            <div className="font-semibold">Avail Nexus</div>
            <div className="text-sm text-green-400">Connected</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              🤖
            </div>
            <div className="font-semibold">ASI Alliance</div>
            <div className="text-sm text-green-400">Active</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              📊
            </div>
            <div className="font-semibold">Blockscout MCP</div>
            <div className="text-sm text-green-400">Analyzing</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              ⚡
            </div>
            <div className="font-semibold">Envio Data</div>
            <div className="text-sm text-green-400">Streaming</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
