import { ethers, formatUnits, parseUnits } from "ethers";

export const isValidEthereumAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

export const formatTokenAmount = (amount: string, decimals: number): string => {
  try {
    return formatUnits(amount, decimals);
  } catch {
    return "0";
  }
};

export const parseTokenAmount = (amount: string, decimals: number): string => {
  try {
    return parseUnits(amount, decimals).toString();
  } catch {
    return "0";
  }
};

export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) {
    return address;
  }
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};
