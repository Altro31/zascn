'use client';
import { getCountries } from '@/services/countries';
import { PaginatedResponse } from '@/types/common';
// import { getCountries } from "@/services/countries"; // Comentado temporalmente para usar mock
import { Country } from '@/types/countries';
import { ApiResponse } from '@/types/fetch/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

// Query key constant to avoid typos across the app
export const COUNTRIES_QUERY_KEY = ['countries'] as const;

interface UseCountriesOptions {
	enabled?: boolean; // allow conditional fetching
	select?: (countries: Country[]) => Country[]; // projection/filtering
}

interface UseCountriesResult {
	countries: Country[];
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	error: unknown;
	refetch: () => Promise<UseQueryResult<ApiResponse<Country[]>, unknown>>;
}

export function useCountries(
	options: UseCountriesOptions = {},
): UseCountriesResult {
	const { enabled = true, select } = options;

	const query = useQuery<
		ApiResponse<PaginatedResponse<Country>>,
		unknown,
		Country[]
	>({
		queryKey: COUNTRIES_QUERY_KEY,
		enabled,
		queryFn: async () => await getCountries(),

		select: (apiResp: ApiResponse<PaginatedResponse<Country>>) => {
			const base = apiResp.data?.data ?? [];
			return select ? select(base) : base;
		},
	});

	return {
		countries: query.data ?? [],
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		isError: query.isError,
		error: query.error,
		refetch: async () => (await query.refetch()) as any,
	};
}

export default useCountries;
