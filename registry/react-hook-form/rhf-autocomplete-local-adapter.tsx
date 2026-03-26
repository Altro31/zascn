import { PaginatedResponse } from '@/types/common';
import { ApiResponse } from '@/types/fetch/api';
import { IQueryable } from '@/types/fetch/request';
import { AutocompleteProps } from '@mantine/core';
import { useMemo } from 'react';
import RHFAutocompleteFetcherInfinity from './rhf-autcomplete-fetcher-scroll-infinity';

interface Props<T> extends Omit<AutocompleteProps, 'data' | 'renderOption' | 'defaultValue'> {
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
	// Props específicas para datos locales
	localData: T[];
	objectValueKey?: keyof T;
	objectKeyLabel?: keyof T;
	containerClassname?: string;
	pillsClassname?: string;
	inputClassName?: string;
	pageSize?: number;
	searchFilter?: (item: T, searchTerm: string) => boolean;
	defaultValue?:T;
}

export default function RHFAutocompleteLocalAdapter<T>({
	localData,
	pageSize = 35,
	searchFilter,
	objectKeyLabel = 'name' as keyof T,
	objectValueKey = 'id' as keyof T,
	inputClassName = 'form-input',
	...props
}: Props<T>) {
	// Evitar colisiones entre múltiples autocompletes locales (ej: parcelId vs type)
	const uniqueQueryKey = `local-${props.name}`;

	// Función que simula una API pero trabaja con datos locales
	const mockFetch = useMemo(() => {
		return async (
			params: IQueryable,
		): Promise<ApiResponse<PaginatedResponse<T>>> => {
			const { search = '' } = params;

			// Filtrar datos según el término de búsqueda
			let filteredData = localData;

			if (search && search.trim() !== '') {
				filteredData = localData.filter((item) => {
					if (searchFilter) {
						return searchFilter(item, search);
					}
					// Filtro por defecto usando objectKeyLabel
					const searchValue = item[objectKeyLabel];
					return String(searchValue)
						.toLowerCase()
						.includes(search.toLowerCase());
				});
			}

			// Simular respuesta de API
			const response: ApiResponse<PaginatedResponse<T>> = {
				error: false,
				status: 200,
				data: {
					data: filteredData,
					totalCount: filteredData.length,
					page: 1,
					pageSize: filteredData.length,
					hasNext: false,
					hasPrevious: false,
				},
				message: 'Success',
			};

			return response;
		};
	}, [localData, searchFilter, objectKeyLabel]);

	return (
		<RHFAutocompleteFetcherInfinity
			{...props}
			objectKeyLabel={objectKeyLabel}
			objectValueKey={objectValueKey}
			onFetch={mockFetch}
			inputClassName={inputClassName}
			queryKey={uniqueQueryKey}
			params={{ pageSize }}
		/>
	);
}
