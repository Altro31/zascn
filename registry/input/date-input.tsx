"use client";

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { CSSProperties } from "react";
import { FieldError } from "react-hook-form";
import MaskedInput from "react-text-mask";
import { Calendar } from "./calendar";

interface DateInputProps {
  id: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  underLabel?: string;
  disabled?: boolean;
  required?: boolean;
  error?: FieldError;
  width?: CSSProperties["width"];
  className?: string;
  containerClassName?: string;
  showError?: boolean;
  minDate?: Date;
  maxDate?: Date;
  locale?: string;
  noAgeRestriction?: boolean; // Desactiva validación de rango 16-102 años
  inputSize?: "sm" | "md";
}

export default function DateInput({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Seleccionar fecha",
  label,
  underLabel,
  disabled = false,
  required = false,
  error,
  width = "100%",
  containerClassName,
  showError = true,
  minDate,
  maxDate,
  noAgeRestriction = false,
  inputSize = "md",
}: DateInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  // Formato DD/MM/YYYY
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const [inputValue, setInputValue] = React.useState<string>(
    value ? formatDate(value) : ""
  );
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value
  );
  // Estado del mes mostrado en el calendario (antes estaba fijo en 2000)
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    value ?? new Date()
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedDate(value);
    setInputValue(value ? formatDate(value) : "");
    // Si cambia el valor seleccionado y pertenece a otro mes/año, sincronizamos el mes mostrado
    if (value) {
      if (
        value.getFullYear() !== displayMonth.getFullYear() ||
        value.getMonth() !== displayMonth.getMonth()
      ) {
        setDisplayMonth(value);
      }
    }
  }, [value]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

  // Validación genérica (minDate, maxDate) o fallback a edad si noAgeRestriction es falso y no hay límites explícitos
  const isAllowedDate = (date: Date | undefined) => {
    if (!date) return true;
    if (minDate || maxDate) {
      if (minDate && date < minDate) return false;
      if (maxDate && date > maxDate) return false;
      return true;
    }
    if (noAgeRestriction) return true;
    // Fallback validación de edad (16-102 años) para compatibilidad retro
    const now = new Date();
    const min = new Date(
      now.getFullYear() - 102,
      now.getMonth(),
      now.getDate()
    );
    const max = new Date(now.getFullYear() - 16, now.getMonth(), now.getDate());
    return date >= min && date <= max;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isAllowedDate(date)) {
      // Ignorar selección inválida
      return;
    }
    setSelectedDate(date);
    setInputValue(date ? formatDate(date) : "");
    onChange(date);
    setIsOpen(false);
  };

  // ...existing code...

  // Parsear string DD/MM/YYYY a Date
  const parseDate = (str: string): Date | undefined => {
    const [day, month, year] = str.split("/").map(Number);
    if (!day || !month || !year) return undefined;
    const date = new Date(year, month - 1, day);
    // Validar que la fecha sea válida y coincida con el input
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
    return undefined;
  };

  return (
    <div
      ref={containerRef}
      className={cn("w-full flex flex-col gap-1 relative", containerClassName)}
      style={{ width }}
    >
      <div className={cn("flex flex-col", label && "gap-2")}>
        <div className="flex flex-col gap-1">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              {label}
              {required && "*"}
            </label>
          )}
          {underLabel && (
            <p className="font-normal text-xs text-gray-600">{underLabel}</p>
          )}
        </div>

        <div className="relative">
          <MaskedInput
            id="date-input"
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              setInputValue(val);
              if (val.length === 10) {
                const date = parseDate(val);
                if (date && isAllowedDate(date)) {
                  setSelectedDate(date);
                  onChange(date);
                } else {
                  setSelectedDate(undefined);
                  onChange(undefined);
                }
              } else {
                setSelectedDate(undefined);
                onChange(undefined);
              }
            }}
            className={cn(
              "form-input w-full focus:border-blue-500 focus:ring-0",
              inputSize === "md" && "h-12 border-2 rounded-xl px-3",
              inputSize === "sm" && "h-9 border rounded-lg px-2 text-xs",
              "border-slate-200"
            )}
            mask={[
              /[0-9]/,
              /[0-9]/,
              "/",
              /[0-9]/,
              /[0-9]/,
              "/",
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
              /[0-9]/,
            ]}
            disabled={disabled}
          />
          <button
            type="button"
            id={id}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none",
              disabled && "cursor-not-allowed opacity-50"
            )}
            onClick={() => {
              if (!disabled) {
                // Sincronizar input y calendario al abrir
                if (inputValue && inputValue.length === 10) {
                  const date = parseDate(inputValue);
                  if (date && isAllowedDate(date)) {
                    setSelectedDate(date);
                    setDisplayMonth(date);
                  }
                }
                if (!inputValue) {
                  // Si no hay fecha seleccionada, centrar en hoy
                  setDisplayMonth(new Date());
                }
                setIsOpen(!isOpen);
              }
            }}
            disabled={disabled}
            tabIndex={-1}
          >
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </button>

          {isOpen && !disabled && (
            <div className="absolute top-full mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => !isAllowedDate(date)}
                initialFocus
                // Controlamos el mes mostrado permitiendo navegación libre
                month={displayMonth}
                onMonthChange={(month) => month && setDisplayMonth(month)}
              />
            </div>
          )}
        </div>
      </div>

      {showError && error && (
        <p className="text-xs ml-3 text-red-500">{error.message}</p>
      )}
    </div>
  );
}
