/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getERC20ServerInfo } from "@/app/lib/erc20-read";
import { Coins, Copy, ExternalLink, AlertCircle } from "lucide-react";
import Error from "@/app/components/Error";
import TokenClient from "./token-client";
import WagmiWrapper from "../wagmi-provider";
import { formatAddress } from "../utils";
import TokenActions from "./token-action";
import LiveEvents from "../components/LiveEvents";
import EIP712Signer from "../components/EIP712Signer";

const Page = async ({
  params,
}: {
  params: Promise<{ tokenAddress: string }>;
}) => {
  const { tokenAddress } = await params;
  const tokenInfo = await getERC20ServerInfo(tokenAddress as `0x${string}`);

  if (tokenInfo.error) {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <Error message="Failed to fetch token information. Please check if the address is a valid ERC-20 token contract." />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {(tokenInfo as any)?.name || "Unknown Token"}
          </h1>
          <p className="text-gray-600">ERC-20 Token Information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token Name
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-900">
                    {(tokenInfo as any)?.name || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symbol
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-900 font-mono">
                    {(tokenInfo as any)?.symbol || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decimals
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-gray-900">
                    {(tokenInfo as any)?.decimals || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Other Information
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Address
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-900 font-mono text-sm">
                      {formatAddress(tokenAddress)}
                    </span>
                  </div>
                  <button
                    // onClick={() => copyToClipboard(tokenAddress)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy full address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://etherscan.io/token/${tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View on Etherscan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <WagmiWrapper>
                <TokenClient />
              </WagmiWrapper>
            </div>
          </div>
        </div>

        <WagmiWrapper>
          <TokenActions />
          <LiveEvents tokenAddress={tokenAddress} />
          <EIP712Signer tokenAddress={tokenAddress} />
        </WagmiWrapper>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> This page displays basic ERC-20 token
                information. For balance and transaction details, please connect
                your wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
