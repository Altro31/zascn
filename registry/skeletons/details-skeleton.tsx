'use client';

interface DetailsSkeletonProps {
	title: string;
	rows?: number;
	rowHeight?: number;
}

export function DetailsSkeleton({
	title,
	rows = 4,
	rowHeight = 16,
}: DetailsSkeletonProps) {
	return (
		<div className='animate-pulse space-y-4 rounded-lg bg-gray-700 p-6'>
			<h3 className='text-lg font-semibold text-gray-900'>{title}</h3>

			<div className='space-y-2'>
				{Array.from({ length: rows }).map((_, i) => (
					<div
						key={i}
						className='rounded bg-gray-700'
						style={{ height: `${rowHeight}px` }}
					/>
				))}
			</div>
		</div>
	);
}
