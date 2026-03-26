'use client';

import { Pagination } from '@/components/datagrid/pagination';
import { SearchParams } from '@/types/fetch/request';
import React, { useEffect, useState } from 'react';

export type CardGridProps<T> = {
	data?: {
		data: T[];
		totalCount: number;
		page: number;
		pageSize: number;
		hasNext: boolean;
		hasPrevious: boolean;
	};
	searchParams: SearchParams;
	onSearchParamsChange: (params: SearchParams) => void;
	emptyText?: string;
	searchPlaceholder?: string;
	leftActions?: React.ReactNode;
	rightActions?: React.ReactNode;
	renderCard: (item: T, index: number) => React.ReactNode;
};

export default function CardGrid<T>({
	data,
	searchParams: sp,
	onSearchParamsChange,
	leftActions,
	rightActions,
	emptyText = 'Sin datos',
	renderCard,
}: CardGridProps<T>) {
	const searchParams = SearchParams.parse(sp);
	const [pageSize, setPageSize] = useState<number>(
		Number(searchParams.pageSize || data?.pageSize || 6),
	);

	useEffect(() => {
		setPageSize(Number(searchParams.pageSize || data?.pageSize || 6));
	}, [searchParams.pageSize, data?.pageSize]);

	const onPageChange = (page: number) =>
		onSearchParamsChange({ ...searchParams, page });

	const onPageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		onSearchParamsChange({ ...searchParams, page: 1, pageSize: newPageSize });
	};

	return (
		<div className='space-y-4'>
			{(leftActions || rightActions) && (
				<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex-1'>{leftActions}</div>
					<div>{rightActions}</div>
				</div>
			)}

			{!data || data.data.length === 0 ? (
				<div className='py-8 text-center text-sm text-slate-500'>
					{emptyText}
				</div>
			) : (
				<div className='grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4'>
					{data.data.map(renderCard)}
				</div>
			)}

			{data && data.totalCount > 0 && (
				<Pagination
					page={data.page}
					currentCount={data.data.length}
					totalCount={data.totalCount}
					pageSize={pageSize}
					hasNext={data.hasNext}
					hasPrevious={data.hasPrevious}
					onPageChange={onPageChange}
					onPageSizeChange={onPageSizeChange}
				/>
			)}
		</div>
	);
}
