/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import ERC20Abi from "@/app/contracts/erc20.abi.json";

export interface ERC20Event {
  id: string;
  type: "Transfer" | "Approval";
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: bigint;
  transactionHash: string;
}

export const useERC20Events = (tokenAddress: string) => {
  const [events, setEvents] = useState<ERC20Event[]>([]);

  useWatchContractEvent({
    address: tokenAddress as `0x${string}`,
    abi: ERC20Abi,
    eventName: "Transfer",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const event: ERC20Event = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: "Transfer",
          from: (log as any).args.from as string,
          to: (log as any).args.to as string,
          value: (log as any).args.value?.toString() || "0",
          timestamp: Date.now(),
          blockNumber: log.blockNumber || BigInt(0),
          transactionHash: log.transactionHash as `0x${string}`,
        };

        setEvents((prev) => [event, ...prev.slice(0, 20)]);
      });
    },
  });

  useWatchContractEvent({
    address: tokenAddress as `0x${string}`,
    abi: ERC20Abi,
    eventName: "Approval",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const event: ERC20Event = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: "Approval",
          from: (log as any).args.owner as string,
          to: (log as any).args.spender as string,
          value: (log as any).args.value?.toString() || "0",
          timestamp: Date.now(),
          blockNumber: log.blockNumber || BigInt(0),
          transactionHash: (log as any).transactionHash,
        };
        setEvents((prev) => [event, ...prev.slice(0, 20)]);
      });
    },
  });

  const clearEvents = () => {
    setEvents([]);
  };

  return {
    events,
    clearEvents,
  };
};
