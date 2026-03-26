"use client";

import { useInfiniteAutocomplete } from "@/hooks/use-infinite-autocomplete";
import { PaginatedResponse } from "@/types/common";
import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import { useCallback, useMemo, useState } from "react";
import useDebounce from "./use-debounce";

export interface UseSearchOptions<T> {
  onFetch: (params: IQueryable) => Promise<ApiResponse<PaginatedResponse<T>>>;
  objectValueKey?: keyof T;
  exclude?: string[];
  debounceDelay?: number;
  params?: IQueryable;
  queryKey?: string;
  enabled?: boolean;
  extraOptions?: T[];
  searchParamName?: string;
  preserveDuplicates?: boolean;
  objectKeyLabel?: keyof T;
  value?: T;
  defaultValue?: T;
}

/**
 * Hook para gestionar búsquedas infinitas con optimización de rendimiento.
 */
export function useSearch<T>({
  onFetch,
  objectValueKey = "id" as keyof T,
  exclude = [],
  searchParamName = "search",
  debounceDelay = 350,
  params = { pageSize: 35 },
  queryKey = "no-cache",
  enabled = true,
  extraOptions = [],
  preserveDuplicates = false,
  objectKeyLabel,
  value,
  defaultValue,
}: UseSearchOptions<T>) {
  // 1. GESTIÓN DEL TÉRMINO DE BÚSQUEDA
  const [searchTerm, setSearchTerm] = useState(
    String(
      objectKeyLabel && defaultValue
        ? defaultValue[objectKeyLabel] ?? defaultValue["name" as keyof T] ?? ""
        : objectKeyLabel && value
        ? value[objectKeyLabel] ?? value["name" as keyof T] ?? ""
        : ""
    ) || ""
  );
  // El debounce evita que se disparen peticiones en cada pulsación de tecla
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // 2. CONFIGURACIÓN DE CACHÉ Y PARÁMETROS
  const normalizedParams = useMemo(
    () => ({ ...params }),
    [JSON.stringify(params)]
  );

  const stableQueryKey = useMemo(
    () => [queryKey, "infinite-autocomplete", debouncedSearchTerm],
    [queryKey, debouncedSearchTerm]
  );

  const cacheConfig = useMemo(() => {
    if (queryKey === "no-cache") {
      return {
        staleTime: 0,
        cacheTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      };
    }
    return {};
  }, [queryKey]);

  // 3. FUNCIÓN DE CARGA (FETCH)
  const fetcherWithSearch = useCallback(
    (fetchParams: IQueryable) => {
      fetchParams[searchParamName] = debouncedSearchTerm;
      return onFetch(fetchParams);
    },
    [onFetch, debouncedSearchTerm, searchParamName]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteAutocomplete({
      queryKey: stableQueryKey,
      onFetch: fetcherWithSearch,
      params,
      enabled,
      ...cacheConfig,
    });

  const options = useMemo(() => {
    const pagedOptions: T[] =
      data?.pages?.flatMap((page) => (page as any)?.data ?? []) ?? [];

    let allItems: T[] = [...extraOptions, ...pagedOptions];

    if (!preserveDuplicates) {
      const mergedMap = new Map<string, T>();
      for (const opt of allItems) {
        const key = String((opt as any)[objectValueKey]);
        if (!mergedMap.has(key)) mergedMap.set(key, opt);
      }
      allItems = Array.from(mergedMap.values());
    }

    if (exclude?.length > 0) {
      const excludeSet = new Set(exclude.map(String));
      allItems = allItems.filter(
        (opt: any) => !excludeSet.has(String(opt[objectValueKey]))
      );
    }

    return allItems;
  }, [data, exclude, objectValueKey, extraOptions, preserveDuplicates]);

  return {
    searchTerm,
    setSearchTerm,
    options,
    loading: isLoading || isFetchingNextPage,
    isLoading,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}
