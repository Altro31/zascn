import { PaginatedResponse } from '@/types/common';
import { ApiResponse } from '@/types/fetch/api';
import { IQueryable } from '@/types/fetch/request';
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseInfiniteAutocompleteOptions<T> {
	queryKey: QueryKey;
	onFetch: (params: IQueryable) => Promise<ApiResponse<PaginatedResponse<T>>>;
	params?: IQueryable;
	enabled?: boolean;
}
export function useInfiniteAutocomplete<T>({
	queryKey,
	onFetch,
	params, // Quita el default de aquí para controlar la referencia
	enabled = true,
}: UseInfiniteAutocompleteOptions<T>) {
	// 1. Memoriza los valores por defecto si params no viene
	const safeParams = useMemo(
		() => ({
			pageSize: 35,
			...params,
		}),
		[JSON.stringify(params)],
	); // Serialización simple para estabilidad

	// 2. Memoriza el toastId
	const toastId = useMemo(
		() => `infinite-autocomplete:${JSON.stringify(queryKey)}`,
		[queryKey],
	);

	return useInfiniteQuery({
		queryKey: [...queryKey, safeParams], // queryKey is array, safeParams is object. Result: [...keys, {pageSize...}]
		queryFn: async ({ pageParam = 1 }) => {
			const response = await onFetch({
				...safeParams,
				page: pageParam,
			});

			if (response.error) {
				// ... tu lógica de error
			}
			return response.data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage || !lastPage.data || lastPage.data.length === 0) {
				return undefined;
			}
			// Verifica que lastPage exista y tenga la propiedad hasNext
			return lastPage?.hasNext ? allPages.length + 1 : undefined;
		},
		enabled,
		staleTime: 5 * 60 * 1000,
	});
}
