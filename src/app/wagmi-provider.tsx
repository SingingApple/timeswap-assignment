"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/app/lib/config";
import React from "react";

interface IProps {
  children: React.ReactNode;
}

const WagmiWrapper = ({ children }: IProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiWrapper;
