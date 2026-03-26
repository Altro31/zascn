'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import useFiltersUrl from '@/hooks/use-filters-url';
import { useSearchParams } from 'next/navigation';

type PaginationProps = {
	page: number;
	totalCount: number;
	pageSize: number;
	hasNext: boolean;
	hasPrevious: boolean;
	pageSizeOptions?: number[];
	/** Si quieres permitir paginación sin modificar la URL (modo controlado), puedes pasar estos */
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (pageSize: number) => void;
};

export function Pagination({
	page,
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

	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
		<div className='flex flex-wrap items-center justify-end gap-3 pt-2'>
			{/* 🔹 Select de cantidad por página */}
			<div className='flex items-center gap-2'>
				<label className='text-sm text-gray-500 dark:text-gray-400'>
					Por página:
				</label>
				<select
					className='h-9 w-20 appearance-none rounded-md border border-gray-300 bg-white text-center text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
					value={String(pageSize)}
					onChange={(e) => handlePageSizeChange(Number(e.target.value))}
				>
					{pageSizeOptions.map((s) => (
						<option
							key={s}
							value={s}
						>
							{s}
						</option>
					))}
				</select>
			</div>

			{/* 🔹 Navegación */}
			<div className='flex items-center gap-2'>
				<button
					className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 p-0 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700'
					disabled={!hasPrevious}
					onClick={() => handlePageChange(Math.max(1, page - 1))}
					aria-label='Anterior'
					title='Anterior'
				>
					<ChevronLeft className='h-4 w-4' />
				</button>

				<span className='px-2 text-sm text-gray-600 dark:text-gray-300'>
					{page} de {totalPages}
				</span>

				<button
					className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 p-0 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700'
					disabled={!hasNext}
					onClick={() => handlePageChange(page + 1)}
					aria-label='Siguiente'
					title='Siguiente'
				>
					<ChevronRight className='h-4 w-4' />
				</button>
			</div>
		</div>
	);
}
