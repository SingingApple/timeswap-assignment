import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import ERC20ABI from "@/app/contracts/erc20.abi.json";

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const getERC20ServerInfo = async (tokenAddress: `0x${string}`) => {
  try {
    const [name, symbol, decimals] = await Promise.all([
      client.readContract({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: "name",
      }),
      client.readContract({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: "symbol",
      }),
      client.readContract({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: "decimals",
      }),
    ]);
    return {
      name,
      symbol,
      decimals: Number(decimals),
    };
  } catch (error) {
    console.log("ERROR", error);
    return {
      error: true,
    };
  }
};

export const getErc20ClientInfo = async (
  tokenAddress: `0x${string}`,
  user?: `0x${string}`
) => {
  try {
    const [balance, allowance] = await Promise.all([
      user
        ? client.readContract({
            address: tokenAddress,
            abi: ERC20ABI,
            functionName: "balanceOf",
            args: [user],
          })
        : Promise.resolve(BigInt(0)),
      user
        ? client.readContract({
            address: tokenAddress,
            abi: ERC20ABI,
            functionName: "allowance",
            args: [user, user],
          })
        : Promise.resolve(BigInt(0)),
    ]);
    return {
      balance: balance?.toString(),
      allowance: allowance?.toString(),
    };
  } catch (error) {
    console.log("ERROR", error);
    return {
      error: true,
    };
  }
};
