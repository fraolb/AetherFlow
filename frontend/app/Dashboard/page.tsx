"use client";

import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import PortfolioOverview from "@/components/Dashboard/PortfolioOverview";
import StrategyBuilder from "@/components/Dashboard/StrategyBuilder";
import ChainMetrics from "@/components/Dashboard/ChainMetric";

type TabType = "portfolio" | "strategies" | "analytics" | "chat";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("portfolio");
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const tabs = [
    { id: "portfolio", name: "Portfolio", icon: "📊" },
    { id: "strategies", name: "Strategies", icon: "🤖" },
    { id: "analytics", name: "Analytics", icon: "📈" },
    { id: "chat", name: "AI Assistant", icon: "💬" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AetherFlow
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {balance && (
              <div className="hidden sm:block bg-white/5 rounded-lg px-4 py-2">
                <div className="text-sm text-gray-400">Balance</div>
                <div className="font-semibold">
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </div>
              </div>
            )}
            <ConnectButton
              showBalance={false}
              accountStatus="address"
              chainStatus="icon"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto px-4 pb-2 space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome to AetherFlow, {address?.slice(0, 8)}...
              </h1>
              <p className="text-gray-300">
                Your AI-powered DeFi assistant is ready to optimize your
                multi-chain portfolio
              </p>
            </div>
            <div className="hidden md:block w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              🤖
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "portfolio" && <PortfolioOverview />}
            {activeTab === "strategies" && <StrategyBuilder />}
            {activeTab === "analytics" && <ChainMetrics />}
            {activeTab === "chat" && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-300">
                      "Hello! I'm your AetherFlow AI assistant. Ask me anything
                      about:
                    </p>
                    <ul className="mt-2 text-gray-400 space-y-1">
                      <li>• Best yield farming opportunities</li>
                      <li>• Portfolio rebalancing strategies</li>
                      <li>• Cross-chain asset movement</li>
                      <li>• Risk analysis and management</li>
                    </ul>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Ask about DeFi strategies..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold transition-colors">
                  🚀 Auto-Optimize Portfolio
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors">
                  🌉 Cross-Chain Swap
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition-colors">
                  📊 Generate Report
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Yield farm started</span>
                  <span className="text-green-400">+2.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cross-chain transfer</span>
                  <span className="text-blue-400">Arbitrum → Optimism</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Portfolio rebalanced</span>
                  <span className="text-purple-400">Auto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
