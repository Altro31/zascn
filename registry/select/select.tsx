import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SearchSelectProps<T = any> {
	name?: string;
	label?: string;
	placeholder?: string;
	options: T[];
	objectValueKey: keyof T;
	objectKeyLabel?: keyof T;
	exclude?: string[];
	loading?: boolean;
	required?: boolean;
	multiple?: boolean;
	onChangeOptional?: () => void;
	onScrollEnd?: () => void;
	renderOption?: (option: T) => React.ReactNode;
	optionDisabled?: (option: T) => boolean; // determina si una opción está deshabilitada
	dataTest?: string;
	containerClassname?: string;
	pillsClassname?: string;
	renderMultiplesValues?: (
		options: T[],
		removeSelected: (option: T) => void,
	) => React.ReactNode;
}

interface SelectProps<T> extends SearchSelectProps<T> {
	inputRef?: React.RefObject<HTMLInputElement>;
	label?: string;
	placeholder?: string;
	options: T[];
	objectValueKey: keyof T;
	objectKeyLabel?: keyof T;
	exclude?: string[];
	loading?: boolean;
	required?: boolean;
	multiple?: boolean;
	value?: T[keyof T] | T[keyof T][];
	onChange?: (value: T[keyof T] | T[keyof T][]) => void;
	onChangeOptional?: () => void;
	onScrollEnd?: () => void;
	renderOption?: (option: T) => React.ReactNode;
	optionDisabled?: (option: T) => boolean;
	dataTest?: string;
	containerClassname?: string;
	pillsClassname?: string;
	inputClassname?: string;
	renderMultiplesValues?: (
		options: T[],
		removeSelected: (option: T) => void,
	) => React.ReactNode;
	error?: { message?: string };
	disabled?: boolean;
	displayValue?: (option: T) => string;
	inputClassName?: string;
	query: string;
	setQuery: (query: string) => void;
}

