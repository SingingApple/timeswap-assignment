"use client";

import React, { useState } from "react";
import { useERC20Events } from "../hooks/useERC20Events";
import { useERC20 } from "../hooks/useERC20";
import { useAccount } from "wagmi";

import {
  Activity,
  ArrowRightLeft,
  UserCheck,
  Trash2,
  ExternalLink,
  Clock,
  Hash,
} from "lucide-react";
import Button from "./Button";
import { getEventDescription } from "../utils";

interface IProps {
  tokenAddress: string;
}

const LiveEvents = ({ tokenAddress }: IProps) => {
  const { address } = useAccount();
  const { tokenInfo } = useERC20(tokenAddress);
  const { events, clearEvents } = useERC20Events(tokenAddress);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getEventIcon = (type: "Transfer" | "Approval") => {
    if (type === "Transfer") {
      return <ArrowRightLeft className="w-4 h-4 text-green-600" />;
    } else {
      return <UserCheck className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getEventTypeColor = (type: "Transfer" | "Approval") => {
    if (type === "Transfer") {
      return "bg-green-50 border-green-200 text-green-800";
    } else {
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    }
  };

  const openEtherscan = (txHash: string) => {
    window.open(`https://etherscan.io/tx/${txHash}`, "_blank");
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Live Events</h2>
          {events.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {events.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            title={isExpanded ? "Collapse" : "Expand"}
            onClick={() => setIsExpanded(!isExpanded)}
            variant="small"
            className="text-gray-600 hover:text-gray-800"
          />
          {events.length > 0 && (
            <Button
              title="Clear"
              onClick={clearEvents}
              variant="small"
              intent="danger"
              leftIcon={<Trash2 className="w-3 h-3" />}
            />
          )}
        </div>
      </div>

      {!address && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Connect your wallet to see live events related to your address.
          </p>
        </div>
      )}

      {address && events.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">
            No events yet. Perform some token actions to see live updates!
          </p>
        </div>
      )}

      {events.length > 0 && (
        <div
          className={`space-y-2 ${
            isExpanded ? "max-h-96 overflow-y-auto" : "max-h-32 overflow-hidden"
          }`}
        >
          {events.map((event) => (
            <div
              key={event.id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getEventIcon(event.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 font-mono">
                      {getEventDescription(event, tokenInfo.decimals)}{" "}
                      {tokenInfo.symbol}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Block #{event.blockNumber.toString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openEtherscan(event.transactionHash)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View on Etherscan"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && !isExpanded && events.length > 3 && (
        <div className="text-center mt-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Show {events.length - 3} more events
          </button>
        </div>
      )}
    </div>
  );
};

export default LiveEvents;
