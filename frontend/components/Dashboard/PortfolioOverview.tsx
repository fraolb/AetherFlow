import React from "react";

const PortfolioOverview: React.FC = () => {
  const portfolioData = {
    totalValue: 12543.67,
    chains: [
      { name: "Ethereum", value: 5432.1, color: "bg-blue-500" },
      { name: "Arbitrum", value: 3210.45, color: "bg-cyan-500" },
      { name: "Optimism", value: 1987.32, color: "bg-red-500" },
      { name: "Polygon", value: 1234.56, color: "bg-purple-500" },
      { name: "Base", value: 679.24, color: "bg-blue-400" },
    ],
    assets: [
      { name: "ETH", value: 5432.1, change: 2.3 },
      { name: "USDC", value: 3210.45, change: 0.1 },
      { name: "ARB", value: 987.32, change: -1.2 },
      { name: "OP", value: 654.32, change: 3.4 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Total Value Card */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">Portfolio Value</h2>
            <p className="text-gray-400">Across all chains and assets</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              ${portfolioData.totalValue.toLocaleString()}
            </div>
            <div className="text-green-400">+5.3% today</div>
          </div>
        </div>

        {/* Chain Distribution */}
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Chain Distribution</h3>
          <div className="flex h-4 bg-white/10 rounded-full overflow-hidden">
            {portfolioData.chains.map((chain, index) => (
              <div
                key={chain.name}
                className={`${chain.color}`}
                style={{
                  width: `${(chain.value / portfolioData.totalValue) * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {portfolioData.chains.map((chain) => (
              <div key={chain.name} className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-3 h-3 ${chain.color} rounded-full`}></div>
                  <span className="text-sm font-medium">{chain.name}</span>
                </div>
                <div className="text-lg font-semibold">
                  ${chain.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-semibold mb-4">Assets</h3>
        <div className="space-y-4">
          {portfolioData.assets.map((asset) => (
            <div
              key={asset.name}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {asset.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{asset.name}</div>
                  <div className="text-sm text-gray-400">Multi-chain</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  ${asset.value.toLocaleString()}
                </div>
                <div
                  className={`text-sm ${
                    asset.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {asset.change >= 0 ? "+" : ""}
                  {asset.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioOverview;
