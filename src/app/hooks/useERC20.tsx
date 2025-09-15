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
import { useTransactionQueue } from "../contexts/TransactionContext";

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

export function useMintTransaction(tokenAddress: string, userAddress: string) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { addTransaction } = useTransactionQueue();
  const [mintAmount, setMintAmount] = useState<string>("");
  const [addedHashes, setAddedHashes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (hash && !addedHashes.has(hash)) {
      console.log("Adding mint transaction to queue:", hash);
      addTransaction({
        hash,
        nonce: 0,
        to: tokenAddress as `0x${string}`,
        value: BigInt(0),
        gasPrice: BigInt(20000000000),
        gasLimit: BigInt(100000),
        status: "pending",
        type: "contract",
        description: `Mint ${mintAmount} tokens to ${userAddress.slice(
          0,
          10
        )}...`,
      });
      setAddedHashes((prev) => new Set(prev).add(hash));
    }
  }, [
    hash,
    tokenAddress,
    userAddress,
    mintAmount,
    addTransaction,
    addedHashes,
  ]);

  const mint = async (amount: string, decimals: number) => {
    setMintAmount(amount);
    const parsedAmount = parseTokenAmount(amount, decimals);
    console.log("Minting tokens:", { amount, parsedAmount, userAddress });
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: "mint",
      args: [userAddress, parsedAmount],
    });
  };

  return {
    mint,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useTransferTransaction(tokenAddress: string) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { addTransaction } = useTransactionQueue();
  const [transferDetails, setTransferDetails] = useState<{
    to: string;
    amount: string;
  }>({ to: "", amount: "" });
  const [addedHashes, setAddedHashes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (hash && !addedHashes.has(hash)) {
      console.log("Adding transfer transaction to queue:", hash);
      addTransaction({
        hash,
        nonce: 0,
        to: tokenAddress as `0x${string}`,
        value: BigInt(0),
        gasPrice: BigInt(20000000000),
        gasLimit: BigInt(100000),
        status: "pending",
        type: "contract",
        description: `Transfer ${
          transferDetails.amount
        } tokens to ${transferDetails.to.slice(0, 10)}...`,
      });
      setAddedHashes((prev) => new Set(prev).add(hash));
    }
  }, [hash, tokenAddress, transferDetails, addTransaction, addedHashes]);

  const transfer = async (to: string, amount: string, decimals: number) => {
    setTransferDetails({ to, amount });
    const parsedAmount = parseTokenAmount(amount, decimals);
    console.log("Transferring tokens:", { to, amount, parsedAmount });
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: "transfer",
      args: [to as `0x${string}`, parsedAmount],
    });
  };

  return {
    transfer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useApproveTransaction(tokenAddress: string) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { addTransaction } = useTransactionQueue();
  const [approveDetails, setApproveDetails] = useState<{
    spender: string;
    amount: string;
  }>({ spender: "", amount: "" });
  const [addedHashes, setAddedHashes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (hash && !addedHashes.has(hash)) {
      console.log("Adding approve transaction to queue:", hash);
      addTransaction({
        hash,
        nonce: 0,
        to: tokenAddress as `0x${string}`,
        value: BigInt(0),
        gasPrice: BigInt(20000000000),
        gasLimit: BigInt(100000),
        status: "pending",
        type: "approve",
        description: `Approve ${
          approveDetails.amount
        } tokens for ${approveDetails.spender.slice(0, 10)}...`,
      });
      setAddedHashes((prev) => new Set(prev).add(hash));
    }
  }, [hash, tokenAddress, approveDetails, addTransaction, addedHashes]);

  const approve = async (spender: string, amount: string, decimals: number) => {
    setApproveDetails({ spender, amount });
    const parsedAmount = parseTokenAmount(amount, decimals);
    console.log("Approving tokens:", { spender, amount, parsedAmount });
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20Abi,
      functionName: "approve",
      args: [spender as `0x${string}`, parsedAmount],
    });
  };

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
