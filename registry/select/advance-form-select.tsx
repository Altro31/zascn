import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export interface SearchSelectProps<T = any> {
	name: string;
	label?: string;
	placeholder?: string;
	options: T[];
	objectValueKey: keyof T;
	objectKeyLabel?: keyof T;
	exclude?: string[];
	loading?: boolean;
	required?: boolean;
	multiple?: boolean;
	onChangeOptional?: (option?: T) => void;
	onScrollEnd?: () => void;
	renderOption?: (option: T) => React.ReactNode;
	dataTest?: string;
	containerClassname?: string;
	pillsClassname?: string;
	renderMultiplesValues?: (
		options: T[],
		removeSelected: (option: T) => void,
	) => React.ReactNode;
	query?: string;
	setQuery?: (q: string) => void;
	inputClassName?: string;
	disabled?: boolean;
}

export function AdvancedSearchSelect<T>({
	name,
	label,
	placeholder,
	options,
	objectValueKey,
	objectKeyLabel,
	loading,
	required,
	multiple = false,
	onChangeOptional,
	onScrollEnd,
	renderOption,
	dataTest,
	containerClassname,
	pillsClassname,
	inputClassName,
	renderMultiplesValues,
	query = '',
	setQuery,
	disabled = false,
}: SearchSelectProps<T>) {
	const { control } = useFormContext();
	const scrollRef = useRef<HTMLUListElement>(null);
	const pillsRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

	// Get display value for an option
	const getDisplayValue = useCallback(
		(option: T): string => {
			if (renderOption) {
				const rendered = renderOption(option);
				if (typeof rendered === 'string') {
					return rendered;
				}
			}
			console.log(name, objectKeyLabel, option);
			return String(
				objectKeyLabel ? option[objectKeyLabel] : option[objectValueKey],
			);
		},
		[objectKeyLabel, objectValueKey, renderOption],
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
		onChangeOptional?.(option);
	};

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
		onChangeOptional?.();
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
			if (!multiple && value) {
				const selectedOption = options.find(
					(opt) => opt[objectValueKey] === value,
				);
				if (selectedOption) {
					if (setQuery) setQuery(getDisplayValue(selectedOption));
				}
			} else if (!multiple && !value) {
				if (setQuery) setQuery('');
			}
		},
		[multiple, options, objectValueKey, getDisplayValue, setQuery, isTyping],
	);

	// Watch for form value changes to sync with query SOLO si no está escribiendo
	const { watch } = useFormContext();
	const watchedValue = watch(name);

	useEffect(() => {
		syncQueryWithValue(watchedValue);
	}, [watchedValue, syncQueryWithValue]);

	// When opening or options change, reset highlight
	useEffect(() => {
		if (isOpen && options.length > 0) {
			setHighlightedIndex(0);
		} else {
			setHighlightedIndex(-1);
		}
	}, [isOpen, options.length]);

	// Scroll highlighted item into view
	useEffect(() => {
		if (highlightedIndex < 0) return;
		const list = scrollRef.current;
		if (!list) return;
		const el = list.children[highlightedIndex] as HTMLElement | undefined;
		if (el && typeof el.scrollIntoView === 'function') {
			el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
		}
	}, [highlightedIndex]);

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required }}
			render={({ field, fieldState: { error } }) => {
				const selectedOptions = getSelectedOptions(field.value);

				return (
					<div
						className={cn('w-full', containerClassname)}
						data-test={dataTest}
					>
						{label && (
							<label className='mb-[13px] block text-sm font-medium text-gray-700 dark:text-gray-200'>
								{label}
								{required && <span className='text-red-500'> *</span>}
							</label>
						)}

						<div className='relative'>
							<input
								type='text'
								value={query}
								disabled={disabled}
								onChange={(e) => {
									const newValue = e.target.value;
									if (setQuery) setQuery(newValue);
									setIsOpen(true);
									setIsTyping(true); // <---- ahora está escribiendo!
									onChangeOptional?.();
								}}
								onFocus={() => {
									setIsOpen(true);
									setIsTyping(true);
								}}
								onBlur={() => {
									setTimeout(() => setIsOpen(false), 200);
									setIsTyping(false); // <---- ya no está escribiendo!
								}}
								onKeyDown={(e) => {
									if (!isOpen) {
										if (e.key === 'ArrowDown') {
											setIsOpen(true);
											e.preventDefault();
										}
										return;
									}

									if (e.key === 'ArrowDown') {
										e.preventDefault();
										setHighlightedIndex((prev) =>
											Math.min(prev + 1, options.length - 1),
										);
									} else if (e.key === 'ArrowUp') {
										e.preventDefault();
										setHighlightedIndex((prev) => Math.max(prev - 1, 0));
									} else if (e.key === 'Enter') {
										// Prevent form submit when selecting
										if (
											highlightedIndex >= 0 &&
											highlightedIndex < options.length
										) {
											e.preventDefault();
											const opt = options[highlightedIndex];
											handleSelect(opt, field.value, field.onChange);
										}
									} else if (e.key === 'Escape') {
										setIsOpen(false);
										setIsTyping(false);
										setHighlightedIndex(-1);
									}
								}}
								placeholder={placeholder}
								className={cn('form-input w-full', inputClassName)}
							/>

							{loading && (
								<div className='absolute top-2.5 right-3'>
									<div className='h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900'></div>
								</div>
							)}
							{/* Selected pills */}

							{isOpen && (
								<ul
									ref={scrollRef}
									onScroll={handleScroll}
									className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-[#121c2c]'
								>
									{loading ? (
										<li className='px-4 py-2 text-gray-500 dark:text-gray-400'>
											Cargando...
										</li>
									) : filteredOptions.length > 0 ? (
										filteredOptions.map((option, idx) => {
											const isSelected = multiple
												? Array.isArray(field.value) &&
													field.value.includes(option[objectValueKey])
												: field.value === option[objectValueKey];
											const isHighlighted = idx === highlightedIndex;
											console.log('[OPTIONS]', {
												option,
												objectValueKey,
												isSelected,
												isHighlighted,
											});
											return (
												<li
													key={String(option[objectValueKey])}
													onMouseEnter={() => setHighlightedIndex(idx)}
													className={`cursor-pointer px-4 py-2 ${isSelected ? 'bg-blue-100 dark:bg-blue-600 dark:text-white' : 'form-input hover:bg-blue-100 dark:hover:bg-blue-600 dark:hover:text-white'} ${isHighlighted ? 'bg-blue-200 dark:bg-blue-700' : ''}`}
													onClick={() =>
														handleSelect(option, field.value, field.onChange)
													}
												>
													{renderOption
														? renderOption(option)
														: getDisplayValue(option)}
													{isSelected && <span className='float-right'>✓</span>}
												</li>
											);
										})
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
										removeSelected(
											option[objectValueKey],
											field.value,
											field.onChange,
										);
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
															removeSelected(
																option[objectValueKey],
																field.value,
																field.onChange,
															);
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
						{error && (
							<p className='mt-1 text-sm text-red-600'>{error.message}</p>
						)}
					</div>
				);
			}}
		/>
	);
}
