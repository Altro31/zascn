'use client';

import {
	DataTable,
	DataTableSortStatus,
	DataTableRowClickHandler,
} from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { PAGE_SIZES } from './constants';
import { DataGridHeader } from './datagrid-header';
import { useColumnVisibility, useDataGridHandlers } from './hooks';
import { DataGridProps } from './types';
import Checkbox from '@/components/input/checkbox';
import { SearchParams } from '@/lib/types';

export function DataGrid<T extends Record<string, any>>({
	data,
	simpleData,
	columns,
	searchParams: sp = {},
	onSearchParamsChange,
	onRowClick,
	getRowClassName,
	searchPlaceholder,
	enableSearch = true,
	enablePagination = true,
	enableSorting = true,
	enableColumnToggle = true,
	enableRowSelection = false,
	minHeight = 400,
	onCreate,
	className = '',
	emptyText,
	createLoading = false,
	createText,
	leftActions,
	rightActions,
	customActions,
	searchValueOverride,
	onSearchChangeOverride,
	searchProperties,
	filterTabs,
	filterTabsOptions,
	defaultActiveFilterKey,
	activeFilterKey,
	onFilterTabChange,
	bulkAction,
	selectAllLabel,
	excludeRowFromSelection,
	loading,
	ignoreRowClickAccessors,
	enableLocalSearch = false,
}: DataGridProps<T>) {
	const searchParams = SearchParams.parse(sp);
	// Normalizar datos para evitar TypeError cuando llega undefined o un objeto no iterable
	const safeSimpleData = Array.isArray(simpleData)
		? simpleData
		: Array.isArray((data as any)?.data)
			? (data as any).data
			: [];

	const [searchValue, setSearchValue] = useState<string | null>(null);
	useEffect(() => {
		if (searchValue == null) {
			setSearchValue(searchParams.search ?? null);
		}
	}, [searchParams.search]);
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
		columnAccessor: (searchParams.sortBy as any) || '',
		direction: searchParams.isDescending ? 'desc' : 'asc',
	});
	const [showColumnSelector, setShowColumnSelector] = useState(false);
	// Controlar localmente el tamaño de página para reflejar cambios inmediatos en el selector
	// Fallback a pageSize proveniente del backend (PaginatedResponse) cuando no viene en searchParams
	const initialPageSize =
		searchParams.pageSize ?? (data as any)?.pageSize ?? 10;
	const [pageSize, setPageSize] = useState<number>(initialPageSize);
	// Selección de filas
	const [selectedRecords, setSelectedRecords] = useState<T[]>([]);

	// Custom hooks
	const { hiddenColumns, toggleColumnVisibility } = useColumnVisibility();
	const {
		handleSearch,
		handlePageChange,
		handlePageSizeChange,
		handleSortStatusChange,
	} = useDataGridHandlers({ searchParams, onSearchParamsChange });

	// Get visible columns (filter out hidden ones)
	const baseVisibleColumns = columns.filter(
		(column) => !hiddenColumns.includes(column.accessor as string),
	);

	// Local search: filter simpleData by searchValue + searchProperties when enabled
	const filteredSimpleData = useMemo(() => {
		if (!enableLocalSearch || !searchValue) return safeSimpleData;
		const term = searchValue.toLowerCase();
		return (safeSimpleData as T[]).filter((row) =>
			searchProperties.some((prop) => {
				const val = (row as any)?.[prop];
				return val != null && String(val).toLowerCase().includes(term);
			}),
		);
	}, [enableLocalSearch, safeSimpleData, searchValue, searchProperties]);

	// Registros visibles actuales (página actual / datos simples)
	const currentRecords: T[] = useMemo(
		() => ((data as any)?.data as T[]) || (filteredSimpleData as T[]) || [],
		[data, filteredSimpleData],
	);

	// Total de registros (para paginación)
	const totalRecords =
		(typeof (data as any)?.totalCount === 'number'
			? (data as any).totalCount
			: filteredSimpleData.length) || 0;

	// Local selection helpers
	const isRecordSelected = (record: T) => selectedRecords.includes(record);
	const toggleRecordSelection = (record: T) => {
		setSelectedRecords((prev) => {
			const exists = prev.includes(record);
			if (exists) return prev.filter((r) => r !== record);
			return [...prev, record];
		});
	};

	const allVisibleSelected = useMemo(
		() =>
			currentRecords.length > 0 &&
			currentRecords.every((r) => isRecordSelected(r)),
		[currentRecords, selectedRecords],
	);

	const someVisibleSelected = useMemo(
		() =>
			currentRecords.some((r) => isRecordSelected(r)) && !allVisibleSelected,
		[currentRecords, selectedRecords, allVisibleSelected],
	);

	const toggleAllVisible = () => {
		setSelectedRecords((prev) => {
			if (allVisibleSelected) {
				// deselect only visible
				return prev.filter((r) => !currentRecords.includes(r));
			}
			// select union of existing + visible (avoid dups)
			const set = new Set(prev);
			currentRecords.forEach((r) => set.add(r));
			return Array.from(set);
		});
	};

	const visibleColumns = useMemo(() => {
		if (!enableRowSelection) return baseVisibleColumns;
		const selectionCol: any = {
			accessor: '__select__',
			title: ' ',
			width: 48,
			textAlign: 'center',
			sortable: false,
			render: (record: T) => {
				if (excludeRowFromSelection && excludeRowFromSelection(record)) {
					return null; // No renderizar checkbox para esta fila
				}
				return (
					<div className='flex items-center justify-center'>
						<Checkbox
							checked={isRecordSelected(record)}
							onChange={() => toggleRecordSelection(record)}
						/>
					</div>
				);
			},
		};
		return [selectionCol, ...baseVisibleColumns];
	}, [
		enableRowSelection,
		baseVisibleColumns,
		selectedRecords,
		allVisibleSelected,
	]);

	// Handle search with state update (or delegate to overrides)
	const handleSearchWithState = (value: string) => {
		if (typeof onSearchChangeOverride === 'function') {
			onSearchChangeOverride(value);
			return;
		}

		setSearchValue(value);

		// When local search is enabled, filtering is handled via filteredSimpleData memo
		if (!enableLocalSearch) {
			handleSearch(
				value,
				searchProperties.map((prop) => String(prop)),
			);
		}
	};

	// Handle sorting with state update
	const handleSortWithState = (sortStatus: DataTableSortStatus<T>) => {
		setSortStatus(sortStatus as DataTableSortStatus<T>);
		handleSortStatusChange({
			columnAccessor: sortStatus.columnAccessor as string,
			direction: sortStatus.direction,
		});
	};

	const handlePageSizeChangeWithState = (size: number) => {
		setPageSize(size);
		handlePageSizeChange(size);
	};

	const handleSelectAllVisible = () => {
		setSelectedRecords(currentRecords);
	};

	const handleBulkAction = async () => {
		if (!bulkAction?.onClick) return;
		await Promise.resolve(bulkAction.onClick(selectedRecords));
		// Limpiar selección tras ejecutar la acción
		setSelectedRecords([]);
	};

	useEffect(() => {
		setSortStatus({
			columnAccessor: searchParams.sortBy || '',
			direction: searchParams.isDescending ? 'desc' : 'asc',
		});
	}, [searchParams.sortBy, searchParams.isDescending, searchValueOverride]);

	useEffect(() => {
		if (typeof searchParams.pageSize === 'number') {
			setPageSize(searchParams.pageSize);
			return;
		}
		// Si no viene en searchParams (caso SSR con paginación del backend),
		// sincronizamos con el pageSize de la respuesta cuando cambie.
		if (typeof (data as any)?.pageSize === 'number') {
			setPageSize((data as any).pageSize);
		}
	}, [searchParams.pageSize, (data as any)?.pageSize]);

	// Página efectiva: prioridad a searchParams.page (uso client-side),
	// luego al page proveniente del backend (PaginatedResponse).
	const effectivePage =
		typeof searchParams.page === 'number'
			? searchParams.page
			: typeof (data as any)?.page === 'number'
				? (data as any).page
				: 1;

	// Determinar si hay página anterior / siguiente
	const hasPrevious =
		typeof (data as any)?.hasPrevious === 'boolean'
			? (data as any).hasPrevious
			: effectivePage > 1;

	const hasNext =
		typeof (data as any)?.hasNext === 'boolean'
			? (data as any).hasNext
			: effectivePage * pageSize < totalRecords;

	return (
		<div className={`${className} relative`}>
			<DataGridHeader
				enableSearch={enableSearch}
				enableColumnToggle={enableColumnToggle}
				searchPlaceholder={searchPlaceholder}
				searchValue={
					typeof searchValueOverride === 'string'
						? searchValueOverride
						: (searchValue ?? '')
				}
				onSearchChange={handleSearchWithState}
				onCreate={onCreate}
				createLoading={createLoading}
				createText={createText}
				columns={columns}
				hiddenColumns={hiddenColumns}
				onToggleColumn={toggleColumnVisibility}
				showColumnSelector={showColumnSelector}
				onToggleColumnSelector={() =>
					setShowColumnSelector(!showColumnSelector)
				}
				leftActions={leftActions}
				rightActions={rightActions}
				customActions={customActions}
				filterTabs={filterTabs}
				filterTabsOptions={filterTabsOptions}
				defaultActiveFilterKey={defaultActiveFilterKey}
				activeFilterKey={activeFilterKey}
				onFilterTabChange={onFilterTabChange}
				selectedCount={selectedRecords.length}
				selectAllLabel={selectAllLabel}
				onSelectAllVisible={handleSelectAllVisible}
				bulkActionLabel={bulkAction?.label}
				bulkActionClassName={bulkAction?.className}
				onBulkAction={handleBulkAction}
				bulkActionDisabled={bulkAction?.disabled}
				bulkActionLoading={bulkAction?.loading}
			/>

			<div className='datatables'>
				{/** Overlay de carga */}
				{loading && (
					<div className='absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-slate-900/60'>
						<div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
					</div>
				)}
				<DataTable<T>
					columns={visibleColumns}
					records={currentRecords}
					withTableBorder={true}
					minHeight={minHeight}
					sortStatus={(enableSorting ? sortStatus : undefined) as any}
					onSortStatusChange={enableSorting ? handleSortWithState : () => {}}
					pinLastColumn
					className='table-hover whitespace-nowrap'
					totalRecords={totalRecords}
					recordsPerPage={pageSize}
					page={effectivePage}
					onPageChange={enablePagination ? handlePageChange : () => {}}
					recordsPerPageOptions={enablePagination ? PAGE_SIZES : []}
					onRecordsPerPageChange={
						enablePagination ? handlePageSizeChangeWithState : () => {}
					}
					// Ocultar flechas de anterior / siguiente cuando no haya más páginas
					getPaginationControlProps={(control) => {
						if (control === 'previous' && !hasPrevious) {
							return { style: { display: 'none' } };
						}
						if (control === 'next' && !hasNext) {
							return { style: { display: 'none' } };
						}
						return {};
					}}
					paginationText={({ from, to, totalRecords }) =>
						`Mostrando ${from} - ${to} ${'de '} ${totalRecords}`
					}
					noRecordsText={emptyText || 'No hay registros'}
					loadingText={'Cargando'}
					striped
					highlightOnHover
					rowClassName={(record) => {
						const base = onRowClick
							? 'cursor-pointer dark:hover:bg-primary/20'
							: '';
						const extra = getRowClassName ? getRowClassName(record as T) : '';
						return [base, extra].filter(Boolean).join(' ') || undefined;
					}}
					onRowClick={
						onRowClick
							? (params: Parameters<DataTableRowClickHandler<T>>[0]) => {
									const event = params.event as React.MouseEvent | undefined;
									if (event) {
										const target = event.target as HTMLElement | null;
										const cell = target?.closest(
											'td',
										) as HTMLTableCellElement | null;
										if (cell) {
											const cellIndex = cell.cellIndex;
											const column = visibleColumns[cellIndex] as any;
											const accessor = column?.accessor as string | undefined;
											// Siempre ignorar clicks en la columna de selección
											if (accessor === '__select__') {
												return;
											}
											// Ignorar columnas configuradas explícitamente por el consumidor
											if (
												accessor &&
												Array.isArray(ignoreRowClickAccessors) &&
												ignoreRowClickAccessors.includes(accessor)
											) {
												return;
											}
										}
									}
									onRowClick({
										record: params.record as T,
										index: params.index,
									});
								}
							: undefined
					}
					paginationActiveBackgroundColor={'blue'}
					// custom selection via selection column above
				/>
			</div>
		</div>
	);
}
