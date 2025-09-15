"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Plus } from "lucide-react";
import { isValidEthereumAddress } from "../utils";
import Error from "../components/Error";

export default function AddTokenPage() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenAddress.trim()) {
      setError("Please enter a token address");
      return;
    }

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!isValidEthereumAddress(tokenAddress)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      router.push(`/${tokenAddress}`);
    } catch (err) {
      console.log("Error in adding token", err);
      setError("Failed to add token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Add ERC-20 Token Contract
          </h2>
          <p className="text-gray-600">
            Enter the contract address of an ERC-20 token to start managing it
          </p>
        </div>

        {error && <Error message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="tokenAddress"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Token Contract Address
            </label>
            <input
              type="text"
              id="tokenAddress"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border text-gray-600 placeholder:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter the Ethereum address of the ERC-20 token contract
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isConnected}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding Token...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Token
              </>
            )}
          </button>
        </form>

        {!isConnected && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Please connect your wallet to add a token contract.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
