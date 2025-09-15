"use client";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useAccount } from "wagmi";
import ERC20Abi from "@/app/contracts/erc20.abi.json";
import { parseTokenAmount } from "@/app/utils";
import { useState, useEffect } from "react";

export const useERC20 = (tokenAddress: string) => {
  const { address } = useAccount();
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    symbol: "",
    decimals: 18,
    balance: "0",
    allowance: "0",
  });

  const { data: name } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20Abi,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20Abi,
    functionName: "symbol",
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20Abi,
    functionName: "decimals",
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20Abi,
    functionName: "allowance",
    args: address ? [address, address] : undefined,
  });

  useEffect(() => {
    if (
      name &&
      symbol &&
      decimals !== undefined &&
      balance !== undefined &&
      allowance !== undefined
    ) {
      setTokenInfo({
        name: name as string,
        symbol: symbol as string,
        decimals: decimals as number,
        balance: balance?.toString() || "",
        allowance: allowance?.toString() || "",
      });
    }
  }, [name, symbol, decimals, balance, allowance]);

  return {
    tokenInfo,
    refetchBalance,
    refetchAllowance,
  };
};

export function useERC20Actions(tokenAddress: string, userAddress: string) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mint = async (amount: string, decimals: number) => {
    const parsedAmount = parseTokenAmount(amount, decimals);
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: "mint",
      args: [userAddress, parsedAmount],
    });
  };

  const transfer = async (to: string, amount: string, decimals: number) => {
    const parsedAmount = parseTokenAmount(amount, decimals);
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: "transfer",
      args: [to as `0x${string}`, parsedAmount],
    });
  };

  const approve = async (spender: string, amount: string, decimals: number) => {
    const parsedAmount = parseTokenAmount(amount, decimals);
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: "approve",
      args: [spender as `0x${string}`, parsedAmount],
    });
  };

  return {
    mint,
    transfer,
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
