"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export interface QueuedTransaction {
  id: string;
  hash: `0x${string}`;
  nonce: number;
  to: `0x${string}`;
  value: bigint;
  gasPrice: bigint;
  gasLimit: bigint;
  status: "pending" | "confirmed" | "failed" | "cancelled";
  type: "transfer" | "contract" | "approve";
  description: string;
  timestamp: number;
}

interface TransactionContextType {
  transactions: QueuedTransaction[];
  addTransaction: (tx: Omit<QueuedTransaction, "id" | "timestamp">) => void;
  updateTransactionStatus: (
    hash: `0x${string}`,
    status: QueuedTransaction["status"]
  ) => void;
  removeTransaction: (hash: `0x${string}`) => void;
  speedUpTransaction: (
    hash: `0x${string}`,
    gasIncrease?: number
  ) => Promise<`0x${string}` | undefined>;
  cancelTransaction: (
    hash: `0x${string}`
  ) => Promise<`0x${string}` | undefined>;
  isLoading: boolean;
  getStats: () => {
    pending: number;
    confirmed: number;
    failed: number;
    cancelled: number;
    total: number;
  };
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({
  children,
}) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [transactions, setTransactions] = useState<QueuedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("TRANSACTIONS", transactions);

  useEffect(() => {
    console.log("TRANSACTIONS updated:", transactions);
  }, [transactions]);

  const addTransaction = useCallback(
    (tx: Omit<QueuedTransaction, "id" | "timestamp">) => {
      console.log("Adding transaction to queue:", tx);
      const newTransaction: QueuedTransaction = {
        ...tx,
        id: `${tx.hash}-${Date.now()}`,
        timestamp: Date.now(),
      };

      setTransactions((prev) => {
        console.log("Previous transactions:", prev.length);
        const updated = [newTransaction, ...prev];
        console.log("Updated transactions:", updated.length);
        return updated;
      });
    },
    []
  );

  const updateTransactionStatus = useCallback(
    (hash: `0x${string}`, status: QueuedTransaction["status"]) => {
      setTransactions((prev) =>
        prev.map((tx) => (tx.hash === hash ? { ...tx, status } : tx))
      );
    },
    []
  );

  const removeTransaction = useCallback((hash: `0x${string}`) => {
    setTransactions((prev) => prev.filter((tx) => tx.hash !== hash));
  }, []);

  const speedUpTransaction = useCallback(
    async (hash: `0x${string}`, gasIncrease: number = 10) => {
      if (!walletClient || !address) return;

      try {
        setIsLoading(true);

        const currentTx = transactions.find((tx) => tx.hash === hash);
        if (!currentTx) throw new Error("Transaction not found");

        const gasPrice = await publicClient?.getGasPrice();
        if (!gasPrice) throw new Error("Could not get gas price");

        const newGasPrice =
          (gasPrice * BigInt(100 + gasIncrease)) / BigInt(100);

        const replacementTx = {
          to: currentTx.to,
          value: currentTx.value,
          gas: currentTx.gasLimit,
          gasPrice: newGasPrice,
          nonce: currentTx.nonce,
        };

        const newHash = await walletClient.sendTransaction(replacementTx);

        updateTransactionStatus(hash, "cancelled");
        addTransaction({
          ...currentTx,
          hash: newHash,
          gasPrice: newGasPrice,
          status: "pending",
        });

        return newHash;
      } catch (error) {
        console.error("Failed to speed up transaction:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      walletClient,
      address,
      publicClient,
      transactions,
      updateTransactionStatus,
      addTransaction,
    ]
  );

  const cancelTransaction = useCallback(
    async (hash: `0x${string}`) => {
      if (!walletClient || !address) return;

      try {
        setIsLoading(true);

        const currentTx = transactions.find((tx) => tx.hash === hash);
        if (!currentTx) throw new Error("Transaction not found");

        const gasPrice = await publicClient?.getGasPrice();
        if (!gasPrice) throw new Error("Could not get gas price");

        const cancelTx = {
          to: address,
          value: BigInt(0),
          gas: BigInt(21000),
          gasPrice,
          nonce: currentTx.nonce,
        };

        const cancelHash = await walletClient.sendTransaction(cancelTx);

        updateTransactionStatus(hash, "cancelled");

        addTransaction({
          hash: cancelHash,
          nonce: currentTx.nonce,
          to: address,
          value: BigInt(0),
          gasPrice,
          gasLimit: BigInt(21000),
          status: "pending",
          type: "transfer",
          description: `Cancel transaction ${hash.slice(0, 10)}...`,
        });

        return cancelHash;
      } catch (error) {
        console.error("Failed to cancel transaction:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      walletClient,
      address,
      publicClient,
      transactions,
      updateTransactionStatus,
      addTransaction,
    ]
  );

  useEffect(() => {
    const monitorTransactions = async () => {
      if (!publicClient || transactions.length === 0) return;

      const pendingTxs = transactions.filter((tx) => tx.status === "pending");

      for (const tx of pendingTxs) {
        try {
          const receipt = await publicClient.getTransactionReceipt({
            hash: tx.hash,
          });

          if (receipt) {
            if (receipt.status === "success") {
              updateTransactionStatus(tx.hash, "confirmed");
            } else {
              updateTransactionStatus(tx.hash, "failed");
            }
          }
        } catch {
          console.log(`Transaction ${tx.hash} not yet mined`);
        }
      }
    };

    const interval = setInterval(monitorTransactions, 5000);
    return () => clearInterval(interval);
  }, [publicClient, transactions, updateTransactionStatus]);

  const getStats = useCallback(() => {
    const pending = transactions.filter((tx) => tx.status === "pending").length;
    const confirmed = transactions.filter(
      (tx) => tx.status === "confirmed"
    ).length;
    const failed = transactions.filter((tx) => tx.status === "failed").length;
    const cancelled = transactions.filter(
      (tx) => tx.status === "cancelled"
    ).length;

    return {
      pending,
      confirmed,
      failed,
      cancelled,
      total: transactions.length,
    };
  }, [transactions]);

  const value: TransactionContextType = {
    transactions,
    addTransaction,
    updateTransactionStatus,
    removeTransaction,
    speedUpTransaction,
    cancelTransaction,
    isLoading,
    getStats,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionQueue = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionQueue must be used within a TransactionProvider"
    );
  }
  return context;
};
