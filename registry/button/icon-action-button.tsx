"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Spinner from "@/components/loaders/spinner";

type Variant = "blue" | "indigo" | "red";

const variantClasses: Record<Variant, string> = {
  blue: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
  indigo:
    "from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
  red: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
};

interface IconActionButtonProps {
  title: string;
  ariaLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
}

export function IconActionButton({
  title,
  ariaLabel,
  Icon,
  onClick,
  isLoading: isLoadingProp,
  disabled,
  variant = "blue",
  className,
}: IconActionButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = isLoadingProp ?? internalLoading;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLoading || disabled) return;
    try {
      const result = onClick?.();
      if (result && typeof (result as any).then === "function") {
        setInternalLoading(true);
        await result;
      }
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <motion.button
      type="button"
      className={cn(
        "flex items-center justify-center rounded-lg bg-linear-to-r px-2 py-1 text-white shadow-md transition-all",
        variantClasses[variant],
        (isLoading || disabled) && "cursor-not-allowed opacity-70",
        className
      )}
      onClick={handleClick}
      title={title}
      aria-label={ariaLabel}
      disabled={isLoading || disabled}
      whileHover={{ scale: isLoading || disabled ? 1 : 1.05 }}
      whileTap={{ scale: isLoading || disabled ? 1 : 0.95 }}
    >
      {isLoading ? <Spinner size={12} /> : <Icon className="h-3 w-3" />}
    </motion.button>
  );
}

export default IconActionButton;