export function Select<T>({
	label,
	placeholder,
	options,
	objectValueKey,
	objectKeyLabel,
	exclude,
	loading,
	required,
	multiple = false,
	value,
	onChange,
	onChangeOptional,
	onScrollEnd,
	renderOption,
	optionDisabled,
	dataTest,
	containerClassname,
	pillsClassname,
	renderMultiplesValues,
	error,
	disabled,
	inputClassname,
	inputRef,
	displayValue,
	query,
	setQuery,
}: SelectProps<T>) {
	const scrollRef = useRef<HTMLUListElement>(null);
	const pillsRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [scrollPosition, setScrollPosition] = useState(0);
	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	// Flag para evitar que la sincronización automática reemplace lo que escribe el usuario
	const [isTyping, setIsTyping] = useState(false);

	// Utilidad para escapar regex
	const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	// Resalta coincidencias del query en un texto
	const highlightMatch = (text: string) => {
		if (!query.trim()) return text;
		try {
			const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig');
			return text.split(regex).map((part, i) =>
				regex.test(part) ? (
					<mark
						key={i}
						className='rounded-sm bg-yellow-200 p-0 text-inherit'
					>
						{part}
					</mark>
				) : (
					<React.Fragment key={i}>{part}</React.Fragment>
				),
			);
		} catch {
			return text; // fallback en caso de error regex
		}
	};

	// Get keyLabel value for an option (for filtering/search)
	const getKeyLabelValue = useCallback(
		(option: T): string => {
			return String(
				objectKeyLabel ? option[objectKeyLabel] : option[objectValueKey],
			);
		},
		[objectKeyLabel, objectValueKey],
	);
	// Get display value for an option (for input display)
	const getDisplayValue = useCallback(
		(option: T): string => {
			if (displayValue) {
				return displayValue(option);
			}
			if (renderOption) {
				const rendered = renderOption(option);
				if (typeof rendered === 'string') {
					return rendered;
				}
			}
			return getKeyLabelValue(option);
		},
		[displayValue, renderOption, getKeyLabelValue],
	);

	// Filter options based on exclude and query
	const filteredOptions = (() => {
		const baseOptions = options.filter(
			(opt) => !exclude?.includes(String(opt[objectValueKey])),
		);
		// Detecta si el select simple ya tiene un valor seleccionado y el input solo muestra ese valor (no se está buscando activamente)
		let effectiveQuery = query;
		if (!multiple && value) {
			const selectedOption = options.find(
				(opt) => opt[objectValueKey] === value,
			);
			if (
				selectedOption &&
				query.trim() !== '' &&
				query === getDisplayValue(selectedOption)
			) {
				// Mostrar todas las opciones si el texto coincide exactamente con el seleccionado (estado "reposo")
				effectiveQuery = '';
			}
		}
		if (effectiveQuery.trim() === '') {
			return baseOptions;
		}
		const lowered = effectiveQuery.toLowerCase();
		return baseOptions.filter((opt) =>
			getKeyLabelValue(opt).toLowerCase().includes(lowered),
		);
	})();
	const handleScroll = () => {
		if (!scrollRef.current || !onScrollEnd) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
		if (scrollTop + clientHeight >= scrollHeight * 0.9) {
			onScrollEnd();
		}
	};

	const handleSelect = (option: T) => {
		const selectedValue = option[objectValueKey];

		if (multiple) {
			const currentArray = Array.isArray(value) ? value : [];
			const newValue = currentArray.includes(selectedValue)
				? currentArray.filter((v) => v !== selectedValue)
				: [...currentArray, selectedValue];
			onChange?.(newValue);
			setQuery('');
		} else {
			onChange?.(selectedValue);
			setQuery(getDisplayValue(option));
			setIsTyping(false); // terminamos interacción de escritura
			// Cerramos el dropdown en el próximo frame para permitir que React procese el cambio de valor primero
			requestAnimationFrame(() => {
				setIsOpen(false);
			});
		}
		onChangeOptional?.();
	};

	const removeSelected = (valueToRemove: any) => {
		if (!multiple) return;

		const newValue = Array.isArray(value)
			? value.filter((v) => v !== valueToRemove)
			: [];
		onChange?.(newValue);
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

	const getSelectedOptions = () => {
		if (!multiple || !value) return [];

		const selectedValues = Array.isArray(value) ? value : [value];
		return options.filter((opt) =>
			selectedValues.includes(opt[objectValueKey]),
		);
	};

	// Sync query with value for single select
	const syncQueryWithValue = useCallback(
		(currentValue: any) => {
			if (isTyping) return; // mientras escribe no tocamos
			if (!multiple) {
				// Requisito: no reemplazar el texto del input con el seleccionado.
				// Sólo limpiamos si NO hay selección.
				if (!currentValue) setQuery('');
				return;
			}
			// Para multiple no se cambiaba antes, así que igual.
		},
		[multiple, setQuery, isTyping],
	);

	// Watch for value changes to sync with query
	useEffect(() => {
		syncQueryWithValue(value);
	}, [value, syncQueryWithValue]);

	// Auto-scroll: asegura que la opción enfocada sea visible al navegar con flechas
	useEffect(() => {
		if (!isOpen) return;
		if (focusedIndex < 0) return;
		const list = scrollRef.current;
		if (!list) return;
		const item = list.children[focusedIndex] as HTMLElement | undefined;
		if (!item) return;
		const itemTop = item.offsetTop;
		const itemBottom = itemTop + item.offsetHeight;
		const viewTop = list.scrollTop;
		const viewBottom = viewTop + list.clientHeight;
		const padding = 4; // pequeño margen
		if (itemTop < viewTop) {
			list.scrollTo({ top: Math.max(0, itemTop - padding) });
		} else if (itemBottom > viewBottom) {
			list.scrollTo({ top: itemBottom - list.clientHeight + padding });
		}
	}, [focusedIndex, isOpen]);

	const selectedOptions = getSelectedOptions();

	return (
		<div
			className={cn('w-full', containerClassname)}
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
					type='text'
					value={query}
					onChange={(e) => {
						const newValue = e.target.value;
						setQuery(newValue);
						setIsOpen(true);
						setIsTyping(true);
						onChangeOptional?.();
					}}
					disabled={disabled}
					onFocus={() => {
						setIsOpen(true);
						if (!multiple && value) {
							// Selecciona el texto actual en vez de limpiar
							requestAnimationFrame(() => {
								inputRef?.current?.select();
							});
						}
						setIsTyping(true);
					}}
					onBlur={() => {
						setTimeout(() => {
							setIsOpen(false);
							setIsTyping(false);
							syncQueryWithValue(value);
						}, 200);
					}}
					placeholder={placeholder}
					/**
					 * Componente Select genérico para seleccionar una o varias opciones.
					 * Permite búsqueda, renderizado personalizado y manejo de múltiples valores.
					 * @template T Tipo de las opciones.
					 * @param {SelectProps<T>} props Props del componente.
					 * @returns {JSX.Element} Elemento JSX del select.
					 */
					className={cn(
						'form-input h-12 w-full rounded-xl border-2 border-slate-200 focus:border-blue-500',
						inputClassname,
					)}
					ref={inputRef}
					onKeyDown={(e) => {
						if (e.key === 'ArrowDown') {
							e.preventDefault();
							if (!isOpen) {
								setIsOpen(true);
								// primer índice habilitado
								const first = filteredOptions.findIndex(
									(o) => !(optionDisabled?.(o) ?? false),
								);
								setFocusedIndex(first === -1 ? 0 : first);
							} else {
								setFocusedIndex((prev) => {
									let next = prev;
									for (let i = 0; i < filteredOptions.length; i++) {
										next = (next + 1) % filteredOptions.length;
										if (!(optionDisabled?.(filteredOptions[next]) ?? false))
											break;
									}
									return next;
								});
							}
						} else if (e.key === 'ArrowUp') {
							e.preventDefault();
							if (!isOpen) {
								setIsOpen(true);
								// último habilitado
								for (let i = filteredOptions.length - 1; i >= 0; i--) {
									if (!(optionDisabled?.(filteredOptions[i]) ?? false)) {
										setFocusedIndex(i);
										break;
									}
								}
							} else {
								setFocusedIndex((prev) => {
									let next = prev;
									for (let i = 0; i < filteredOptions.length; i++) {
										next =
											(next - 1 + filteredOptions.length) %
											filteredOptions.length;
										if (!(optionDisabled?.(filteredOptions[next]) ?? false))
											break;
									}
									return next;
								});
							}
						} else if (e.key === 'Enter') {
							if (!isOpen) {
								setIsOpen(true);
								setFocusedIndex(0);
								// Opcional: seleccionar todo el texto del input
								e.currentTarget.select?.();
								return;
							}
							if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
								e.preventDefault();
								const opt = filteredOptions[focusedIndex];
								if (!(optionDisabled?.(opt) ?? false)) {
									handleSelect(opt);
								}
								// Mueve el foco al siguiente elemento del formulario
								// Mueve el foco al siguiente input/textarea/select en el DOM
								const focusable = Array.from(
									document.querySelectorAll('input, textarea, select, button'),
								).filter(
									(el) =>
										!el.hasAttribute('disabled') &&
										(el as HTMLElement).tabIndex !== -1,
								) as HTMLElement[];
								const idx = focusable.indexOf(e.currentTarget);
								if (idx >= 0 && idx < focusable.length - 1) {
									focusable[idx + 1]?.focus();
								}
							}
						} else if (e.key === 'Escape') {
							setIsOpen(false);
							syncQueryWithValue(value);
						} else if (
							e.key === 'Backspace' &&
							!multiple &&
							query === '' &&
							value
						) {
							// Borrar selección explícitamente cuando el usuario presiona Backspace con input vacío
							onChange?.(undefined as unknown as T[keyof T]);
							setFocusedIndex(-1);
							setIsOpen(false);
							setIsTyping(true); // podrá escribir nuevo texto
						}
					}}
				/>

				{/* Botón para limpiar selección en modo single */}
				{!multiple && (value || query) && query !== '' && (
					<button
						type='button'
						className='absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700'
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => {
							setQuery('');
							onChange?.(undefined as unknown as T[keyof T]);
							setIsOpen(true);
							setFocusedIndex(-1);
							inputRef?.current?.focus();
							setIsTyping(true);
						}}
					>
						<X className='h-4 w-4' />
					</button>
				)}

				{loading && (
					<div className='absolute top-1/2 right-3 -translate-y-1/2'>
						<Spinner />
					</div>
				)}

				{isOpen && (filteredOptions.length > 0 || !value) && (
					<ul
						ref={scrollRef}
						onScroll={handleScroll}
						className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-[#121c2c]'
					>
						{filteredOptions.length > 0 &&
							filteredOptions.map((option, idx) => {
								const isSelected = multiple
									? Array.isArray(value) &&
										value.includes(option[objectValueKey])
									: value === option[objectValueKey];
								const disabledOpt = optionDisabled?.(option) ?? false;

								return (
									<li
										key={String(option[objectValueKey])}
										className={cn(
											'ultra-thin-scrollbar px-4 py-2 select-none',
											disabledOpt
												? 'cursor-not-allowed opacity-50'
												: 'cursor-pointer',
											isSelected
												? 'bg-blue-100 ...'
												: !disabledOpt && 'hover:bg-blue-100 ...',
											focusedIndex === idx && !disabledOpt
												? 'bg-blue-300 dark:bg-blue-700'
												: '',
										)}
										onMouseEnter={() => setFocusedIndex(idx)}
										onClick={() => {
											if (!disabledOpt) handleSelect(option);
										}}
										onMouseDown={() => {
											if (!disabledOpt) handleSelect(option);
										}}
										data-disabled={disabledOpt || undefined}
									>
										{renderOption
											? renderOption(option)
											: highlightMatch(getDisplayValue(option))}
										{disabledOpt && (
											<span className='ml-2 text-xs font-medium text-red-500'>
												Agotado
											</span>
										)}
									</li>
								);
							})}
						{filteredOptions.length === 0 && loading && (
							<li className='flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400'>
								<Spinner />
								Cargando...
							</li>
						)}
						{filteredOptions.length === 0 &&
							!loading &&
							(!value ? (
								<li className='px-4 py-2 text-gray-500 dark:text-gray-400'>
									No hay opciones
								</li>
							) : null)}
					</ul>
				)}
			</div>

			{multiple && selectedOptions.length > 0 && (
				<div className='relative mt-2'>
					{renderMultiplesValues ? (
						renderMultiplesValues(selectedOptions, (option: T) => {
							removeSelected(option[objectValueKey]);
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
												removeSelected(option[objectValueKey]);
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
