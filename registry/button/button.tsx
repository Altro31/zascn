import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "secondary"
  | "dark";
type ButtonSize = "sm" | "md" | "lg";
type ButtonType = "button" | "submit" | "reset";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  type?: ButtonType;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      outline = false,
      rounded = false,
      fullWidth = false,
      iconOnly = false,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const getVariantClasses = () => {
      const prefix = outline ? "btn-outline-" : "btn-";
      return `${prefix}${variant}`;
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "btn-sm";
        case "lg":
          return "btn-lg";
        default:
          return "";
      }
    };

    const getShapeClasses = () => {
      if (iconOnly && rounded) {
        return "w-10 h-10 p-0 rounded-full";
      }
      if (rounded) {
        return "rounded-full";
      }
      return "";
    };

    const buttonClasses = cn(
      className,
      "btn",
      getVariantClasses(),
      getSizeClasses(),
      getShapeClasses(),
      {
        "w-full": fullWidth,
      },
    );


    const showChildren = children && !iconOnly;

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled}
        {...props}
      >
        {leftIcon && (
          <span className={showChildren ? "mr-2" : ""}>{leftIcon}</span>
        )}

        {showChildren && children}

        {rightIcon && (
          <span className={showChildren ? "ml-2" : ""}>{rightIcon}</span>
        )}

        {iconOnly && !leftIcon && !rightIcon && children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
