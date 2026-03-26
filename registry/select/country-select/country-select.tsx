'use client';
import { Country } from '@/types/countries';
import { useCombobox } from 'downshift';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CountryFlag from './country-flag';
import { filterCountriesByOption } from './utils';
import { clsx } from 'clsx';

interface CountriesComboboxProps {
	countries: Country[];
	selectedCountry: Country | null;
	onSelect: (country: Country) => void;
	buttonClassName?: string;
	listClassName?: string;
	searchPlaceholder?: string;
	disabled?: boolean;
	classNames?: {
		container?: string;
		input?: string;
		menu?: string;
		item?: string;
	};
	isLoading?: boolean;
	optionLabel?: keyof Country;
	/**
	 * When true, the input will size to the selected content (or current input)
	 * instead of the default behavior. Defaults to false to preserve styling.
	 */
	fitToSelected?: boolean;
}

export const CountrySelect: React.FC<CountriesComboboxProps> = ({
	countries,
	selectedCountry,
	onSelect,
	listClassName = '',
	disabled,
	classNames,
	isLoading,
	optionLabel = 'name',
	fitToSelected = false,
}) => {
	// Normalize the countries prop defensively so useCombobox always receives an array
	const needAddPlusToOptionLabel =
		optionLabel === 'phoneNumberCode' ? '+ ' : '';
	const normalizedCountries = useMemo<Country[]>(() => {
		const onlyActive = (list: (Country | null | undefined)[]) =>
			(list || [])
				.filter(Boolean)
				.filter((c) => (c as Country).active === true) as Country[];

		if (Array.isArray(countries)) {
			return onlyActive(countries);
		}
		if (countries && typeof countries === 'object') {
			try {
				const values = Object.values(
					countries as unknown as Record<string, Country | null | undefined>,
				);
				return onlyActive(values);
			} catch {
				return [];
			}
		}
		return [];
	}, [countries]);

	const [items, setItems] = useState<Country[]>(normalizedCountries);

	// Update local items when prop changes (after normalization)
	useEffect(() => {
		setItems(normalizedCountries);
	}, [normalizedCountries]);

	const initialInputValue = useMemo(
		() =>
			selectedCountry
				? `${needAddPlusToOptionLabel}${selectedCountry[optionLabel]}`
				: '',
		[selectedCountry, optionLabel],
	);

	const selectedText = useMemo(
		() =>
			selectedCountry
				? `${needAddPlusToOptionLabel}${selectedCountry[optionLabel]}`
				: '',
		[selectedCountry, optionLabel],
	);

	const {
		isOpen,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		selectedItem,
		inputValue,
	} = useCombobox<Country>({
		// Always provide an array (even if empty) to avoid runtime prop type warnings
		items: Array.isArray(items) ? items : [],
		selectedItem: selectedCountry || null,
		itemToString: (item) =>
			item ? `${needAddPlusToOptionLabel}${item[optionLabel]}` : '',
		initialInputValue,
		onInputValueChange({ inputValue }) {
			const value = inputValue?.replace(/^\+/, '') || '';
			const items = filterCountriesByOption(
				value,
				normalizedCountries,
				optionLabel,
			);

			if (value && selectedItem && items.length === 1) {
				setItems(normalizedCountries);
			} else {
				setItems(
					filterCountriesByOption(value, normalizedCountries, optionLabel),
				);
			}
		},
		onSelectedItemChange({ selectedItem }) {
			if (selectedItem) onSelect(selectedItem);
		},
	});

	// Ref to the input for programmatic selection
	const inputRef = useRef<HTMLInputElement | null>(null);

	const hasData = items.length > 0;
	const placeholder = isLoading
		? 'Cargando países...'
		: !hasData
			? 'No hay países'
			: 'Seleccione un país';
	return (
		<div className={clsx('relative', classNames?.container)}>
			<div className='gap-0.5 bg-transparent'>
				<div className='relative'>
					<input
						{...getInputProps({
							ref: inputRef,
							disabled: disabled,
							onFocus: (e) => {
								setTimeout(() => {
									try {
										e.target.select();
									} catch {}
								}, 0);
							},
							onClick: (e) => {
								if (inputRef.current === document.activeElement) {
									e.currentTarget.select();
								}
							},
							onMouseUp: (e) => {
								e.preventDefault();
							},
						})}
						className={clsx(
							'focus:ring-primary/20 z-10 w-full border border-gray-300 text-sm font-medium focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-[#0f172a] dark:text-gray-100 dark:placeholder:text-gray-400',

							classNames?.input ?? 'form-input',
						)}
						maxLength={optionLabel === 'phoneNumberCode' ? 5 : undefined}
						placeholder={fitToSelected ? '' : placeholder}
						// Use the size attribute to fit content length when requested
						size={
							fitToSelected
								? Math.max(2, (inputValue || selectedText).length)
								: undefined
						}
						style={{
							paddingLeft: 40,
							...(fitToSelected
								? { width: 'auto', minWidth: 0 }
								: { width: '100%' }),
						}}
					/>
					<div className='absolute top-1/2 left-2 flex -translate-y-1/2'>
						{inputValue.length > 0 ? (
							<CountryFlag
								country={countries.find((c) => c.code == selectedCountry?.code)}
							/>
						) : (
							<div className='h-5 w-6 animate-pulse rounded-sm bg-gray-400'></div>
						)}
					</div>
				</div>
			</div>
			<ul
				{...getMenuProps({
					className: clsx(
						'absolute left-0 z-20 mt-1 max-h-80 w-full overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-gray-600 dark:bg-[#0f172a]',
						!isOpen && 'hidden',
						listClassName,
						classNames?.menu,
					),
				})}
			>
				{isLoading && (
					<li className='px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>
						Cargando...
					</li>
				)}
				{isOpen &&
					items.map((item, index) => (
						<li
							key={item.id}
							{...getItemProps({ item, index })}
							className={clsx(
								'flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 dark:text-gray-200',
								highlightedIndex === index &&
									'bg-blue-100 dark:bg-blue-600 dark:text-white',
								(selectedItem?.id === item.id ||
									selectedCountry?.id === item.id) &&
									'bg-blue-50 font-semibold dark:bg-blue-700/60 dark:text-white',
								classNames?.item,
							)}
						>
							<CountryFlag country={item} />
							<span className='text-xs text-gray-500 dark:text-gray-300'>
								{item[optionLabel]}
							</span>
						</li>
					))}
				{isOpen && items.length === 0 && (
					<li className='px-3 py-2 text-sm text-gray-500 dark:text-gray-400'>
						Sin resultados
					</li>
				)}
			</ul>
		</div>
	);
};

export default CountrySelect;
