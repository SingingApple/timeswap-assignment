"use client";

import { useState, useCallback } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { useTransactionQueue } from "../contexts/TransactionContext";

export interface RapidTransactionConfig {
  recipient: `0x${string}`;
  amount: string;
  count: number;
  delay: number;
}

export interface RapidBatch {
  config: RapidTransactionConfig;
  completed: number;
  total: number;
  startTime: number;
}

export const useRapidTransactions = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { addTransaction } = useTransactionQueue();

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBatch, setCurrentBatch] = useState<RapidBatch | null>(null);

  const sendRapidTransactions = useCallback(
    async (config: RapidTransactionConfig) => {
      if (!walletClient || !address || !publicClient) {
        throw new Error("Wallet not connected");
      }

      setIsRunning(true);
      setError(null);
      setCurrentBatch({
        config,
        completed: 0,
        total: config.count,
        startTime: Date.now(),
      });

      try {
        const nonce = await publicClient.getTransactionCount({ address });

        const amountWei = parseEther(config.amount);

        const gasPrice = await publicClient.getGasPrice();

        for (let i = 0; i < config.count; i++) {
          try {
            const txHash = await walletClient.sendTransaction({
              to: config.recipient,
              value: amountWei,
              gas: BigInt(21000),
              gasPrice,
              nonce: nonce + i,
            });
            addTransaction({
              hash: txHash,
              nonce: nonce + i,
              to: config.recipient,
              value: amountWei,
              gasPrice,
              gasLimit: BigInt(21000),
              status: "pending",
              type: "transfer",
              description: `Rapid transfer ${i + 1}/${config.count}: ${
                config.amount
              } ETH to ${config.recipient.slice(0, 10)}...`,
            });

            setCurrentBatch((prev) =>
              prev ? { ...prev, completed: prev.completed + 1 } : null
            );

            if (config.delay > 0 && i < config.count - 1) {
              await new Promise((resolve) => setTimeout(resolve, config.delay));
            }
          } catch (error) {
            console.error(`Transaction ${i + 1} failed:`, error);
            throw error;
          }
        }
      } catch (error) {
        console.error("Rapid transactions failed:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setIsRunning(false);
        setTimeout(() => {
          setCurrentBatch(null);
        }, 3000);
      }
    },
    [walletClient, address, publicClient, addTransaction]
  );

  const stopRapidTransactions = useCallback(() => {
    setIsRunning(false);
    setCurrentBatch(null);
    setError("Rapid transactions stopped by user");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendRapidTransactions,
    stopRapidTransactions,
    isRunning,
    error,
    currentBatch,
    clearError,
  };
};
