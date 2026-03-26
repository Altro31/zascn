import { MultiSelect, MultiSelectProps, Loader } from "@mantine/core";
import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

function transformOptions<T>(options: T[], key: keyof T): string[] {
  return options.map(opt => String(opt[key]));
}

interface Props<T>
  extends Omit<MultiSelectProps, "data" | "value" | "onChange"|"renderOption"> {
  options: T[];
  name: string;
  label?: string;
  placeholder?: string;
  exclude?: number[];
  loading?: boolean;
  required?: boolean;
  objectValueKey: keyof T;
  dataTest?: string;
  onChangeOptional?: VoidFunction;
  onScrollEnd?: VoidFunction;
  renderOption?: (option: T) => React.ReactNode;
}

export default function RHFMultiSelect<T>({
  options,
  name,
  label,
  placeholder,
  required = false,
  exclude,
  onChangeOptional,
  loading = false,
  onScrollEnd,
  renderOption,
  objectValueKey,
  ...rest
}: Props<T>) {
  const { control } = useFormContext();

  if (exclude) {
    options = options.filter((opt: any) => !exclude.includes(opt.id));
  }

  const valueMap = options.reduce(
    (acc, opt) => {
      acc[String(opt[objectValueKey])] = opt;
      return acc;
    },
    {} as Record<string, T>
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const div = scrollRef.current;
    if (!div) return;

    const scrollTop = div.scrollTop;
    const scrollHeight = div.scrollHeight;
    const offsetHeight = div.offsetHeight;

    const scrolledRatio = (scrollTop + offsetHeight) / scrollHeight;
    if (scrolledRatio >= 0.9) {
      onScrollEnd?.();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MultiSelect
          {...rest}
          {...field}
          data={transformOptions(options, objectValueKey)}
          value={field.value || []}
          onChange={value => {
            field.onChange(value);
            onChangeOptional?.();
          }}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error?.message}
          scrollAreaProps={{
            viewportRef: scrollRef,
            onScroll: handleScroll,
          }}
          maxDropdownHeight={200}
          classNames={{
            input: "form-input",
            label: "text-sm font-semibold text-gray-900",
          }}
          rightSection={loading ? <Loader size="xs" /> : null}
          searchable
        />
      )}
    />
  );
}
