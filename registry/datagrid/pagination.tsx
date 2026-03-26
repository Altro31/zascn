'use client';

import { DataTablePagination } from '@/components/datagrid/pagination/datatable-pagination';
import useFiltersUrl from '@/hooks/use-filters-url';
import { useSearchParams } from 'next/navigation';

type PaginationProps = {
	page: number;
	currentCount: number;
	totalCount: number;
	pageSize: number;
	hasNext: boolean;
	hasPrevious: boolean;
	pageSizeOptions?: number[];
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
};

export function Pagination({
	page,
	currentCount,
	totalCount,
	pageSize,
	hasNext,
	hasPrevious,
	pageSizeOptions = [6, 9, 12, 18, 24],
	onPageChange,
	onPageSizeChange,
}: PaginationProps) {
	const { updateFiltersInUrl } = useFiltersUrl();
	const searchParams = useSearchParams();

	const handlePageChange = (newPage: number) => {
		if (onPageChange) {
			onPageChange(newPage);
		} else {
			updateFiltersInUrl({
				...Object.fromEntries(searchParams),
				page: newPage,
			});
		}
	};

	const handlePageSizeChange = (newPageSize: number) => {
		if (onPageSizeChange) {
			onPageSizeChange(newPageSize);
		} else {
			updateFiltersInUrl({
				...Object.fromEntries(searchParams),
				page: 1,
				pageSize: newPageSize,
			});
		}
	};

	return (
		<DataTablePagination
			className={undefined}
			style={undefined}
			horizontalSpacing={undefined}
			fetching={undefined}
			page={page}
			totalRecords={totalCount}
			onPageChange={handlePageChange}
			recordsPerPageOptions={pageSizeOptions}
			onRecordsPerPageChange={handlePageSizeChange}
			recordsPerPage={pageSize}
			recordsPerPageLabel={'Records per page'}
			paginationWithEdges={undefined}
			paginationWithControls={undefined}
			paginationActiveTextColor={undefined}
			paginationActiveBackgroundColor={'blue'}
			paginationSize={'sm'}
			paginationText={({ from, to, totalRecords }) =>
				`Mostrando ${from} - ${to} ${'de '} ${totalRecords}`
			}
			paginationWrapBreakpoint={'sm'}
			getPaginationControlProps={(control) => {
				if (control === 'previous' && !hasPrevious) {
					return { style: { display: 'none' } };
				}
				if (control === 'next' && !hasNext) {
					return { style: { display: 'none' } };
				}
				return {};
			}}
			getPaginationItemProps={undefined}
			noRecordsText={'No hay registros'}
			loadingText={'Cargando'}
			recordsLength={currentCount}
			renderPagination={undefined}
		/>
	);
}
