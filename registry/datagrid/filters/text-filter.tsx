import IconSearch from "@/components/icon/icon-search";
import IconX from "@/components/icon/icon-x";
import { ActionIcon, TextInput } from "@mantine/core";

interface TextFilterProps {
  label?: string;
  description?: string;
  placeholder?: string;
  query: string;
  setQuery: (value: string) => void;
}

const TextFilter = ({
  label,
  description,
  placeholder,
  query,
  setQuery,
}: TextFilterProps) => {
  return (
    <TextInput
      label={label}
      description={description}
      placeholder={placeholder}
      leftSection={<IconSearch className="size-4" />}
      rightSection={
        <ActionIcon
          size="sm"
          variant="transparent"
          c="dimmed"
          onClick={() => setQuery("")}
        >
          <IconX className="size-3" />
        </ActionIcon>
      }
      value={query}
      onChange={e => setQuery(e.currentTarget.value)}
    />
  );
};

export default TextFilter;
