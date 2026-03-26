'use client';
import IconPlus from '@/components/icon/icon-plus';
import { cn } from '@/lib/utils';
import { Country } from '@/types/countries';
import { useCombobox } from 'downshift';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { filterCountriesByPhoneCode } from '../utils';
import CountryFlag from './country-flag';

interface CountriesComboboxProps {
	countries: Country[];
	selectedCountry: Country | null;
	onSelect: (country: Country) => void;
	buttonClassName?: string;
	listClassName?: string;
	searchPlaceholder?: string;
	disabled?: boolean;
}

export const CountriesCombobox: React.FC<CountriesComboboxProps> = ({
	countries,
	selectedCountry,
	onSelect,
	listClassName = '',
	disabled,
}) => {
	const [items, setItems] = useState<Country[]>(countries);

	useEffect(() => {
		setItems(countries);
	}, [countries]);

	const initialInputValue = useMemo(
		() => (selectedCountry ? `${selectedCountry.phoneNumberCode}` : ''),
		[selectedCountry],
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
		items,

		selectedItem: selectedCountry || null,
		itemToString: (item) => (item ? `${item.phoneNumberCode}` : ''),
		initialInputValue,
		onInputValueChange({ inputValue }) {
			const value = inputValue?.replace(/^\+/, '') || '';
			setItems(filterCountriesByPhoneCode(value, countries));
		},
		onSelectedItemChange({ selectedItem }) {
			if (selectedItem) onSelect(selectedItem);
		},
	});

	// Ref to the input for programmatic selection
	const inputRef = useRef<HTMLInputElement | null>(null);

	return (
		<div className='relative'>
			<div className='flex gap-0.5 bg-white shadow-sm dark:bg-black'>
				<div className='relative'>
					<input
						{...getInputProps({
							ref: inputRef,
							disabled,
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
						className='form-input focus:ring-primary/20 z-10 inline-flex w-auto max-w-32 shrink-0 rounded-r-none border border-gray-300 pl-12 text-sm font-medium focus:ring-2 focus:outline-none'
						style={{ paddingLeft: 56 }}
						maxLength={4}
					/>
					<div className='absolute top-1/2 left-2 flex -translate-y-1/2'>
						{inputValue.length > 0 ? (
							<CountryFlag country={selectedCountry} />
						) : (
							<div className='h-5 w-6 animate-pulse rounded-sm bg-gray-400'></div>
						)}
					</div>
					<div className='absolute top-1/2 left-9 flex -translate-y-1/2'>
						<IconPlus className='h-3 w-3' />
					</div>
				</div>
			</div>
			<ul
				{...getMenuProps({
					className: cn(
						'absolute left-0 mt-1 w-72 bg-white shadow-md max-h-80 overflow-auto z-20 rounded-md border border-gray-200 p-1',
						!isOpen && 'hidden',
						listClassName,
					),
				})}
			>
				{isOpen &&
					items.map((item, index) => (
						<li
							key={item.id}
							{...getItemProps({ item, index })}
							className={cn(
								'flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm',
								highlightedIndex === index && 'bg-blue-100',
								(selectedItem?.id === item.id ||
									selectedCountry?.id === item.id) &&
									'bg-blue-50 font-semibold',
							)}
						>
							<CountryFlag country={item} />
							<span className='text-gray-900'>+{item.phoneNumberCode}</span>
							<span className='text-xs text-gray-500'>{item.name}</span>
						</li>
					))}
				{isOpen && items.length === 0 && (
					<li className='px-3 py-2 text-sm text-gray-500'>Sin resultados</li>
				)}
			</ul>
		</div>
	);
};

export default CountriesCombobox;
