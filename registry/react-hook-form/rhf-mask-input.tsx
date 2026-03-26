import { Controller, useFormContext } from "react-hook-form";
import { CSSProperties } from "react";

import{ Mask } from "react-text-mask";
import MaskInputWithLabel from "../input/mask-input-with-label";

// ----------------------------------------------------------------------

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onBlur" | "value" | "size"
  > {
  name: string;
  mask: Mask | ((value: string) => Mask);
  disabled?: boolean;
  size?: "small" | "medium";
  label?: string;
  placeholder?: string;
  underLabel?: string;
  width?: CSSProperties["width"];
  required?: boolean;
  dataTest?: string;
  autoComplete?: string;
  showError?: boolean;
  containerClassname?: string;
}

export default function RHFMaskInputWithLabel({
  name,
  disabled,
  size,
  label,
  placeholder,
  underLabel,
  width,
  required,
  dataTest,
  autoComplete,
  showError = true,
  containerClassname,
  ...rest
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <MaskInputWithLabel
          required={required}
          placeholder={placeholder}
          underLabel={underLabel}
          label={label}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          id={name}
          error={showError ? error : undefined}
          disabled={disabled}
          type={"text"}
          size={size}
          width={width}
          dataTest={dataTest}
          autoComplete={autoComplete}
          containerClassname={containerClassname}
          {...rest}
        />
      )}
    />
  );
}
