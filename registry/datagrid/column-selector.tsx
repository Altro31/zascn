'use client';

import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useEffect } from 'react';
import {
	COLUMN_SELECTOR_MAX_HEIGHT,
	COLUMN_SELECTOR_WIDTH,
	EXCLUDED_COLUMN_ACCESSORS,
} from './constants';
import { ColumnSelectorProps } from './types';

export function ColumnSelector<T extends Record<string, any>>({
	columns,
	hiddenColumns,
	onToggleColumn,
	isOpen,
	onToggle,
}: ColumnSelectorProps<T>) {
	// Get toggle-able columns (exclude actions and other special columns)
	const toggleableColumns = columns.filter((column) => {
		const accessor = column.accessor as string;
		return !EXCLUDED_COLUMN_ACCESSORS.includes(accessor) && column.title;
	});

	// Close column selector when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest('.column-selector-container')) {
				onToggle();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () =>
				document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isOpen, onToggle]);

	return (
		<div className='column-selector-container relative'>
			<button
				type='button'
				className='btn btn-outline-primary text-textColor flex items-center gap-1 md:gap-2 dark:bg-gray-800 dark:text-white'
				onClick={onToggle}
			>
				<Eye className='h-4 w-4' />
				Columnas
				<ChevronDown
					className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{isOpen && (
				<div
					className={`absolute top-full right-0 z-50 mt-2 ${COLUMN_SELECTOR_WIDTH} rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:shadow-gray-900/20`}
				>
					<h4 className='mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100'>
						Mostrar/Ocultar Columnas
					</h4>
					<div
						className={`space-y-2 ${COLUMN_SELECTOR_MAX_HEIGHT} overflow-y-auto`}
					>
						{toggleableColumns.map((column) => {
							const accessor = column.accessor as string;
							const isVisible = !hiddenColumns.includes(accessor);
							return (
								<label
									key={accessor}
									className='flex cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700'
								>
									<input
										type='checkbox'
										checked={isVisible}
										onChange={() => onToggleColumn(accessor)}
										className='form-checkbox text-primary focus:ring-primary hidden h-4 w-4 border-gray-300 dark:border-gray-600 dark:bg-gray-700'
									/>
									<span className='flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200'>
										{isVisible ? (
											<Eye className='h-4 w-4 text-green-500 dark:text-green-400' />
										) : (
											<EyeOff className='h-4 w-4 text-gray-400 dark:text-gray-500' />
										)}
										{column.title || accessor}
									</span>
								</label>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
