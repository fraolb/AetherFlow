"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useAvailSDK } from "../../hooks/useAvailSDK";
import { NexusSDK } from "@avail-project/nexus-core";
import type {
  UserAsset,
  BridgeResult,
  ExecuteResult,
  BridgeAndExecuteResult,
  ProgressStep,
} from "@avail-project/nexus-core";

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
  type: "bridge" | "execute" | "bridge-execute";
  contractAddress?: string;
  functionName?: string;
}

const StrategyBuilder: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { sdk, isInitialized, executeStrategy, getBalances, initializeSDK } =
    useAvailSDK();
  const [selectedStrategy, setSelectedStrategy] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState<ProgressStep[]>(
    []
  );
  const [balances, setBalances] = useState<UserAsset[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("");

  // Load balances when SDK is initialized
  useEffect(() => {
    if (isInitialized && address) {
      loadBalances();
      return;
    }

    // If wallet connects and SDK not initialized, try to initialize with window provider
    if (!isInitialized && address) {
      try {
        // initialize with injected provider if available
        initializeSDK();
      } catch (err) {
        console.error("Failed to initialize SDK on connect:", err);
      }
    }
  }, [isInitialized, address]);

  const loadBalances = async () => {
    try {
      const balanceData = await getBalances();
      setBalances(balanceData);
    } catch (error) {
      console.error("Failed to load balances:", error);
    }
  };

  const predefinedStrategies: Strategy[] = [
    {
      id: "yield-optimizer",
      name: "Yield Optimizer Pro",
      description:
        "Automatically bridge USDC to highest yielding protocols across chains",
      risk: "medium",
      apy: 12.8,
      chains: ["Ethereum", "Arbitrum", "Optimism", "Polygon"],
      protocols: ["Aave", "Compound", "Curve"],
      tvl: 45000000,
      recommended: true,
      type: "bridge",
    },
    {
      id: "aave-supply",
      name: "Aave Cross-Chain Supply",
      description:
        "Bridge and supply USDC to Aave on Ethereum for lending yield",
      risk: "low",
      apy: 5.2,
      chains: ["Arbitrum", "Optimism", "Base"],
      protocols: ["Aave"],
      tvl: 32000000,
      recommended: true,
      type: "bridge-execute",
      contractAddress: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", // Aave Lending Pool
      functionName: "deposit",
    },
    {
      id: "compound-supply",
      name: "Compound V3 Supply",
      description:
        "Execute supply function on Compound V3 with cross-chain funds",
      risk: "medium",
      apy: 7.4,
      chains: ["Ethereum"],
      protocols: ["Compound"],
      tvl: 89000000,
      recommended: false,
      type: "execute",
      contractAddress: "0xc3d688B66703497DAA19211EEdff47f25384cdc3", // Compound V3 USDC Market
      functionName: "supply",
    },
    {
      id: "yearn-deposit",
      name: "Yearn Vault Deposit",
      description: "Bridge USDC and deposit into Yearn yield vault",
      risk: "medium",
      apy: 8.9,
      chains: ["Ethereum", "Arbitrum"],
      protocols: ["Yearn"],
      tvl: 15600000,
      recommended: false,
      type: "bridge-execute",
      contractAddress: "0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE", // Yearn USDC Vault
      functionName: "deposit",
    },
  ];

  // Event listeners for execution progress
  useEffect(() => {
    if (!sdk) return;

    const handleExpectedSteps = (steps: ProgressStep[]) => {
      setExecutionProgress(steps);
      console.log(
        "Expected steps:",
        steps.map((s) => s.typeID)
      );
    };

    const handleStepComplete = (step: ProgressStep) => {
      setCurrentStep(step.typeID);
      console.log("Step completed:", step.typeID, step.data);

      const explorer = (step.data as any)?.explorerURL;
      if (step.typeID === "IS" && explorer) {
        console.log("View transaction:", explorer);
      }
    };

    // Subscribe to progress events (guard existence)
    try {
      const anySdk = sdk as any;
      anySdk.nexusEvents?.on?.("expected_steps", handleExpectedSteps);
      anySdk.nexusEvents?.on?.("step_complete", handleStepComplete);
      anySdk.nexusEvents?.on?.(
        "bridge_execute_expected_steps",
        handleExpectedSteps
      );
      anySdk.nexusEvents?.on?.(
        "bridge_execute_completed_steps",
        handleStepComplete
      );
    } catch (e) {
      // ignore subscription errors
    }

    return () => {
      try {
        const anySdk = sdk as any;
        anySdk.nexusEvents?.off?.("expected_steps", handleExpectedSteps);
        anySdk.nexusEvents?.off?.("step_complete", handleStepComplete);
        anySdk.nexusEvents?.off?.(
          "bridge_execute_expected_steps",
          handleExpectedSteps
        );
        anySdk.nexusEvents?.off?.(
          "bridge_execute_completed_steps",
          handleStepComplete
        );
      } catch (e) {
        // ignore
      }
    };
  }, [sdk]);

  const handleGenerateStrategy = async () => {
    if (!customPrompt.trim()) return;

    setIsGenerating(true);
    // Simulate AI strategy generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In real implementation, this would call your AI backend
    // and return a strategy object compatible with Avail SDK
    const generatedStrategy = {
      id: "custom-" + Date.now(),
      name: "Custom Strategy",
      description: customPrompt,
      risk: "medium" as const,
      apy: 9.5,
      chains: ["Ethereum", "Arbitrum"],
      protocols: ["Aave", "Uniswap"],
      tvl: 0,
      recommended: false,
      type: "bridge",
    };

    setIsGenerating(false);
    // Add to strategies or set as selected
    setSelectedStrategy(generatedStrategy.id);
  };

  const handleExecuteStrategy = async (strategyId: string) => {
    if (!isInitialized || !sdk || !address) {
      alert("Please connect wallet and initialize Avail SDK");
      return;
    }

    const strategy = predefinedStrategies.find((s) => s.id === strategyId);
    if (!strategy) return;

    setIsExecuting(true);
    setExecutionProgress([]);
    setCurrentStep("");

    try {
      let result: any;

      switch (strategy.type) {
        case "bridge":
          result = await executeBridgeStrategy(strategy);
          break;
        case "execute":
          result = await executeContractStrategy(strategy);
          break;
        case "bridge-execute":
          result = await executeBridgeAndExecuteStrategy(strategy);
          break;
        default:
          throw new Error("Unknown strategy type");
      }

      if (result?.success) {
        alert(`✅ Strategy "${strategy.name}" executed successfully!`);
        if (result?.explorerUrl) {
          console.log("View transaction:", result.explorerUrl);
        }
      } else {
        alert(
          `❌ Strategy execution failed: ${
            result?.error ?? JSON.stringify(result)
          }`
        );
      }
    } catch (error) {
      console.error("Strategy execution error:", error);
      const msg = error instanceof Error ? error.message : String(error);
      alert(`❌ Error executing strategy: ${msg}`);
    } finally {
      setIsExecuting(false);
      // Reload balances after execution
      await loadBalances();
    }
  };

  const executeBridgeStrategy = async (
    strategy: Strategy
  ): Promise<BridgeResult> => {
    return await sdk!.bridge({
      token: "USDC",
      amount: 100, // Example amount
      chainId: 137, // Polygon
      sourceChains: [42161, 10], // Use USDC from Arbitrum and Optimism
    });
  };

  const executeContractStrategy = async (
    strategy: Strategy
  ): Promise<ExecuteResult> => {
    return await sdk!.execute({
      toChainId: 1, // Ethereum
      contractAddress: strategy.contractAddress!,
      contractAbi: [
        {
          inputs: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: strategy.functionName!,
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: strategy.functionName!,
      buildFunctionParams: (
        token: any, // SUPPORTED_TOKENS
        amount: string,
        chainId: any, // SUPPORTED_CHAINS_IDS
        userAddress: string
      ) => {
        // This would use actual token metadata in production
        const decimals = 6; // USDC decimals
        const parsed = parseFloat(amount || "0");
        const amountWei = BigInt(Math.floor(parsed * 10 ** decimals));
        const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC on Ethereum

        return {
          functionParams: [tokenAddress, amountWei],
        };
      },
      waitForReceipt: true,
      tokenApproval: {
        token: "USDC",
        amount: "100000000", // 100 USDC
      },
    });
  };

  const executeBridgeAndExecuteStrategy = async (
    strategy: Strategy
  ): Promise<BridgeAndExecuteResult> => {
    return await sdk!.bridgeAndExecute({
      token: "USDC",
      amount: "100000000", // 100 USDC
      toChainId: 1, // Ethereum
      sourceChains: [8453], // Use USDC from Base
      execute: {
        contractAddress: strategy.contractAddress!,
        contractAbi: [
          {
            inputs: [
              { internalType: "uint256", name: "assets", type: "uint256" },
              { internalType: "address", name: "receiver", type: "address" },
            ],
            name: strategy.functionName!,
            outputs: [
              { internalType: "uint256", name: "shares", type: "uint256" },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: strategy.functionName!,
        buildFunctionParams: (
          token: any,
          amount: string,
          chainId: any,
          userAddress: string
        ) => {
          const decimals = 6;
          const parsed = parseFloat(amount || "0");
          const amountWei = BigInt(Math.floor(parsed * 10 ** decimals));
          return {
            functionParams: [amountWei, userAddress],
          };
        },
        tokenApproval: {
          token: "USDC",
          amount: "100000000",
        },
      },
      waitForReceipt: true,
    });
  };

  const riskColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const getStepDescription = (stepId: string): string => {
    const stepDescriptions: { [key: string]: string } = {
      CS: "Checking sources and calculating fees",
      TS: "Processing token approvals",
      IS: "Executing transaction",
      BS: "Bridging assets between chains",
      ES: "Executing contract function",
    };
    return stepDescriptions[stepId] || stepId;
  };

  return (
    <div className="space-y-6">
      {/* SDK Status */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Cross-Chain Strategy Builder</h2>
            <p className="text-gray-400">Powered by Avail Nexus SDK</p>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                isInitialized ? "text-green-400" : "text-yellow-400"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  isInitialized ? "bg-green-400" : "bg-yellow-400"
                }`}
              ></div>
              <span>
                Avail SDK: {isInitialized ? "Connected" : "Initializing..."}
              </span>
            </div>
            {address && (
              <div className="text-sm text-gray-400">
                Connected: {address.slice(0, 8)}...{address.slice(-6)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balance Overview */}
      {balances.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Unified Balances</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {balances.slice(0, 4).map((asset) => (
              <div key={asset.symbol} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{asset.symbol}</div>
                    <div className="text-2xl font-bold mt-1">
                      {parseFloat(asset.balance).toFixed(4)}
                    </div>
                  </div>
                  {asset.balanceInFiat && (
                    <div className="text-sm text-gray-400">
                      ${parseFloat(String(asset.balanceInFiat)).toFixed(2)}
                    </div>
                  )}
                </div>
                {asset.breakdown && (
                  <div className="text-xs text-gray-400 mt-2">
                    Across {asset.breakdown.length} chains
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategy Execution Progress */}
      {isExecuting && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">
            Strategy Execution Progress
          </h3>
          <div className="space-y-4">
            {executionProgress.map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step.typeID
                      ? "bg-blue-500"
                      : executionProgress.findIndex(
                          (s) => s.typeID === step.typeID
                        ) <
                        executionProgress.findIndex(
                          (s) => s.typeID === currentStep
                        )
                      ? "bg-green-500"
                      : "bg-white/10"
                  }`}
                >
                  {currentStep === step.typeID
                    ? "⟳"
                    : executionProgress.findIndex(
                        (s) => s.typeID === step.typeID
                      ) <
                      executionProgress.findIndex(
                        (s) => s.typeID === currentStep
                      )
                    ? "✓"
                    : index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {getStepDescription(step.typeID)}
                  </div>
                  <div className="text-sm text-gray-400">
                    Step {index + 1} of {executionProgress.length}
                  </div>
                </div>
                {currentStep === step.typeID && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Strategy Generator */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Strategy Generator</h2>
            <p className="text-gray-400">
              Describe your cross-chain DeFi strategy in natural language
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., 'Bridge 100 USDC from Arbitrum to Polygon and supply to Aave for yield'"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isInitialized}
            />
            <button
              onClick={handleGenerateStrategy}
              disabled={isGenerating || !customPrompt.trim() || !isInitialized}
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
                    Analyzing cross-chain opportunities with Avail Nexus
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Predefined Strategies */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-6">
          Predefined Cross-Chain Strategies
        </h3>

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
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    {strategy.type.toUpperCase()}
                  </span>
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
                {strategy.protocols.map((protocol) => (
                  <span
                    key={protocol}
                    className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm"
                  >
                    {protocol}
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
                  disabled={!isInitialized || isExecuting}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExecuting ? "Executing..." : "Execute via Avail"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SDK Features Showcase */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">Avail Nexus SDK Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              🌉
            </div>
            <div className="font-semibold">Cross-Chain Bridge</div>
            <div className="text-sm text-gray-400">
              Seamless asset transfer between chains
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              ⚡
            </div>
            <div className="font-semibold">Smart Execution</div>
            <div className="text-sm text-gray-400">
              Automated contract interactions
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              🔄
            </div>
            <div className="font-semibold">Bridge & Execute</div>
            <div className="text-sm text-gray-400">
              Single transaction for bridge + action
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              📊
            </div>
            <div className="font-semibold">Unified Balances</div>
            <div className="text-sm text-gray-400">
              View all assets across chains
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyBuilder;
