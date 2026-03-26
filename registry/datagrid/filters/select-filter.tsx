import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface SelectOption {
	value: string | number;
	label: string;
}

interface SelectFilterProps {
	name?: string;
	label?: React.ReactNode;
	placeholder?: string;
	emptyOption?: string;
	options: SelectOption[];
	value?: string | number | '';
	onChange: (value: string | number | '') => void;
	loading?: boolean;
	disabled?: boolean;
	size?: 'small' | 'default';
	className?: string;
}

const sizeClasses: Record<NonNullable<SelectFilterProps['size']>, string> = {
	small: 'h-9 text-sm',
	default: 'h-12 text-sm',
};

export function SelectFilter({
	name,
	label,
	placeholder,
	emptyOption,
	options,
	value,
	onChange,
	loading,
	disabled,
	size = 'default',
	className = '',
}: SelectFilterProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleOutside = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleOutside);
		return () => document.removeEventListener('mousedown', handleOutside);
	}, []);

	const emptyLabel = emptyOption ?? placeholder ?? 'Todos';
	const selected = options.find((o) => String(o.value) === String(value ?? ''));
	const displayLabel = selected ? selected.label : emptyLabel;

	const handleSelect = (v: string) => {
		onChange(v);
		setIsOpen(false);
	};

	return (
		<div className={`w-full ${className}`}>
			{label && (
				<label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200'>
					{label}
				</label>
			)}
			{/* hidden input for form compat */}
			<input
				type='hidden'
				name={name}
				value={value === undefined ? '' : String(value)}
			/>
			<div
				className='relative'
				ref={containerRef}
			>
				<button
					type='button'
					disabled={disabled || loading}
					onClick={() => setIsOpen((o) => !o)}
					className={
						'form-input flex w-[120px]! items-center justify-between rounded-xl border-2 border-slate-200 bg-white text-left outline-none focus:border-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 ' +
						sizeClasses[size]
					}
				>
					<span
						className={
							selected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
						}
					>
						{loading ? 'Cargando...' : displayLabel}
					</span>
					<ChevronDown
						className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					/>
				</button>

				{isOpen && (
					<ul className='absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-[#121c2c]'>
						<li
							className='ultra-thin-scrollbar cursor-pointer px-4 py-2 text-sm text-gray-500 select-none hover:bg-blue-100 dark:text-gray-400 dark:hover:bg-blue-900/30'
							onClick={() => handleSelect('')}
						>
							{emptyLabel}
						</li>
						{options.map((opt) => {
							const isSelected = String(opt.value) === String(value ?? '');
							return (
								<li
									key={String(opt.value)}
									className={
										'ultra-thin-scrollbar cursor-pointer px-4 py-2 text-sm select-none ' +
										(isSelected
											? 'bg-blue-100 dark:bg-blue-800/40'
											: 'hover:bg-blue-100 dark:hover:bg-blue-900/30')
									}
									onClick={() => handleSelect(String(opt.value))}
								>
									{opt.label}
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}

export default SelectFilter;
