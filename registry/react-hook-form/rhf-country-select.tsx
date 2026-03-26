'use client';
import { cn } from '@/lib/utils';
import { Country } from '@/types/countries';
import { Controller, useFormContext } from 'react-hook-form';
import CountrySelect from '../select/country-select/country-select';
import useCountries from '../phone-input/use-countries';

// ----------------------------------------------------------------------

export interface RHFCountrySelectProps {
	name: string; // field name in RHF form
	valueKey?: keyof Country; // which property to store (default: code)
	label?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string; // container
	listClassName?: string; // dropdown list styling passthrough
	onCountryChange?: (country: Country) => void;
	underLabel?: string;
	showError?: boolean;
}

/**
 * RHFCountrySelect
 * Enlaza el CountrySelect (Downshift) con react-hook-form almacenando solo el valor indicado por valueKey (por defecto el código del país).
 * Inspirado en el country-phone input pero sin lógica de IP o prefijos telefónicos.
 */
export default function RHFCountrySelect({
	name,
	valueKey = 'code',
	label,
	required,
	disabled,
	className,
	listClassName,
	onCountryChange,
	underLabel,
	showError = true,
}: RHFCountrySelectProps) {
	const { control } = useFormContext();
	const { countries, isLoading } = useCountries();
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value, onChange }, fieldState: { error } }) => {
				// Encontrar el país seleccionado a partir del valor almacenado
				const selectedCountry = value
					? countries.find(
							(c) =>
								(c as any)[valueKey]?.toString().toLowerCase() ===
								value?.toString().toLowerCase(),
						) || null
					: null;

				const handleSelect = (country: Country) => {
					onChange((country as any)[valueKey]);
					onCountryChange?.(country);
				};

				return (
					<div className={cn('flex w-full flex-col gap-1', className)}>
						{label && (
							<label className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
								{label} {required && <span className='text-red-500'>*</span>}
							</label>
						)}
						{underLabel && (
							<p className='mb-1 text-xs text-gray-500'>{underLabel}</p>
						)}
						<CountrySelect
							countries={countries}
							selectedCountry={selectedCountry}
							onSelect={handleSelect}
							disabled={disabled || isLoading}
							listClassName={listClassName}
						/>
						{showError && error?.message && (
							<p className='mt-1 text-xs text-red-500'>{error.message}</p>
						)}
					</div>
				);
			}}
		/>
	);
}
