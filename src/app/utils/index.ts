import { ethers, formatUnits, parseUnits } from "ethers";
import { ERC20Event } from "../hooks/useERC20Events";

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

export const formatEventValue = (value: string, decimals: number) => {
  try {
    return formatUnits(BigInt(value), decimals);
  } catch {
    return "0";
  }
};

export const getEventDescription = (event: ERC20Event, decimals: number) => {
  const formattedValue = formatEventValue(event.value, decimals);

  if (event.type === "Transfer") {
    return `${formatAddress(event.from)} → ${formatAddress(
      event.to
    )}: ${formattedValue}`;
  } else {
    return `${formatAddress(event.from)} approved ${formatAddress(
      event.to
    )}: ${formattedValue}`;
  }
};
