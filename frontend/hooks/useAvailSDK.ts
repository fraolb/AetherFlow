"use client";

import { useState, useEffect, useCallback } from "react";
import { NexusSDK } from "@avail-project/nexus-core";
import type {
  UserAsset,
  BridgeParams,
  ExecuteParams,
  BridgeAndExecuteParams,
  BridgeResult,
  ExecuteResult,
  BridgeAndExecuteResult,
} from "@avail-project/nexus-core";

export const useAvailSDK = () => {
  const [sdk, setSdk] = useState<NexusSDK | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize SDK
  const initializeSDK = useCallback(async (provider?: any) => {
    try {
      setError(null);
      const nexusSDK = new NexusSDK({ network: "testnet" });

      // If provider isn't passed, try to use window.ethereum (injected wallets)
      const initProvider =
        provider ??
        (typeof window !== "undefined" ? (window as any).ethereum : undefined);
      if (!initProvider) {
        throw new Error("No provider available to initialize Nexus SDK");
      }

      await nexusSDK.initialize(initProvider);

      // Set up intent hook for user confirmation (guarded)
      if (typeof nexusSDK.setOnIntentHook === "function") {
        nexusSDK.setOnIntentHook(({ intent, allow, deny }) => {
          try {
            const feeLabel = intent?.fees?.total || "0";
            if (
              typeof window !== "undefined" &&
              window.confirm(
                `Execute cross-chain strategy?\nFee: ${feeLabel} USDC`
              )
            ) {
              allow && allow();
            } else {
              deny && deny();
            }
          } catch (e) {
            try {
              deny && deny();
            } catch (err) {
              // ignore
            }
          }
        });
      }

      // Set up allowance hook
      if (typeof nexusSDK.setOnAllowanceHook === "function") {
        nexusSDK.setOnAllowanceHook(({ allow, deny, sources }) => {
          // Auto-approve minimum allowances for demo
          try {
            allow && allow(["min"]);
          } catch (e) {
            // no-op
          }
        });
      }

      setSdk(nexusSDK);
      setIsInitialized(true);
      return nexusSDK;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setIsInitialized(false);
      throw err;
    }
  }, []);

  // Get unified balances
  const getBalances = useCallback(async (): Promise<UserAsset[]> => {
    if (!sdk) throw new Error("SDK not initialized");
    return await sdk.getUnifiedBalances();
  }, [sdk]);

  // Execute bridge strategy
  const executeBridge = useCallback(
    async (params: BridgeParams): Promise<BridgeResult> => {
      if (!sdk) throw new Error("SDK not initialized");
      return await sdk.bridge(params);
    },
    [sdk]
  );

  // Execute contract strategy
  const executeContract = useCallback(
    async (params: ExecuteParams): Promise<ExecuteResult> => {
      if (!sdk) throw new Error("SDK not initialized");
      return await sdk.execute(params);
    },
    [sdk]
  );

  // Execute bridge and execute strategy
  const executeBridgeAndExecute = useCallback(
    async (params: BridgeAndExecuteParams): Promise<BridgeAndExecuteResult> => {
      if (!sdk) throw new Error("SDK not initialized");
      return await sdk.bridgeAndExecute(params);
    },
    [sdk]
  );

  // Generic strategy execution
  const executeStrategy = useCallback(
    async (strategy: any) => {
      if (!sdk) throw new Error("SDK not initialized");
      // Basic router for strategy shapes used in the UI
      if (!strategy || !strategy.type) {
        throw new Error("Invalid strategy");
      }

      switch (strategy.type) {
        case "bridge":
          return await sdk.bridge(strategy as BridgeParams);
        case "execute":
          return await sdk.execute(strategy as ExecuteParams);
        case "bridge-execute":
          return await sdk.bridgeAndExecute(strategy as BridgeAndExecuteParams);
        default:
          throw new Error("Unsupported strategy type");
      }
    },
    [sdk]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sdk) {
        try {
          const anySdk = sdk as any;
          if (typeof anySdk.removeAllListeners === "function") {
            anySdk.removeAllListeners();
          }
          if (typeof anySdk.deinit === "function") {
            // deinit may be async
            anySdk.deinit();
          }
        } catch (e) {
          // ignore
        }
      }
    };
  }, [sdk]);

  return {
    sdk,
    isInitialized,
    error,
    initializeSDK,
    getBalances,
    executeBridge,
    executeContract,
    executeBridgeAndExecute,
    executeStrategy,
  };
};
