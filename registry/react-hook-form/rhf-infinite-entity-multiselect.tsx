'use client';

import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ScrollArea } from '@mantine/core';
import { Check, Search, X } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';

import Checkbox from '@/components/input/checkbox';
import Loader from '@/components/loaders/loader';
import { cn } from '@/lib/utils';
import { ApiResponse } from '@/types/fetch/api';
import { IQueryable } from '@/types/fetch/request';
import { PaginatedResponse } from '@/types/common';
import useDebounce from '@/hooks/use-debounce';

// --- Sub-componente de Input ---
function CustomInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    const base = 'block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed';
    return <input {...props} className={cn(base, className)} />;
}

export interface RHFInfiniteEntityMultiSelectProps<T extends { id: string }> {
    name: string;
    label: string;
    description?: string;
    toolbarTitle?: string;
    toolbarSubtitle?: string;
    searchPlaceholder?: string;
    emptyLabel?: string;
    noResultsLabel?: string;
    showToolbarActions?: boolean;
    pageSize?: number;
    searchDebounceMs?: number;
    onFetch: (params: IQueryable) => Promise<ApiResponse<PaginatedResponse<T>>>;
    queryKey: (string | number | boolean | undefined)[];
    searchProperties?: string[];
    enabled?: boolean;
    getLabel: (item: T) => string;
    getDescription?: (item: T) => string | undefined;
    initialSelectedItems?: T[];
}

export default function RHFInfiniteEntityMultiSelect<T extends { id: string }>({
    name,
    label,
    description,
    toolbarTitle,
    toolbarSubtitle,
    searchPlaceholder,
    emptyLabel = 'No hay elementos disponibles',
    noResultsLabel = 'No se encontraron resultados',
    pageSize = 50,
    searchDebounceMs = 300,
    onFetch,
    queryKey,
    searchProperties = ['name'],
    enabled = true,
    getLabel,
    getDescription,
    initialSelectedItems = [],
    showToolbarActions = true,
}: RHFInfiniteEntityMultiSelectProps<T>) {
    const { control } = useFormContext();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, searchDebounceMs);
    const observerTarget = useRef<HTMLDivElement>(null);

    // --- Query Infinita ---
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['infinite-entity-select', name, ...queryKey, debouncedSearch],
        queryFn: ({ pageParam = 1 }) => onFetch({
            page: pageParam,
            pageSize,
            properties: searchProperties,
            ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        }),
        getNextPageParam: (lastPage) => lastPage?.data?.hasNext ? lastPage.data.page + 1 : undefined,
        enabled,
        initialPageParam: 1,
    });

    // --- Scroll Infinito (Observer) ---
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
            },
            { threshold: 0.1 }
        );
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // --- Datos Estables ---
    const queryItems = useMemo(() => 
        data?.pages.flatMap((page) => (Array.isArray(page?.data?.data) ? (page.data.data as T[]) : [])) ?? [],
    [data]);

    const allItems = useMemo(() => {
        const map = new Map<string, T>();
        initialSelectedItems.forEach(item => item?.id && map.set(item.id, item));
        queryItems.forEach(item => item?.id && map.set(item.id, item));
        return Array.from(map.values());
    }, [initialSelectedItems, queryItems]);

    const filteredItems = useMemo(() => {
        const term = debouncedSearch.toLowerCase();
        if (!term) return allItems;
        return allItems.filter((item) => {
            const l = getLabel(item).toLowerCase();
            const d = getDescription?.(item)?.toLowerCase() ?? '';
            return l.includes(term) || d.includes(term);
        });
    }, [allItems, debouncedSearch, getLabel, getDescription]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                // Sincronizamos los IDs de RHF
                const selectedIds = useMemo(() => (Array.isArray(field.value) ? field.value : []), [field.value]);

                const handleToggle = (id: string) => {
                    const next = selectedIds.includes(id)
                        ? selectedIds.filter((i: string) => i !== id)
                        : [...selectedIds, id];
                    field.onChange(next);
                };

                const handleSelectAll = () => {
                    const visibleIds = filteredItems.map(i => i.id);
                    const next = Array.from(new Set([...selectedIds, ...visibleIds]));
                    field.onChange(next);
                };

                return (
                    <div className="bg-card flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm md:p-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-sm font-semibold md:text-base">{toolbarTitle ?? label}</h2>
                                <span className="text-muted-foreground text-xs">{selectedIds.length} seleccionados</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {showToolbarActions && (
                                <div className="bg-muted/40 flex flex-col gap-2 rounded-lg border px-3 py-2 md:flex-row md:items-center md:justify-between">
                                    <span className="text-xs font-medium">Acciones</span>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handleSelectAll} className="bg-primary rounded-md px-3 py-1 text-[11px] text-white">
                                            Seleccionar visibles
                                        </button>
                                        <button type="button" onClick={() => field.onChange([])} className="rounded-md bg-slate-200 px-3 py-1 text-[11px] dark:bg-slate-700">
                                            Limpiar todo
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <CustomInput
                                    placeholder={searchPlaceholder ?? 'Buscar...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm('')} className="absolute top-1/2 right-3 -translate-y-1/2">
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="bg-background/50 flex flex-col rounded-lg border">
                            {/* FIJAMOS LA ALTURA Y EVITAMOS EL RE-RENDER DE MANTINE */}
                            <ScrollArea h={260} type="auto">
                                <div className="divide-y">
                                    {isLoading && <div className="p-8 flex justify-center"><Loader /></div>}
                                    
                                    {!isLoading && filteredItems.length === 0 && (
                                        <div className="p-8 text-center text-sm text-muted-foreground">{noResultsLabel}</div>
                                    )}

                                    {filteredItems.map((item) => (
                                        <ItemRow
                                            key={item.id}
                                            id={item.id}
                                            isSelected={selectedIds.includes(item.id)}
                                            onToggle={handleToggle}
                                            label={getLabel(item)}
                                            description={getDescription?.(item)}
                                        />
                                    ))}
                                    
                                    <div ref={observerTarget} className="h-4 w-full" />
                                    {isFetchingNextPage && <div className="p-4 text-center text-xs">Cargando más...</div>}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                );
            }}
        />
    );
}

// --- Fila Memorizada para Evitar Saltos Visuales ---
const ItemRow = React.memo(({ id, isSelected, onToggle, label, description }: any) => {
    return (
        <div 
            onClick={() => onToggle(id)}
            className="hover:bg-muted/60 group flex cursor-pointer items-start gap-3 p-3 transition-colors md:p-4"  
        >
            <Checkbox
                checked={isSelected}
                onChange={() => {}} // El click lo maneja el div para mayor área
                className="mt-1 pointer-events-none"
            />
            <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium md:text-sm">{label}</span>
                    {isSelected && <Check className="text-primary h-3.5 w-3.5" />}
                </div>
                {description && <p className="text-muted-foreground text-[11px] line-clamp-1">{description}</p>}
            </div>
        </div>
    );
});

ItemRow.displayName = 'ItemRow';