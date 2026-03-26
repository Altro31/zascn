import { PaginatedResponse } from '@/types/common';
import { ApiResponse } from '@/types/fetch/api';
import { IQueryable } from '@/types/fetch/request';
import AutocompleteFetcherInfinity, {
	AutocompleteFetcherInfinityProps,
} from '../select/autocomplete-fetcher-scroll-infinity-select';
import { Controller, useFormContext } from 'react-hook-form';

export interface RHFAutocompleteFetcherInfinityProps<T> extends Omit<
	AutocompleteFetcherInfinityProps<T>,
	'value' | 'onChange' | 'error'
> {
	name: string;
	label?: string;
	placeholder?: string;
	exclude?: string[];
	required?: boolean;
	multiple?: boolean;
	dataTest?: string;
	onChangeOptional?: VoidFunction;
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
}

export default function RHFAutocompleteFetcherInfinity<T>({
	name,
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
	inputClassName = 'form-input',
	menuClassName,
	optionClassName,
	displayFormatter,
	...other
}: RHFAutocompleteFetcherInfinityProps<T>) {
	const { control } = useFormContext();
	return (
		<Controller
			name={name}
			control={control}
			render={({
				field: { onBlur, onChange, value },
				fieldState: { error },
			}) => (
				<AutocompleteFetcherInfinity<T>
					name={name}
					label={label}
					onBlur={onBlur}
					placeholder={placeholder}
					required={required}
					onFetch={onFetch}
					onChange={onChange}
					value={value}
					error={error as { message: string }}
					params={params}
					queryKey={queryKey}
					enabled={enabled}
					extraOptions={extraOptions}
					objectValueKey={objectValueKey}
					exclude={exclude}
					objectKeyLabel={objectKeyLabel}
					multiple={multiple}
					pillsClassname={pillsClassname}
					renderMultiplesValues={renderMultiplesValues}
					onOptionSelected={onOptionSelected}
					inputClassName={inputClassName}
					menuClassName={menuClassName}
					optionClassName={optionClassName}
					displayFormatter={displayFormatter}
					{...other}
				/>
			)}
		/>
	);
}
