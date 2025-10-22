"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  return (
    <div className="min-h-screen text-white bg-black">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AetherFlow
          </span>
        </div>
        <div className="flex gap-2">
          {isConnected && (
            <button
              className="p-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 border border-blue-800 rounded-2xl hover:cursor-pointer"
              onClick={() => router.push("/Dashboard")}
            >
              Go to Dashboard
            </button>
          )}

          <ConnectButton
            showBalance={false}
            accountStatus="address"
            chainStatus="icon"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              DeFi Strategist
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Automatically find and execute the most profitable opportunities
            across multiple blockchains. Powered by AI intelligence and
            cross-chain technology.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-center w-full">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mb-2 flex items-center justify-center">
                  🤖
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-300">
                Natural language interface powered by ASI Alliance
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-center w-full">
                <div className="w-12 h-12 bg-green-500 rounded-lg mb-2 flex items-center justify-center">
                  🌉
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Cross-Chain</h3>
              <p className="text-gray-300">
                Seamless asset movement via Avail Nexus SDK
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-center w-full">
                <div className="w-12 h-12 bg-purple-500 rounded-lg mb-2 flex items-center justify-center">
                  ⚡
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time</h3>
              <p className="text-gray-300">
                Live data streams from Envio HyperSync
              </p>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-0.5 rounded-2xl inline-block">
              <ConnectButton
                label="Launch AetherFlow"
                showBalance={true}
                accountStatus="full"
                chainStatus="full"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Connect your wallet to start optimizing your multi-chain portfolio
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400">45+</div>
            <div className="text-gray-400">Protocols</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">8</div>
            <div className="text-gray-400">Chains</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">$12.8M</div>
            <div className="text-gray-400">Optimized</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">24/7</div>
            <div className="text-gray-400">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
}
