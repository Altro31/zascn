"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown, X } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface Props
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "onChange" | "onBlur" | "value" | "size"
  > {
  name: string;
  disabled?: boolean;
  size?: "small" | "medium";
  label?: string;
  placeholder?: string;
  underLabel?: string;
  width?: CSSProperties["width"];
  required?: boolean;
  dataTest?: string;
  showError?: boolean;
  containerClassname?: string;
  options: SelectOption[];
  emptyOption?: string; // Texto para la opción vacía
  multiple?: boolean;
  variant?: "native" | "custom"; // UI del dropdown
  clearable?: boolean; // permite limpiar selección en single
}

export default function RHFSelectWithLabel({
  name,
  disabled,
  size = "small",
  label,
  placeholder = "Seleccionar...",
  underLabel,
  width,
  required,
  dataTest,
  showError = true,
  containerClassname,
  options = [],
  emptyOption,
  multiple = false,
  variant = "custom",
  clearable = false,
  ...rest
}: Props) {
  const { control } = useFormContext();

  const handleChange =
    (onChange: (...event: any) => void) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (multiple) {
        // Para múltiples opciones, convertir HTMLCollection a array de valores
        const selectedValues = Array.from(event.target.selectedOptions).map(
          (option) => option.value
        );
        onChange(selectedValues);
      } else {
        // Para una sola opción
        onChange(event.target.value);
      }
    };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "px-3 py-2 text-sm";
      case "medium":
        return "px-4 py-3 text-base";
      default:
        return "px-3 py-2 text-sm";
    }
  };

  // Helpers para el variant custom
  const getLabelFromValue = (val: any) => {
    if (multiple) {
      const arr = Array.isArray(val) ? val : [];
      const labels = arr
        .map((v) => options.find((o) => String(o.value) === String(v))?.label)
        .filter(Boolean);
      return labels as string[];
    }
    const opt = options.find((o) => String(o.value) === String(val));
    return opt?.label || "";
  };

  const CustomDropdown = ({
    value,
    onChange,
    onBlur,
    error,
  }: {
    value: any;
    onChange: (v: any) => void;
    onBlur: () => void;
    error?: { message?: string } | null;
  }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const isDisabled = !!disabled;

    const selectedLabels = useMemo(() => getLabelFromValue(value), [value]);

    // Cerrar al hacer click fuera
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleValue = (val: string | number) => {
      if (!multiple) {
        onChange(val);
        setOpen(false);
        return;
      }
      const arr = Array.isArray(value) ? [...value] : [];
      const exists = arr.some((v) => String(v) === String(val));
      const next = exists
        ? arr.filter((v) => String(v) !== String(val))
        : [...arr, val];
      onChange(next);
    };

    const clearSelection = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (multiple) {
        onChange([]);
      } else {
        onChange("");
      }
    };

    const isSelected = (val: string | number) => {
      return multiple
        ? Array.isArray(value) && value.some((v) => String(v) === String(val))
        : String(value) === String(val);
    };

    return (
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => !isDisabled && setOpen((o) => !o)}
          onBlur={onBlur}
          data-test={dataTest}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "w-full rounded-lg border transition-colors duration-200",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-white",
            "border-gray-300 dark:border-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500",
            isDisabled && "opacity-60 cursor-not-allowed",
            getSizeClasses(),
            error &&
              "border-red-500 focus:ring-red-500/40 focus:border-red-500",
            "pr-10 text-left"
          )}
        >
          <span className="flex items-center gap-2 flex-wrap">
            {multiple ? (
              Array.isArray(selectedLabels) && selectedLabels.length > 0 ? (
                <>
                  {selectedLabels.slice(0, 3).map((lbl, idx) => (
                    <span
                      key={`${lbl}-${idx}`}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-xs font-medium"
                    >
                      {lbl}
                    </span>
                  ))}
                  {selectedLabels.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{selectedLabels.length - 3}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  {placeholder}
                </span>
              )
            ) : getLabelFromValue(value) ? (
              <span>{getLabelFromValue(value)}</span>
            ) : (
              <span className="text-gray-400 dark:text-gray-500">
                {placeholder}
              </span>
            )}
          </span>

          <span className="absolute inset-y-0 right-2 flex items-center gap-1">
            {clearable && !multiple && !isDisabled && value && (
              <button
                type="button"
                onClick={clearSelection}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform",
                open && "rotate-180"
              )}
            />
          </span>
        </button>

        {/* Dropdown */}
        <div
          className={cn(
            "absolute z-20 mt-2 w-full overflow-hidden",
            "rounded-xl border border-gray-200 dark:border-gray-700",
            "bg-white dark:bg-gray-900 shadow-xl",
            // Smooth open/close animation
            "transform origin-top transition-all duration-200 ease-out will-change-[transform,opacity]",
            open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          )}
          aria-hidden={!open}
        >
          <ul className="max-h-64 overflow-auto py-1" role="listbox">
            {!multiple && (
              <li>
                <button
                  type="button"
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm",
                    "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                >
                  {emptyOption || placeholder}
                </button>
              </li>
            )}

            {options.map((opt) => {
              const active = isSelected(opt.value);
              return (
                <li key={String(opt.value)}>
                  <button
                    type="button"
                    disabled={opt.disabled}
                    className={cn(
                      "w-full px-3 py-2 text-sm flex items-center justify-between",
                      opt.disabled
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30",
                      active &&
                        !opt.disabled &&
                        "bg-blue-50/70 dark:bg-blue-900/30"
                    )}
                    onClick={() => toggleValue(opt.value)}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="truncate mr-2">{opt.label}</span>
                    {active && !opt.disabled && (
                      <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <div
          className={cn("flex flex-col gap-2", containerClassname)}
          style={{ width }}
        >
          {label && (
            <label
              className={cn(
                "text-sm font-medium text-gray-700 dark:text-gray-300",
                required && "after:content-['*'] after:text-red-500 after:ml-1"
              )}
              htmlFor={name}
            >
              {label}
            </label>
          )}

          {variant === "custom" ? (
            <CustomDropdown
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={error}
            />
          ) : (
            <div className="relative">
              <select
                id={name}
                onBlur={onBlur}
                onChange={handleChange(onChange)}
                value={
                  multiple ? (Array.isArray(value) ? value : []) : value || ""
                }
                disabled={disabled}
                multiple={multiple}
                data-test={dataTest}
                className={cn(
                  // Base styles
                  "w-full rounded-lg border border-gray-300 dark:border-gray-600",
                  "bg-white dark:bg-gray-800",
                  "text-gray-900 dark:text-white",
                  "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  "disabled:bg-gray-100 dark:disabled:bg-gray-700",
                  "disabled:text-gray-500 dark:disabled:text-gray-400",
                  "disabled:cursor-not-allowed",
                  "transition-colors duration-200",
                  // Size classes
                  getSizeClasses(),
                  // Error styles
                  error &&
                    "border-red-500 focus:border-red-500 focus:ring-red-500",
                  // Multiple select specific
                  multiple && "min-h-[120px]",
                  // Single select specific - add padding for chevron
                  !multiple && "pr-10 appearance-none"
                )}
                {...rest}
              >
                {/* Opción vacía para select simple */}
                {!multiple && (
                  <option value="" disabled={required}>
                    {emptyOption || placeholder}
                  </option>
                )}

                {/* Opciones dinámicas */}
                {options.map((option, index) => (
                  <option
                    key={`${option.value}-${index}`}
                    value={option.value}
                    disabled={option.disabled}
                    className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Chevron icon para select simple */}
              {!multiple && (
                <ChevronDown
                  className={cn(
                    "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
                    "text-gray-400 dark:text-gray-500 pointer-events-none",
                    disabled && "text-gray-300 dark:text-gray-600"
                  )}
                />
              )}
            </div>
          )}

          {underLabel && (
            <small className="text-sm text-gray-500 dark:text-gray-400">
              {underLabel}
            </small>
          )}

          {showError && error && (
            <span className="text-sm text-red-600 dark:text-red-400">
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
}
