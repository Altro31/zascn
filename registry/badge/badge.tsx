import { cn } from "@/lib/utils";
import React from "react";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark";

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  rounded?: boolean;
}

const variantClassMap: Record<Variant, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success text-white",
  danger: "bg-danger text-white",
  warning: "bg-warning text-white",
  info: "bg-info text-white",
  dark: "bg-dark text-white",
};

const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  className = "",
  children,
  rounded = false,
}) => {
  return (
    <span
      className={cn(
        "badge ",
        variantClassMap[variant],
        rounded && "rounded-full ",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
