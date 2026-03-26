import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

interface Props {
  name: string;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  colorPresets?: string[];
  showColorInput?: boolean;
  showError?: boolean;
  containerClassName?: string;
}

const defaultColorPresets = [
  "#2563eb",
  "#22c55e", 
  "#f59e42",
  "#ef4444",
  "#a21caf",
  "#64748b",
];

export default function RHFColorPicker({
  name,
  label,
  helperText,
  disabled = false,
  required = false,
  colorPresets = defaultColorPresets,
  showColorInput = true,
  showError = true,
  containerClassName,
}: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <div className={cn("space-y-2", containerClassName)}>
          {label && (
            <label
              htmlFor={name}
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <div className="flex items-center gap-4">
            {/* Color Presets */}
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  disabled={disabled}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                    value === color
                      ? "border-gray-400 ring-2 ring-gray-300"
                      : "border-gray-200 hover:border-gray-300",
                    disabled && "opacity-50 cursor-not-allowed hover:scale-100"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    if (!disabled) {
                      onChange(color);
                      setValue(name, color);
                    }
                  }}
                  aria-label={`Seleccionar color ${color}`}
                />
              ))}
            </div>

            {/* Custom Color Input */}
            {showColorInput && (
              <div className="flex  items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
                <input
                  type="color"
                  id={name}
                  value={value || "#000000"}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setValue(name, e.target.value);
                  }}
                  disabled={disabled}
                  className={cn(
                    "w-16 h-8 p-1 border rounded cursor-pointer disabled:cursor-not-allowed",
                    "appearance-none w-10 h-10 border-2 border-gray-300 rounded-md cursor-pointer transition-all hover:scale-105",
                    disabled && "opacity-50"
                  )}
                />
              </div>
            )}
          </div>

          {/* Helper Text */}
          {helperText && !error && (
            <p className="text-xs text-gray-500">{helperText}</p>
          )}

          {/* Error Message */}
          {showError && error && (
            <p className="text-xs text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
