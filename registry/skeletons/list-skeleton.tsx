interface ListSkeletonProps {
	title?: string;
	description?: string;
	rows?: number;
	buttons?: number;
}

export function ListSkeleton({
	title,
	description,
	rows = 8,
	buttons = 2,
}: ListSkeletonProps) {
	return (
		<div className='space-y-6'>
			<div className='panel'>
				<div className='mb-5 flex flex-col gap-3'>
					<div>
						<h2 className='text-dark dark:text-white-light text-xl font-semibold'>
							{title}
						</h2>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							{description}
						</p>
					</div>

					<div className='flex items-center justify-between'>
						<div className='h-10 w-full max-w-xs animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
						<div className='mt-4 flex animate-pulse gap-2'>
							{[...Array(buttons)].map((_, i) => (
								<div
									key={i}
									className={`h-10 rounded bg-gray-200 dark:bg-gray-700 ${
										i === 0 ? 'w-48' : 'w-32'
									}`}
								/>
							))}
						</div>
					</div>
				</div>

				<div className='space-y-3'>
					{[...Array(rows)].map((_, i) => (
						<div
							key={i}
							className='h-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700'
						/>
					))}
				</div>
			</div>
		</div>
	);
}
