"use client";

import React, { useState } from "react";
import { useRapidTransactions } from "../hooks/useRapidTransactions";
import { useAccount } from "wagmi";
import {
  Zap,
  Play,
  Square,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { isValidEthereumAddress } from "../utils";

const RapidTransactions = () => {
  const { address } = useAccount();
  const {
    sendRapidTransactions,
    stopRapidTransactions,
    isRunning,
    error,
    currentBatch,
    clearError,
  } = useRapidTransactions();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [count, setCount] = useState("");
  const [delay, setDelay] = useState("");

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimeRemaining = (
    startTime: number,
    completed: number,
    total: number,
    delay: number
  ) => {
    const elapsed = Date.now() - startTime;
    const avgTimePerTx = elapsed / Math.max(completed, 1);
    const remaining = total - completed;
    const estimatedRemaining = remaining * avgTimePerTx + remaining * delay;
    return formatTime(Math.ceil(estimatedRemaining / 1000));
  };

  const handleStart = async () => {
    if (!recipient || !amount || !count) return;

    if (!isValidEthereumAddress(recipient)) {
      alert("Please enter a valid Ethereum address");
      return;
    }

    const config = {
      recipient: recipient as `0x${string}`,
      amount,
      count: parseInt(count),
      delay: parseInt(delay) || 0,
    };

    try {
      await sendRapidTransactions(config);
    } catch (err) {
      console.error("Failed to start rapid transactions:", err);
    }
  };

  const handleStop = () => {
    stopRapidTransactions();
  };

  const isFormValid = recipient && amount && count && !isRunning;

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-orange-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Rapid ETH Transfers
        </h2>
      </div>

      {!address && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <p className="text-yellow-800 text-sm">
            Please connect your wallet to send rapid transactions.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {currentBatch && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <h3 className="font-medium text-blue-900">
              Rapid Transfer in Progress
            </h3>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Progress:</span>
              <span className="font-medium text-blue-900">
                {currentBatch.completed} / {currentBatch.total}
              </span>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (currentBatch.completed / currentBatch.total) * 100
                  }%`,
                }}
              />
            </div>

            {currentBatch.completed < currentBatch.total && (
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Estimated time remaining:</span>
                <span className="font-medium text-blue-900">
                  {formatTimeRemaining(
                    currentBatch.startTime,
                    currentBatch.completed,
                    currentBatch.total,
                    currentBatch.config.delay
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              title="Stop Transfers"
              onClick={handleStop}
              variant="small"
              intent="danger"
              leftIcon={<Square className="w-3 h-3" />}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Configuration</h3>

          <Input
            label="Recipient Address"
            id="rapid-recipient"
            value={recipient}
            setValue={setRecipient}
            placeholder="0x..."
            disabled={isRunning}
          />

          <Input
            label="Amount per Transaction (ETH)"
            id="rapid-amount"
            value={amount}
            setValue={setAmount}
            placeholder="0.001"
            disabled={isRunning}
          />

          <Input
            label="Number of Transactions"
            id="rapid-count"
            value={count}
            setValue={setCount}
            placeholder="10"
            disabled={isRunning}
          />

          <Input
            label="Delay Between Transactions (ms)"
            id="rapid-delay"
            value={delay}
            setValue={setDelay}
            placeholder="1000"
            disabled={isRunning}
          />

          <div className="flex gap-2">
            <Button
              title={isRunning ? "Running..." : "Start Rapid Transfers"}
              onClick={handleStart}
              disabled={!isFormValid}
              loading={isRunning}
              leftIcon={
                isRunning ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )
              }
              className="flex-1"
            />
            {isRunning && (
              <Button
                title="Stop"
                onClick={handleStop}
                intent="danger"
                leftIcon={<Square className="w-4 h-4" />}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Summary</h3>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Transactions:</span>
              <span className="font-medium text-gray-800">{count || "0"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount per Transaction:</span>
              <span className="font-medium text-gray-800">
                {amount || "0"} ETH
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-gray-800">
                {count && amount
                  ? (parseFloat(count) * parseFloat(amount)).toFixed(6)
                  : "0"}{" "}
                ETH
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delay:</span>
              <span className="font-medium text-gray-800">
                {delay || "0"}ms
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated Duration:</span>
              <span className="font-medium text-gray-800">
                {count && delay
                  ? formatTime(
                      Math.ceil((parseInt(count) * parseInt(delay)) / 1000)
                    )
                  : "0s"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapidTransactions;
