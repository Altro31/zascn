/**
 * Loader.tsx
 *
 * Componente reutilizable que permite mostrar diferentes tipos de loaders: tipo botón o spinner.
 * Soporta diferentes variantes de animación, tamaños, colores y posición del texto.
 */

import { cn } from "@/lib/utils";
import React from "react";

/** Tipos de loader disponibles */
type LoaderType = "spinner" | "ping" | "text";

/** Posición del texto con respecto al spinner */
type TextPosition = "left" | "right";

/** Tamaños permitidos */
type LoaderSize = "sm" | "md" | "lg" | "xl";

/** Colores disponibles */
type LoaderColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "transparent"
  | "black";

interface LoaderProps {
  type?: LoaderType;
  color?: LoaderColor;
  size?: LoaderSize;
  text?: string;
  textPosition?: TextPosition;
  buttonStyle?: boolean;
  outline?: boolean;
  className?: string;
}

/**
 * Componente Loader
 *
 * @param {LoaderProps} props - Propiedades del componente
 * @returns {JSX.Element}
 */
const Loader: React.FC<LoaderProps> = ({
  type = "spinner",
  color = "primary",
  size = "md",
  text = "",
  textPosition = "right",
  buttonStyle = false,
  outline = false,
  className = "",
}) => {
  const sizeMap: Record<LoaderSize, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
    xl: "w-14 h-14",
  };

  const borderMap: Record<LoaderSize, string> = {
    sm: "border-2",
    md: "border-[3px]",
    lg: "border-4",
    xl: "border-8",
  };

  const loaderClass = cn(
    type === "spinner" &&
      `animate-spin ${borderMap[size]} border-${color} border-l-transparent rounded-full`,
    type === "ping" && `animate-ping inline-flex rounded-full bg-${color}`,
    type === "text" && "inline-block",
    sizeMap[size],
    "inline-block align-middle",
    className
  );

  const buttonClass = cn(
    "btn",
    `btn-${outline ? `outline-${color}` : color}`,
    "btn-lg",
    "flex items-center",
    textPosition === "left" && "flex-row-reverse",
    "gap-2"
  );

  return buttonStyle ? (
    <button type="button" className={buttonClass}>
      {type !== "text" && <span className={loaderClass} />}
      {text && <span>{text}</span>}
    </button>
  ) : (
    <span className={loaderClass}>{type === "text" && text}</span>
  );
};

export default Loader;
