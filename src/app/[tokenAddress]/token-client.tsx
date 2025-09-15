"use client";

import React from "react";
import { useERC20 } from "../hooks/useERC20";
import { useParams } from "next/navigation";

const TokenClient = () => {
  const params = useParams();

  const { tokenInfo } = useERC20(params.tokenAddress as `0x${string}`);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Allowance
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-gray-900 font-mono">
            {tokenInfo?.allowance || "N/A"}
          </span>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Balance
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-gray-900 font-mono">
            {tokenInfo?.balance || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenClient;
