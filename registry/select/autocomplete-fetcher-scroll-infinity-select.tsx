import { AdvancedSearchSelect } from '@/components/select/advanced-select';

import { useSearch } from '@/hooks/use-search';
import type { ApiResponse, IQueryable, PaginatedResponse } from '@/lib/types';
import { AutocompleteProps } from '@mantine/core';

export interface AutocompleteFetcherInfinityProps<T> extends Omit<
	AutocompleteProps,
	'data' | 'renderOption' | 'error' | 'defaultValue'
> {
	value: any;
	error?: { message: string };
	onChange: (value: any) => void;
	label?: string;
	placeholder?: string;
	exclude?: string[];
	required?: boolean;
	multiple?: boolean;
	dataTest?: string;
	onScrollEnd?: VoidFunction;
	renderOption?: (option: T) => React.ReactNode;
	renderMultiplesValues?: (
		options: T[],
		removeSelected: (option: T) => void,
	) => React.ReactNode;
	onFetch: (params: IQueryable) => Promise<ApiResponse<PaginatedResponse<T>>>;
	objectValueKey?: keyof T;
	objectKeyLabel?: keyof T;
	params?: IQueryable;
	containerClassname?: string;
	pillsClassname?: string;
	queryKey?: string;
	enabled?: boolean;
	inputClassName?: string;
	menuClassName?: string;
	optionClassName?: string;
	onOptionSelected?: (option: T) => void;
	extraOptions?: T[]; // opciones adicionales forzadas (ej: valor ya seleccionado fuera de la página actual)
	displayFormatter?: (option: T) => string;
	isLoading?: boolean;
	handleAddOption?: (option: any) => void;
	disabled?: boolean;
	defaultValue?: T;
}

export default function AutocompleteFetcherInfinity<T>({
	onChange,
	value,
	error,
	label,
	placeholder,
	required = false,
	onFetch,
	exclude,
	objectValueKey = 'id' as keyof T,
	objectKeyLabel = 'name' as keyof T,
	params = { pageSize: 35 },
	pillsClassname,
	renderMultiplesValues,
	multiple = false,
	queryKey = 'no-cache',
	enabled = true,
	onOptionSelected,
	extraOptions = [],
	containerClassname,
	inputClassName,
	menuClassName,
	optionClassName,
	displayFormatter,
	isLoading = false,
	handleAddOption,
	disabled,
	defaultValue,
	...other
}: AutocompleteFetcherInfinityProps<T>) {
	// Estado para el término de búsqueda
	const {
		hasNextPage,
		isFetchingNextPage,
		loading,
		options,
		searchTerm,
		fetchNextPage,
		setSearchTerm,
	} = useSearch({
		onFetch,
		objectValueKey,
		exclude,
		debounceDelay: 350,
		params,
		queryKey,
		enabled,
		extraOptions,
		objectKeyLabel,
		value,
		defaultValue,
	});

	const handleScrollEnd = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	return (
		<AdvancedSearchSelect
			value={value}
			onChange={onChange}
			label={label}
			placeholder={placeholder}
			required={required}
			options={options}
			loading={loading || isFetchingNextPage || isLoading}
			objectValueKey={objectValueKey}
			onScrollEnd={handleScrollEnd}
			exclude={exclude}
			objectKeyLabel={objectKeyLabel}
			multiple={multiple}
			pillsClassname={pillsClassname}
			renderMultiplesValues={renderMultiplesValues}
			query={searchTerm}
			setQuery={setSearchTerm}
			onOptionSelected={onOptionSelected}
			error={error}
			containerClassname={containerClassname}
			inputClassName={inputClassName}
			menuClassName={menuClassName}
			optionClassName={optionClassName}
			displayFormatter={displayFormatter}
			handleAddOption={handleAddOption}
			disabled={disabled}
			{...other}
		/>
	);
}
