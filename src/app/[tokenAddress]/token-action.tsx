"use client";

import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import {
  useERC20,
  useMintTransaction,
  useTransferTransaction,
  useApproveTransaction,
} from "../hooks/useERC20";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Coins, UserCheck, ArrowRightLeft } from "lucide-react";
import { isValidEthereumAddress, formatTokenAmount } from "../utils";

const TokenActions = () => {
  const params = useParams();
  const { address } = useAccount();
  const { tokenInfo, refetchBalance, refetchAllowance } = useERC20(
    params.tokenAddress as `0x${string}`
  );
  const {
    mint,
    isPending: mintPending,
    isConfirming: mintConfirming,
    isSuccess: mintSuccess,
    error: mintError,
  } = useMintTransaction(
    params.tokenAddress as `0x${string}`,
    address as `0x${string}`
  );

  const {
    transfer,
    isPending: transferPending,
    isConfirming: transferConfirming,
    isSuccess: transferSuccess,
    error: transferError,
  } = useTransferTransaction(params.tokenAddress as `0x${string}`);

  const {
    approve,
    isPending: approvePending,
    isConfirming: approveConfirming,
    isSuccess: approveSuccess,
    error: approveError,
  } = useApproveTransaction(params.tokenAddress as `0x${string}`);

  const [mintAmount, setMintAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [approveSpender, setApproveSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");

  const handleMint = async () => {
    if (!mintAmount || !address) return;
    try {
      await mint(mintAmount, tokenInfo.decimals);
      setMintAmount("");
      setTimeout(() => refetchBalance(), 2000);
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount || !address) return;
    if (!isValidEthereumAddress(transferTo)) {
      alert("Please enter a valid Ethereum address");
      return;
    }
    try {
      await transfer(transferTo, transferAmount, tokenInfo.decimals);
      setTransferTo("");
      setTransferAmount("");
      setTimeout(() => refetchBalance(), 2000);
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };

  const handleApprove = async () => {
    if (!approveSpender || !approveAmount || !address) return;
    if (!isValidEthereumAddress(approveSpender)) {
      alert("Please enter a valid Ethereum address");
      return;
    }
    try {
      await approve(approveSpender, approveAmount, tokenInfo.decimals);
      setApproveSpender("");
      setApproveAmount("");
      setTimeout(() => refetchAllowance(), 2000);
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const isLoading =
    mintPending ||
    mintConfirming ||
    transferPending ||
    transferConfirming ||
    approvePending ||
    approveConfirming;
  const hasError = mintError || transferError || approveError;
  const hasSuccess = mintSuccess || transferSuccess || approveSuccess;

  return (
    <div className="border-t border-gray-200 pt-6 pb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Token Actions
      </h2>

      {/* Current Balance Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Your Balance:
          </span>
          <span className="text-lg font-semibold text-gray-900">
            {formatTokenAmount(tokenInfo.balance, tokenInfo.decimals)}{" "}
            {tokenInfo.symbol}
          </span>
        </div>
      </div>

      {hasError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            Error: {(mintError || transferError || approveError)?.message}
          </p>
        </div>
      )}

      {hasSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">Transaction successful!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Mint Tokens</h3>
          </div>
          <Input
            label="Amount to Mint"
            id="mint-amount"
            value={mintAmount}
            setValue={setMintAmount}
            placeholder="1000"
            disabled={isLoading}
          />
          <Button
            title="Mint Tokens"
            onClick={handleMint}
            disabled={!mintAmount || !address || mintPending || mintConfirming}
            loading={mintPending || mintConfirming}
            leftIcon={<Coins className="w-4 h-4" />}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-gray-900">Transfer Tokens</h3>
          </div>
          <Input
            label="Recipient Address"
            id="transfer-to"
            value={transferTo}
            setValue={setTransferTo}
            placeholder="0x..."
            disabled={isLoading}
          />
          <Input
            label="Amount to Transfer"
            id="transfer-amount"
            value={transferAmount}
            setValue={setTransferAmount}
            placeholder="100"
            disabled={isLoading}
          />
          <Button
            title="Transfer Tokens"
            onClick={handleTransfer}
            intent="success"
            disabled={
              !transferTo ||
              !transferAmount ||
              !address ||
              transferPending ||
              transferConfirming
            }
            loading={transferPending || transferConfirming}
            leftIcon={<ArrowRightLeft className="w-4 h-4" />}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-gray-900">Approve Spender</h3>
          </div>
          <Input
            label="Spender Address"
            id="approve-spender"
            value={approveSpender}
            setValue={setApproveSpender}
            placeholder="0x..."
            disabled={isLoading}
          />
          <Input
            label="Amount to Approve"
            id="approve-amount"
            value={approveAmount}
            setValue={setApproveAmount}
            placeholder="1000"
            disabled={isLoading}
          />
          <Button
            title="Approve Spender"
            onClick={handleApprove}
            intent="warning"
            disabled={
              !approveSpender ||
              !approveAmount ||
              !address ||
              approvePending ||
              approveConfirming
            }
            loading={approvePending || approveConfirming}
            leftIcon={<UserCheck className="w-4 h-4" />}
            className="w-full"
          />
        </div>
      </div>

      {!address && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please connect your wallet to interact with the token contract.
          </p>
        </div>
      )}
    </div>
  );
};

export default TokenActions;
