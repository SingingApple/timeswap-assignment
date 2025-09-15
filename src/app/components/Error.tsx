import React from "react";
import { AlertCircle } from "lucide-react";

interface IProps {
  message: string;
}

const Error = ({ message }: IProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 text-red-800">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Error</span>
      </div>
      <p className="text-red-700 mt-1">{message}</p>
    </div>
  );
};

export default Error;
