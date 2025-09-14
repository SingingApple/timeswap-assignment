"use client";

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import Button from "./Button";
import { Wallet, LogOut } from "lucide-react";
import { formatAddress } from "../utils";

export const WagmiWalletConnection = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const handleConnect = () => {
    const connector = connectors[0];
    connect({ connector });
  };

  if (!isConnected) {
    return (
      <>
        <Button
          title="Connect Wallet"
          loading={isPending}
          onClick={handleConnect}
        />
      </>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
      <div className="flex items-center justify-between gap-x-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Wallet className="w-3 h-3 text-white" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-gray-800">
              {formatAddress(address as string)}
            </p>
            <p className="text-xs text-gray-500">Chain ID: {chainId}</p>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="group flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Disconnect Wallet"
        >
          <LogOut className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    </div>
  );
};
