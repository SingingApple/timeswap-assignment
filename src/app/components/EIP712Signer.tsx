"use client";

import React, { useState } from "react";
import { useEIP712, EIP712TypedData } from "../hooks/useEIP712";
import { useAccount } from "wagmi";
import {
  FileSignature,
  CheckCircle,
  XCircle,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { formatAddress, isValidEthereumAddress } from "../utils";

interface IProps {
  tokenAddress: string;
}

const EIP712Signer = ({ tokenAddress }: IProps) => {
  const { address } = useAccount();
  const {
    signature,
    recoveredAddress,
    isPending,
    isVerifying,
    error,
    createTypedData,
    signMessage,
    verifySignature,
    clearSignature,
    isSignatureValid,
  } = useEIP712();

  // Form state
  const [from, setFrom] = useState(address || "");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [nonce, setNonce] = useState("0");
  const [deadline, setDeadline] = useState(
    Math.floor(Date.now() / 1000) + 3600
  );
  const [showTypedData, setShowTypedData] = useState(false);
  const [typedData, setTypedData] = useState<EIP712TypedData | null>(null);

  const handleCreateTypedData = () => {
    if (!from || !to || !amount) return;

    if (!isValidEthereumAddress(from)) {
      alert("Please enter a valid 'from' address");
      return;
    }

    if (!isValidEthereumAddress(to)) {
      alert("Please enter a valid 'to' address");
      return;
    }

    const data = createTypedData(
      tokenAddress,
      from,
      to,
      amount,
      parseInt(nonce),
      deadline
    );
    setTypedData(data);
    setShowTypedData(true);
  };

  const handleSign = async () => {
    if (!typedData) return;
    try {
      await signMessage(typedData);
    } catch (err) {
      console.error("Signing failed:", err);
    }
  };

  const handleVerify = async () => {
    if (!typedData || !signature) return;
    try {
      await verifySignature(typedData, signature);
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <FileSignature className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          EIP-712 Signing & Verification
        </h2>
      </div>

      {!address && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <p className="text-yellow-800 text-sm">
            Please connect your wallet to use EIP-712 signing.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-700 text-sm">Error: {error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Create Typed Data</h3>

          <Input
            label="From Address"
            id="from-address"
            value={from}
            setValue={setFrom}
            placeholder="0x..."
            disabled={isPending || isVerifying}
          />

          <Input
            label="To Address"
            id="to-address"
            value={to}
            setValue={setTo}
            placeholder="0x..."
            disabled={isPending || isVerifying}
          />

          <Input
            label="Amount"
            id="amount"
            value={amount}
            setValue={setAmount}
            placeholder="100"
            disabled={isPending || isVerifying}
          />

          <Input
            label="Nonce"
            id="nonce"
            value={nonce}
            setValue={setNonce}
            placeholder="0"
            disabled={isPending || isVerifying}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline (Unix Timestamp)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={deadline}
                onChange={(e) => setDeadline(parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                disabled={isPending || isVerifying}
              />
              <span className="text-xs text-gray-500">
                {formatTimestamp(deadline)}
              </span>
            </div>
          </div>

          <Button
            title="Create Typed Data"
            onClick={handleCreateTypedData}
            disabled={!from || !to || !amount || isPending || isVerifying}
            leftIcon={<FileSignature className="w-4 h-4" />}
            className="w-full"
          />
        </div>

        {/* Right Column - Results */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Sign & Verify</h3>

          {typedData && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Typed Data Created
                  </span>
                  <button
                    onClick={() => setShowTypedData(!showTypedData)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showTypedData ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {showTypedData && (
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                    {JSON.stringify(typedData, null, 2)}
                  </pre>
                )}
              </div>

              <Button
                title="Sign Message"
                onClick={handleSign}
                disabled={isPending || isVerifying}
                loading={isPending}
                leftIcon={<FileSignature className="w-4 h-4" />}
                className="w-full"
              />

              {signature && (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Signature Generated
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-green-700 font-mono flex-1 break-all">
                        {signature}
                      </code>
                      <button
                        onClick={() => copyToClipboard(signature)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Copy signature"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <Button
                    title="Verify Signature"
                    onClick={handleVerify}
                    disabled={isVerifying}
                    loading={isVerifying}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    className="w-full"
                  />

                  {recoveredAddress && (
                    <div
                      className={`p-3 border rounded-lg ${
                        isSignatureValid()
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isSignatureValid() ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isSignatureValid()
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {isSignatureValid()
                            ? "Signature Valid"
                            : "Signature Invalid"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-900">
                            Recovered Address:
                          </span>
                          <span className="text-gray-800 font-mono">
                            {formatAddress(recoveredAddress)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-900">
                            Expected Address:
                          </span>
                          <span className="text-gray-800 font-mono">
                            {formatAddress(address || "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                title="Clear All"
                onClick={clearSignature}
                intent="danger"
                variant="small"
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EIP712Signer;
