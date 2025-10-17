"use client";

import React, { useState } from "react";

interface ChainData {
  name: string;
  tvl: number;
  volume: number;
  users: number;
  apy: number;
  gasPrice: number;
  status: "active" | "congested" | "idle";
}

interface ProtocolMetric {
  name: string;
  chain: string;
  tvl: number;
  volume24h: number;
  apy: number;
  change: number;
}

const ChainMetrics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [selectedChain, setSelectedChain] = useState<string>("all");

  const chainData: ChainData[] = [
    {
      name: "Ethereum",
      tvl: 45200000000,
      volume: 1250000000,
      users: 2450000,
      apy: 4.2,
      gasPrice: 32,
      status: "active",
    },
    {
      name: "Arbitrum",
      tvl: 2850000000,
      volume: 450000000,
      users: 890000,
      apy: 8.7,
      gasPrice: 0.12,
      status: "active",
    },
    {
      name: "Optimism",
      tvl: 1980000000,
      volume: 320000000,
      users: 567000,
      apy: 7.9,
      gasPrice: 0.08,
      status: "active",
    },
    {
      name: "Polygon",
      tvl: 1230000000,
      volume: 198000000,
      users: 432000,
      apy: 6.3,
      gasPrice: 0.15,
      status: "congested",
    },
    {
      name: "Base",
      tvl: 876000000,
      volume: 156000000,
      users: 298000,
      apy: 12.4,
      gasPrice: 0.05,
      status: "active",
    },
  ];

  const protocolMetrics: ProtocolMetric[] = [
    {
      name: "Uniswap V3",
      chain: "Ethereum",
      tvl: 3450000000,
      volume24h: 450000000,
      apy: 15.2,
      change: 2.3,
    },
    {
      name: "Aave V3",
      chain: "Arbitrum",
      tvl: 1980000000,
      volume24h: 89000000,
      apy: 8.7,
      change: 1.2,
    },
    {
      name: "Curve Finance",
      chain: "Ethereum",
      tvl: 2870000000,
      volume24h: 234000000,
      apy: 6.4,
      change: -0.5,
    },
    {
      name: "Compound V3",
      chain: "Base",
      tvl: 456000000,
      volume24h: 67000000,
      apy: 5.8,
      change: 3.1,
    },
    {
      name: "Balancer V2",
      chain: "Polygon",
      tvl: 234000000,
      volume24h: 45000000,
      apy: 12.3,
      change: 4.2,
    },
  ];

  const statusColors = {
    active: "bg-green-500",
    congested: "bg-yellow-500",
    idle: "bg-gray-500",
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    }
    return `$${num}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Multi-Chain Analytics</h2>
            <p className="text-gray-400">
              Powered by Envio HyperSync & Blockscout MCP
            </p>
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Chains</option>
              {chainData.map((chain) => (
                <option key={chain.name} value={chain.name}>
                  {chain.name}
                </option>
              ))}
            </select>

            <div className="flex bg-white/5 rounded-lg p-1">
              {(["24h", "7d", "30d"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    timeframe === period
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chain Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {chainData.map((chain) => (
          <div
            key={chain.name}
            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{chain.name}</h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 ${
                    statusColors[chain.status]
                  } rounded-full`}
                ></div>
                <span className="text-xs text-gray-400 capitalize">
                  {chain.status}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">TVL:</span>
                <span className="font-semibold">{formatNumber(chain.tvl)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume:</span>
                <span className="font-semibold">
                  {formatNumber(chain.volume)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Users:</span>
                <span className="font-semibold">
                  {(chain.users / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg APY:</span>
                <span className="font-semibold text-green-400">
                  {chain.apy}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Gas:</span>
                <span className="font-semibold">{chain.gasPrice} Gwei</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Visualizations */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* TVL Distribution */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">TVL Distribution</h3>
          <div className="space-y-3">
            {chainData.map((chain) => {
              const totalTVL = chainData.reduce((sum, c) => sum + c.tvl, 0);
              const percentage = (chain.tvl / totalTVL) * 100;

              return (
                <div key={chain.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{chain.name}</span>
                    <span>
                      {formatNumber(chain.tvl)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protocol Performance */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Top Protocols</h3>
          <div className="space-y-4">
            {protocolMetrics.map((protocol, index) => (
              <div
                key={protocol.name}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{protocol.name}</div>
                    <div className="text-xs text-gray-400">
                      {protocol.chain}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {formatNumber(protocol.tvl)}
                  </div>
                  <div
                    className={`text-xs ${
                      protocol.change >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {protocol.change >= 0 ? "+" : ""}
                    {protocol.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">
          Protocol Performance Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Protocol
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Chain
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                  TVL
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                  24h Volume
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                  APY
                </th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {protocolMetrics.map((protocol) => (
                <tr
                  key={`${protocol.name}-${protocol.chain}`}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-3 px-4 font-semibold">{protocol.name}</td>
                  <td className="py-3 px-4">
                    <span className="bg-white/10 px-2 py-1 rounded text-sm">
                      {protocol.chain}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {formatNumber(protocol.tvl)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {formatNumber(protocol.volume24h)}
                  </td>
                  <td className="py-3 px-4 text-right text-green-400">
                    {protocol.apy}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`${
                        protocol.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {protocol.change >= 0 ? "+" : ""}
                      {protocol.change}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Data Status */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">Data Integration Status</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-semibold">Envio HyperSync</div>
                <div className="text-sm text-gray-400">
                  Real-time data streaming active
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-semibold">Blockscout MCP</div>
                <div className="text-sm text-gray-400">
                  AI analytics processing
                </div>
              </div>
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <div className="font-semibold">Avail Nexus</div>
                <div className="text-sm text-gray-400">Cross-chain ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainMetrics;
