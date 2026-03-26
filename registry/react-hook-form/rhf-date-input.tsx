"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CSSProperties } from "react";
import DateInput from "../input/input-date";
import { Locale } from "date-fns";
import { es } from "date-fns/locale";

// ----------------------------------------------------------------------

interface Props {
  name: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  underLabel?: string;
  width?: CSSProperties["width"];
  required?: boolean;
  showError?: boolean;
  containerClassName?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  locale?: Locale;
  inputSize?: "sm" | "md";
  formatValue?: (value: Date) => string;
}

export default function RHFDateInput({
  name,
  disabled = false,
  label,
  placeholder,
  underLabel,
  required = false,
  showError = true,
  containerClassName,
  className,
  minDate,
  maxDate,
  inputSize = "md",
  locale = es,
  formatValue,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? "Este campo es requerido" : false,
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <DateInput
          id={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          label={label}
          underLabel={underLabel}
          disabled={disabled}
          required={required}
          error={showError ? (error?.message as string) : undefined}
          className={className}
          containerClassName={containerClassName}
          showError={showError}
          minDate={minDate}
          maxDate={maxDate}
          inputSize={inputSize}
          locale={locale}
          formatValue={formatValue}
        />
      )}
    />
  );
}
