"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/app/lib/config";
import React from "react";

interface IProps {
  children: React.ReactNode;
}

const WagmiWrapper = ({ children }: IProps) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};

export default WagmiWrapper;
