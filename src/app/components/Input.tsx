"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  setValue: (e: string) => void;
  value: string;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  containerClassName = "",
  className = "",
  setValue,
  value,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
