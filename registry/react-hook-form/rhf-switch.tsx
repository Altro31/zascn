import { Controller, useFormContext } from "react-hook-form";
import type { InputHTMLAttributes } from "react";

interface RHFSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
}

export default function RHFSwitch({
  name,
  label,
  helperText,
  ...props
}: RHFSwitchProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col space-y-1">
          {label && (
            <label
              htmlFor={name}
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {label}
            </label>
          )}

          <label className="w-12 h-6 relative">
            <input
              type="checkbox"
              className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
              id={name}
              {...props}
              {...field}
              checked={field.value}
            />
            <span
              className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full 
              before:absolute before:left-1 before:bg-white dark:before:bg-white-dark 
              dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 
              before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
              before:transition-all before:duration-300"
            />
          </label>

          {(error || helperText) && (
            <p className="text-xs text-red-500">
              {error?.message || helperText}
            </p>
          )}
        </div>
      )}
    />
  );
}
