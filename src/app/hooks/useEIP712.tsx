"use client";

import { useState } from "react";
import { useSignTypedData, useAccount, useChainId } from "wagmi";
import { recoverTypedDataAddress } from "viem";

export interface EIP712Domain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

export interface EIP712Message {
  from: string;
  to: string;
  amount: string;
  nonce: number;
  deadline: number;
}

export interface EIP712TypedData {
  domain: EIP712Domain;
  types: {
    Permit: { name: string; type: string }[];
  };
  primaryType: string;
  message: EIP712Message;
}

export const useEIP712 = () => {
  const chainId = useChainId();
  const { address } = useAccount();
  const [recoveredAddress, setRecoveredAddress] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    signTypedData,
    data: signature,
    isPending,
    error,
  } = useSignTypedData();

  const createTypedData = (
    tokenAddress: string,
    from: string,
    to: string,
    amount: string,
    nonce: number = 0,
    deadline: number = Math.floor(Date.now() / 1000) + 3600
  ): EIP712TypedData => {
    return {
      domain: {
        name: "ERC20Permit",
        version: "1",
        chainId: chainId,
        verifyingContract: tokenAddress,
      },
      types: {
        Permit: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: "Permit",
      message: {
        from,
        to,
        amount,
        nonce,
        deadline,
      },
    };
  };

  const signMessage = async (typedData: EIP712TypedData) => {
    try {
      signTypedData(
        typedData as unknown as Parameters<typeof signTypedData>[0]
      );
    } catch (err) {
      console.error("Signing failed:", err);
      throw err;
    }
  };

  const verifySignature = async (typedData: EIP712TypedData, sig: string) => {
    setIsVerifying(true);
    try {
      const recovered = await recoverTypedDataAddress({
        domain: typedData.domain as unknown as Parameters<
          typeof recoverTypedDataAddress
        >[0]["domain"],
        types: typedData.types as unknown as Parameters<
          typeof recoverTypedDataAddress
        >[0]["types"],
        primaryType: typedData.primaryType as unknown as Parameters<
          typeof recoverTypedDataAddress
        >[0]["primaryType"],
        message: typedData.message as unknown as Parameters<
          typeof recoverTypedDataAddress
        >[0]["message"],
        signature: sig as `0x${string}`,
      });
      setRecoveredAddress(recovered);
      return recovered;
    } catch (err) {
      console.error("Verification failed:", err);
      throw err;
    } finally {
      setIsVerifying(false);
    }
  };

  const clearSignature = () => {
    setRecoveredAddress("");
  };

  const isSignatureValid = () => {
    return (
      recoveredAddress &&
      address &&
      recoveredAddress.toLowerCase() === address.toLowerCase()
    );
  };

  return {
    address,
    signature,
    recoveredAddress,
    isPending,
    isVerifying,
    error,
    createTypedData,
    signMessage,
    verifySignature,
    clearSignature,
    isSignatureValid,
  };
};
