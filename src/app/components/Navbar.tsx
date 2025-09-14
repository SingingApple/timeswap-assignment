import Link from "next/link";
import React from "react";
import { WagmiWalletConnection } from "./WalletConnection";
import WagmiWrapper from "../wagmi-provider";

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <h1 className="text-xl font-bold text-gray-900">Tokenswap</h1>
            </Link>
          </div>
          <WagmiWrapper>
            <WagmiWalletConnection />
          </WagmiWrapper>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
