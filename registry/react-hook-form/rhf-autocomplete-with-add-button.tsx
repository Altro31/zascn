import { Button } from '@/components/button/button';
import { Label } from '@/components/label/label';

import { Plus } from 'lucide-react';
import RHFAutocompleteFetcherInfinity from './rhf-autcomplete-fetcher-scroll-infinity';
import type { ApiResponse, IQueryable, PaginatedResponse } from '@/lib/types';

type cacheTagEntities = 'units' | 'categories' | 'roles';

interface RHFAutocompleteWithAddButtonProps<T> {
	name: string;
	label: string;
	placeholder: string;
	exclude?: string[];
	required?: boolean;
	multiple?: boolean;
	dataTest?: string;
	onChangeOptional?: VoidFunction;
	onScrollEnd?: VoidFunction;
	renderOption?: (option: T) => React.ReactNode;
	renderMultiplesValues?: (options: T[]) => React.ReactNode;
	onFetch: (params: IQueryable) => Promise<ApiResponse<PaginatedResponse<T>>>;
	onOpenModal: () => void;
	objectValueKey?: keyof T;
	objectKeyLabel?: keyof T;
	params?: IQueryable;
	containerClassname?: string;
	className?: string;
	pillsClassname?: string;
	queryKey: cacheTagEntities;
	enabled?: boolean;
	isSubmitting?: boolean;
	disabled?: boolean;
	icon?: React.ReactNode;
	buttonClassName?: string;
	buttonColor?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
	displayFormatter?: (option: T) => string;
}

export const RHFAutocompleteWithAddButton = <T,>({
	name,
	label,
	placeholder,
	onFetch,
	onOpenModal,
	multiple = false,
	objectValueKey,
	className = 'form-input w-full',
	containerClassname,
	pillsClassname,
	isSubmitting = false,
	disabled = false,
	icon,
	buttonClassName,
	buttonColor = 'purple',
	queryKey,
	...props
}: RHFAutocompleteWithAddButtonProps<T>) => {
	const getButtonColorClasses = () => {
		const colorMap = {
			purple:
				'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800',
			blue: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
			green:
				'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
			orange:
				'bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800',
			red: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
		};
		return colorMap[buttonColor];
	};

	const getDefaultPillsClassName = () => {
		const colorMap = {
			purple:
				'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:hover:bg-purple-800/30',
			blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-800/30',
			green:
				'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-200 dark:hover:bg-green-800/30',
			orange:
				'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-200 dark:hover:bg-orange-800/30',
			red: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-200 dark:hover:bg-red-800/30',
		};
		return colorMap[buttonColor];
	};

	return (
		<div className='space-y-2'>
			<Label className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
				{icon}
				{label}
			</Label>
			<div className='flex items-center gap-2'>
				<RHFAutocompleteFetcherInfinity
					queryKey={queryKey}
					name={name}
					placeholder={placeholder}
					objectValueKey={objectValueKey}
					onFetch={onFetch}
					multiple={multiple}
					containerClassname={containerClassname}
					inputClassName={className}
					pillsClassname={pillsClassname || getDefaultPillsClassName()}
					disabled={disabled || isSubmitting}
					{...props}
				/>
				<Button
					type='button'
					onClick={onOpenModal}
					disabled={disabled || isSubmitting}
					className={`${getButtonColorClasses()} self-start rounded-t-lg border-none p-2 text-lg text-white ${buttonClassName || ''}`}
				>
					<Plus className='h-5 w-5 text-white' />
				</Button>
			</div>
		</div>
	);
};
