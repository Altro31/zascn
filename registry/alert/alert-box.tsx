import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Info,
  Moon,
  Star,
  X,
} from "lucide-react";
import { ReactNode } from "react";

export type Variants =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "secondary"
  | "dark";

export const getVariantClasses = (variant: Variants, outline: boolean) => {
  if (outline) {
    // Light: outline (transparent bg, colored text & border)
    // Dark: inverted (filled bg + white text)
    return cn(
      `bg-transparent text-${variant} border border-${variant}`,
      `dark:bg-${variant} dark:text-white dark:border-${variant}`
    );
  }
  return cn(
    `bg-${variant} text-black`,
    `dark:bg-transparent dark:text-white dark:border dark:border-${variant}`
  );
};

interface AlertBoxProps {
  variant?: Variants;
  icon?: ReactNode;
  title: string;
  message?: ReactNode;
  onClose?: () => void;
  direction?: "ltr" | "rtl";
}

const icons: Record<Variants, ReactNode> = {
  primary: <Bell className="h-6 w-6" />,
  danger: <AlertCircle className="h-6 w-6" />,
  dark: <Moon className="h-6 w-6" />,
  info: <Info className="h-6 w-6" />,
  secondary: <Star className="h-6 w-6" />,
  success: <CheckCircle className="h-6 w-6" />,
  warning: <AlertTriangle className="h-6 w-6" />,
};

export const AlertBox = ({
  variant = "primary",
  icon,
  title,
  message,
  onClose,
  direction = "ltr",
}: AlertBoxProps) => {
  return (
    <div
      className={`relative flex items-center rounded border p-3.5 ${getVariantClasses(
        variant,
        true
      )} ${direction === "ltr" ? "border-l-64" : "border-r-64"}`}
    >
      <span
        className={`absolute inset-y-0 m-auto h-6 w-6 text-white  ${
          direction === "ltr" ? "-left-11" : "-right-11"
        }`}
      >
        {icon ?? icons[variant]}
      </span>

      <span className={`${direction === "ltr" ? "pr-2" : "pl-2"}`}>
        <strong className={`${direction === "ltr" ? "mr-1" : "ml-1"}`}>
          {title}
        </strong>
        {message}
      </span>
      {onClose && (
        <button
          type="button"
          className={`${
            direction === "ltr" ? "ml-auto" : "mr-auto"
          } hover:opacity-80`}
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
