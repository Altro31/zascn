'use client';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SearchSelectProps<T = any> {
	// # INPUT PROPS
	query?: string;
	label?: string;
	setQuery?: (q: string) => void;
	placeholder?: string;
	loading?: boolean;
	required?: boolean;
	// # SELECT PROPS
	options: T[];
	objectValueKey: keyof T;
	objectKeyLabel?: keyof T;
	exclude?: string[];
	multiple?: boolean;
	onScrollEnd?: () => void;
	renderOption?: (option: T) => React.ReactNode;
	dataTest?: string;
	containerClassname?: string;
	pillsClassname?: string;
	inputClassName?: string;
	menuClassName?: string;
	optionClassName?: string;
	displayFormatter?: (option: T) => string;
	renderMultiplesValues?: (
		options: T[],
		removeSelected: (option: T) => void,
	) => React.ReactNode;
	onOptionSelected?: (option: T) => void;
	value: any; //TODO Upgrade type
	onChange: (value: any) => void; //TODO Upgrade type
	error?: { message: string };
	clearable?: boolean;
	handleAddOption?: (option: any) => void;
	disabled?: boolean;
}

export function AdvancedSearchSelect<T>({
	label,
	placeholder,
	options,
	objectValueKey,
	objectKeyLabel,
	loading,
	required,
	multiple = false,
	onScrollEnd,
	renderOption,
	dataTest,
	containerClassname,
	pillsClassname,
	inputClassName,
	menuClassName,
	optionClassName,
	renderMultiplesValues,
	query = '',
	setQuery,
	onOptionSelected,
	value,
	error,
	onChange,
	clearable = true,
	displayFormatter,
	handleAddOption,
	disabled,
}: SearchSelectProps<T>) {
	const scrollRef = useRef<HTMLUListElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const pillsRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	const [preserveQueryOnClear, setPreserveQueryOnClear] = useState(false);

	// Get display value for an option
	const getDisplayValue = useCallback(
		(option: T): string => {
			if (displayFormatter) {
				return displayFormatter(option);
			}
			if (renderOption) {
				const rendered = renderOption(option);
				if (typeof rendered === 'string') {
					return rendered;
				}
			}
			return String(
				objectKeyLabel ? option[objectKeyLabel] : option[objectValueKey],
			);
		},
		[objectKeyLabel, objectValueKey, renderOption, displayFormatter],
	);

	// Filter options based on exclude and query
	const filteredOptions = options;

	const handleScroll = () => {
		if (!scrollRef.current || !onScrollEnd) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
		if (scrollTop + clientHeight >= scrollHeight * 0.9) {
			onScrollEnd();
		}
	};

	const handleSelect = (
		option: T,
		currentValue: any,
		onChange: (value: any) => void,
	) => {
		const value = option[objectValueKey];

		if (multiple) {
			const currentArray = Array.isArray(currentValue) ? currentValue : [];
			const newValue = currentArray.includes(value)
				? currentArray.filter((v) => v !== value)
				: [...currentArray, value];
			onChange(newValue);
			if (setQuery) setQuery('');
		} else {
			onChange(value);
			if (setQuery) setQuery(getDisplayValue(option));
			setIsOpen(false);
		}
		setIsTyping(false); // <- dejar de escribir cuando selecciona!
		setPreserveQueryOnClear(false);
		// Notificamos al padre qué opción fue seleccionada (single o multiple)
		onOptionSelected?.(option);
	};

	const handleAddCustomOption = useCallback(() => {
		if (!handleAddOption) return;
		handleAddOption(query);
		setPreserveQueryOnClear(true);
		setIsTyping(false);
		setIsOpen(false);
		inputRef.current?.focus();
	}, [handleAddOption, query]);

	const removeSelected = (
		valueToRemove: any,
		currentValue: any,
		onChange: (value: any) => void,
	) => {
		if (!multiple) return;
		const newValue = Array.isArray(currentValue)
			? currentValue.filter((v) => v !== valueToRemove)
			: [];
		onChange(newValue);
	};

	const scrollPills = (direction: 'left' | 'right') => {
		if (!pillsRef.current) return;

		const scrollAmount = 200;
		const newPosition =
			direction === 'left'
				? Math.max(0, scrollPosition - scrollAmount)
				: scrollPosition + scrollAmount;

		pillsRef.current.scrollTo({
			left: newPosition,
			behavior: 'smooth',
		});
		setScrollPosition(newPosition);
	};

	const getSelectedOptions = (currentValue: any) => {
		if (!multiple || !currentValue) return [];

		const selectedValues = Array.isArray(currentValue)
			? currentValue
			: [currentValue];
		return options.filter((opt) =>
			selectedValues.includes(opt[objectValueKey]),
		);
	};

	// Sync query with form value for single select SOLO si no está escribiendo
	const syncQueryWithValue = useCallback(
		(value: any) => {
			if (isTyping) return; // <--- prevención!
			if (!multiple) {
				if (value && typeof value === 'object' && !Array.isArray(value)) {
					if (setQuery) setQuery(getDisplayValue(value as T));
					return;
				}

				if (value) {
					const selectedOption = options.find(
						(opt) => opt[objectValueKey] === value,
					);
					if (selectedOption) {
						if (setQuery) setQuery(getDisplayValue(selectedOption));
					}
				} else if (!preserveQueryOnClear && setQuery) {
					setQuery('');
				}
			}
		},
		[
			multiple,
			options,
			objectValueKey,
			getDisplayValue,
			setQuery,
			isTyping,
			preserveQueryOnClear,
		],
	);

	// Watch for form value changes to sync with query SOLO si no está escribiendo

	useEffect(() => {
		syncQueryWithValue(value);
	}, [value, syncQueryWithValue]);

	useEffect(() => {
		if (value) setPreserveQueryOnClear(false);
	}, [value]);

	const selectedOptions = getSelectedOptions(value);

	return (
		<div
			className={cn(
				'flex w-full flex-col gap-2',
				containerClassname,
				disabled && 'cursor-not-allowed',
			)}
			data-test={dataTest}
		>
			{label && (
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>
					{label}
					{required && <span className='text-red-500'> *</span>}
				</label>
			)}

			<div className='relative'>
				<input
					ref={inputRef}
					type='text'
					value={query}
					onChange={(e) => {
						if (disabled) return;
						const newValue = e.target.value;
						if (setQuery) setQuery(newValue);
						setIsOpen(true);
						setIsTyping(true);
						setPreserveQueryOnClear(false);
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							e.stopPropagation();
						}
					}}
					onFocus={(e) => {
						if (disabled) return;
						setIsOpen(true);
						setIsTyping(true);

						// Si ya hay un valor en el input, selecciona todo el texto
						if (e.target.value) {
							e.target.select();
						}
					}}
					onBlur={() => {
						setTimeout(() => setIsOpen(false), 200);
						setIsTyping(false);
					}}
					placeholder={placeholder}
					className={cn(
						'w-full',
						inputClassName,
						disabled && 'cursor-not-allowed bg-gray-100 dark:bg-gray-800',
					)}
					disabled={disabled}
				/>

				{/* Clear button for single select */}
				{!multiple && !loading && value && clearable && !disabled && (
					<button
						type='button'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onChange('');
							if (setQuery) setQuery('');
							setPreserveQueryOnClear(false);
							inputRef.current?.focus();
						}}
						className='absolute top-2.5 right-3 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300'
					>
						<X className='h-4 w-4' />
					</button>
				)}

				{loading && (
					<div className='absolute top-2.5 right-3'>
						<div className='h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900'></div>
					</div>
				)}
				{/* Selected pills */}

				{isOpen && !disabled && (
					<ul
						ref={scrollRef}
						onScroll={handleScroll}
						className={cn(
							'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-[#121c2c]',
							menuClassName,
						)}
					>
						{filteredOptions.length > 0 ? (
							filteredOptions.map((option) => {
								const isSelected = multiple
									? Array.isArray(value) &&
										value.includes(option[objectValueKey])
									: value === option[objectValueKey];

								return (
									<li
										key={String(option[objectValueKey])}
										role='option'
										tabIndex={0}
										aria-selected={isSelected}
										className={cn(
											'cursor-pointer px-4 py-2',
											isSelected
												? 'bg-blue-200 dark:bg-blue-600 dark:text-white'
												: 'hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white',
											optionClassName,
										)}
										onClick={() => handleSelect(option, value, onChange)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												handleSelect(option, value, onChange);
											}
										}}
										onMouseDown={() => handleSelect(option, value, onChange)} // <- garantiza tap
									>
										{renderOption
											? renderOption(option)
											: getDisplayValue(option)}
									</li>
								);
							})
						) : !!handleAddOption ? (
							<li
								key={'option-to-add'}
								role='option'
								tabIndex={0}
								className={cn(
									'cursor-pointer px-4 py-2 hover:bg-blue-100 hover:dark:bg-blue-600 hover:dark:text-white',

									optionClassName,
								)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleAddCustomOption();
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									handleAddCustomOption();
								}} // <- garantiza tap
							>
								Agregar {query}
							</li>
						) : (
							<li className='px-4 py-2 text-gray-500 dark:text-gray-400'>
								No hay opciones
							</li>
						)}
					</ul>
				)}
			</div>
			{multiple && selectedOptions.length > 0 && (
				<div className='relative mt-2'>
					{renderMultiplesValues ? (
						renderMultiplesValues(selectedOptions, (option: T) => {
							removeSelected(option[objectValueKey], value, onChange);
						})
					) : (
						<div className='flex items-center'>
							{scrollPosition > 0 && (
								<button
									type='button'
									onClick={() => scrollPills('left')}
									className='mr-1 p-1 text-gray-600 hover:text-gray-900'
								>
									<ChevronLeft className='h-5 w-5' />
								</button>
							)}

							<div
								ref={pillsRef}
								className='scrollbar-hide flex flex-1 space-x-2 overflow-x-hidden'
							>
								{selectedOptions.map((option) => (
									<div
										key={String(option[objectValueKey])}
										className={cn(
											'bg-primary flex shrink-0 items-center rounded-full px-3 py-1 text-sm text-white',
											pillsClassname,
										)}
									>
										<span className='max-w-xs truncate'>
											{getDisplayValue(option)}
										</span>
										<button
											type='button'
											onClick={(e) => {
												e.stopPropagation();
												removeSelected(option[objectValueKey], value, onChange);
											}}
											className='hover:bg-primary-dark ml-2 rounded-full p-0.5'
										>
											<X className='h-4 w-4' />
										</button>
									</div>
								))}
							</div>

							{pillsRef.current &&
								scrollPosition <
									pillsRef.current.scrollWidth -
										pillsRef.current.clientWidth && (
									<button
										type='button'
										onClick={() => scrollPills('right')}
										className='ml-1 p-1 text-gray-600 hover:text-gray-900'
									>
										<ChevronRight className='h-5 w-5' />
									</button>
								)}
						</div>
					)}
				</div>
			)}
			{error && <p className='mt-1 text-sm text-red-600'>{error.message}</p>}
		</div>
	);
}
