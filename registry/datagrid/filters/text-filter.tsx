import { ActionIcon, TextInput } from '@mantine/core';
import { Search, X } from 'lucide-react';

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
			leftSection={<Search className='size-4' />}
			rightSection={
				<ActionIcon
					size='sm'
					variant='transparent'
					c='dimmed'
					onClick={() => setQuery('')}
				>
					<X className='size-3' />
				</ActionIcon>
			}
			value={query}
			onChange={(e) => setQuery(e.currentTarget.value)}
		/>
	);
};

export default TextFilter;
