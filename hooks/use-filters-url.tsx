'use client';
import debounce from '@/lib/debounce';
import type { SearchParams } from '@/lib/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export default function useFiltersUrl() {
	const { replace } = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const debouncedUpdateFiltersInUrl = useMemo(
		() =>
			debounce((updatedFilters: SearchParams) => {
				const searchUrl = new URLSearchParams(searchParams);

				Object.entries(updatedFilters).forEach(([key, value]) => {
					if (value === undefined || value === null || value === '') {
						searchUrl.delete(key);
						return;
					}

					// ✅ Manejo especial para paginación
					if (
						key === 'pagination' &&
						typeof value === 'object' &&
						value !== null
					) {
						if ('page' in value)
							searchUrl.set('page', (value.page as string).toString());
						if ('pageSize' in value)
							searchUrl.set('pageSize', (value.pageSize as string).toString());
						return;
					}

					if (typeof value === 'boolean') {
						searchUrl.set(key, value ? 'true' : 'false');
					} else if (typeof value === 'number' || typeof value === 'string') {
						searchUrl.set(key, value.toString());
					} else if (Array.isArray(value)) {
						searchUrl.delete(key);
						value.forEach((v) => searchUrl.append(key, v.toString()));
					} else if (typeof value === 'object') {
						// Otros objetos sí se guardan como JSON
						searchUrl.set(key, JSON.stringify(value));
					}
				});

				replace(`${pathname}?${searchUrl.toString()}`, { scroll: false });
			}, 300),
		[searchParams, pathname, replace],
	);

	const updateFiltersInUrl = useCallback(
		(updatedFilters: SearchParams) => {
			debouncedUpdateFiltersInUrl(updatedFilters);
		},
		[debouncedUpdateFiltersInUrl],
	);

	return {
		updateFiltersInUrl,
		searchParams: Object.fromEntries(searchParams.entries()),
	};
}
