"use client";

import React, { useState } from "react";
import { useTransactionQueue } from "../contexts/TransactionContext";
import { useAccount } from "wagmi";
import {
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  X,
  ExternalLink,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "./Button";
import { formatAddress, formatTokenAmount } from "../utils";

const TransactionQueue = () => {
  const { address } = useAccount();
  const {
    transactions,
    removeTransaction,
    speedUpTransaction,
    cancelTransaction,
    isLoading,
    getStats,
  } = useTransactionQueue();

  console.log("Transactions:", transactions);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState<Set<string>>(new Set());

  const stats = getStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "cancelled":
        return <X className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "confirmed":
        return "bg-green-50 border-green-200 text-green-800";
      case "failed":
        return "bg-red-50 border-red-200 text-red-800";
      case "cancelled":
        return "bg-gray-50 border-gray-200 text-gray-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "transfer":
        return <Activity className="w-4 h-4 text-blue-600" />;
      case "contract":
        return <AlertCircle className="w-4 h-4 text-purple-600" />;
      case "approve":
        return <CheckCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const formatGasPrice = (gasPrice: bigint) => {
    return `${(Number(gasPrice) / 1e9).toFixed(2)} Gwei`;
  };

  const openEtherscan = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, "_blank");
  };

  const toggleDetails = (txId: string) => {
    setShowDetails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(txId)) {
        newSet.delete(txId);
      } else {
        newSet.add(txId);
      }
      return newSet;
    });
  };

  const handleSpeedUp = async (hash: `0x${string}`) => {
    try {
      await speedUpTransaction(hash, 10);
    } catch (error) {
      console.error("Failed to speed up transaction:", error);
    }
  };

  const handleCancel = async (hash: `0x${string}`) => {
    try {
      await cancelTransaction(hash);
    } catch (error) {
      console.error("Failed to cancel transaction:", error);
    }
  };

  if (!address) {
    return (
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Queue
          </h2>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please connect your wallet to view transaction queue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Queue
          </h2>
          {stats.pending > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {stats.pending}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            title={isExpanded ? "Collapse" : "Expand"}
            onClick={() => setIsExpanded(!isExpanded)}
            variant="small"
            className="text-gray-600 hover:text-gray-800"
          />
          {transactions.length > 0 && (
            <Button
              title="Clear All"
              onClick={() => {
                transactions.forEach((tx) => removeTransaction(tx.hash));
              }}
              variant="small"
              intent="danger"
              leftIcon={<Trash2 className="w-3 h-3" />}
            />
          )}
        </div>
      </div>

      {transactions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
            <div className="text-lg font-semibold text-yellow-800">
              {stats.pending}
            </div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="p-2 bg-green-50 border border-green-200 rounded text-center">
            <div className="text-lg font-semibold text-green-800">
              {stats.confirmed}
            </div>
            <div className="text-xs text-green-600">Confirmed</div>
          </div>
          <div className="p-2 bg-red-50 border border-red-200 rounded text-center">
            <div className="text-lg font-semibold text-red-800">
              {stats.failed}
            </div>
            <div className="text-xs text-red-600">Failed</div>
          </div>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded text-center">
            <div className="text-lg font-semibold text-gray-800">
              {stats.cancelled}
            </div>
            <div className="text-xs text-gray-600">Cancelled</div>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
            <div className="text-lg font-semibold text-blue-800">
              {stats.total}
            </div>
            <div className="text-xs text-blue-600">Total</div>
          </div>
        </div>
      )}

      {transactions.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No transactions in queue</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div
          className={`space-y-2 ${
            isExpanded ? "max-h-96 overflow-y-auto" : "max-h-32 overflow-hidden"
          }`}
        >
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getTypeIcon(tx.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          tx.status
                        )}`}
                      >
                        {getStatusIcon(tx.status)}
                        <span className="ml-1 capitalize">{tx.status}</span>
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(tx.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 font-mono">
                        {formatAddress(tx.hash)}
                      </span>
                      <button
                        onClick={() => toggleDetails(tx.id)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {showDetails.has(tx.id) ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {tx.status === "pending" && (
                    <>
                      <Button
                        title="Speed Up"
                        onClick={() => handleSpeedUp(tx.hash)}
                        variant="small"
                        intent="warning"
                        leftIcon={<Zap className="w-3 h-3" />}
                        disabled={isLoading}
                        loading={isLoading}
                      />
                      <Button
                        title="Cancel"
                        onClick={() => handleCancel(tx.hash)}
                        variant="small"
                        intent="danger"
                        leftIcon={<X className="w-3 h-3" />}
                        disabled={isLoading}
                        loading={isLoading}
                      />
                    </>
                  )}
                  <button
                    onClick={() => openEtherscan(tx.hash)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeTransaction(tx.hash)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showDetails.has(tx.id) && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Nonce:</span>
                      <span className="ml-1 font-mono text-gray-900">
                        {tx.nonce}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gas Price:</span>
                      <span className="ml-1 font-mono text-gray-900">
                        {formatGasPrice(tx.gasPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gas Limit:</span>
                      <span className="ml-1 font-mono text-gray-900">
                        {tx.gasLimit.toString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Value:</span>
                      <span className="ml-1 font-mono text-gray-900">
                        {formatTokenAmount(tx.value.toString(), 18)} ETH
                      </span>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-500">To:</span>
                    <span className="ml-1 font-mono text-gray-900">
                      {formatAddress(tx.to)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && !isExpanded && transactions.length > 3 && (
        <div className="text-center mt-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Show {transactions.length - 3} more transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionQueue;
