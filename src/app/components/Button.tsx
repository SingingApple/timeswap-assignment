import React from "react";
import SpinLoader from "./SpinLoader";

interface IProps {
  title: string;
  onClick: () => void;
  variant?: "small" | "medium" | "large";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  title,
  onClick,
  variant = "medium",
  leftIcon,
  rightIcon,
  className,
  disabled = false,
  loading = false,
  type = "button",
}: IProps) => {
  const baseStyles =
    "bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50";
  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";
  const flexStyles = "flex items-center justify-center";
  const gapStyles = leftIcon || rightIcon || loading ? "gap-2" : "";

  let variantStyles = "";
  switch (variant) {
    case "small":
      variantStyles = "px-3 py-1.5 text-sm";
      break;
    case "large":
      variantStyles = "px-6 py-3 text-lg";
      break;
    case "medium":
    default:
      variantStyles = "px-4 py-2 text-base";
      break;
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles} ${flexStyles} ${gapStyles} ${disabledStyles} ${
        className || ""
      }`}
    >
      {loading ? <SpinLoader /> : leftIcon && <span>{leftIcon}</span>}
      {title}
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
