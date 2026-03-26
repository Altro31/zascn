'use client';
import { cn } from '@/lib/utils';
import { Country } from '@/types/countries';
import CountrySelect from './country-select';
import useCountries from '@/components/phone-input/use-countries';
import { useEffect, useMemo } from 'react';
import clsx from 'clsx';

// ----------------------------------------------------------------------

export interface RHFCountrySelectProps {
	label?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	listClassName?: string;
	underLabel?: string;
	showError?: boolean;
	selectClassNames?: {
		container?: string;
		input?: string;
		menu?: string;
		item?: string;
	};
	labelClassName?: string;
	/** Controlled value by Country object */
	valueCountry?: Country | null;
	/** Controlled value by country id */
	valueId?: string;
	/** Controlled value by country code (ISO alpha-2) */
	valueCode?: string;
	/** Fallback legacy prop: still supported */
	value?: Country | null;
	onChange: (country: Country) => void;
	defaultValueId?: string;
	defaultValueCode?: string;
	excludedCountries?: string[];
	includedCountries?: string[];
	optionLabel?: keyof Country;
	widthFull?: boolean;
	/** Make the selector width fit its selected content */
	fitToSelected?: boolean;
	prefetchCountries?: Country[];
}

export default function CountrySelectFetcher({
	label,
	required,
	disabled,
	className,
	listClassName,
	underLabel,
	selectClassNames,
	labelClassName,
	valueCountry,
	valueId,
	valueCode,
	value,
	onChange,
	defaultValueId,
	defaultValueCode,
	excludedCountries,
	includedCountries,
	optionLabel,
	widthFull = false,
	fitToSelected,
	prefetchCountries,
}: RHFCountrySelectProps) {
	const hasPrefetchCountries = Boolean(
		prefetchCountries && prefetchCountries.length > 0,
	);
	const {
		countries: fetchCountries = [],
		isLoading,
		isFetching,
		error,
	} = useCountries({
		enabled: hasPrefetchCountries,
	});
	const data = useMemo(() => {
		return hasPrefetchCountries ? prefetchCountries : fetchCountries;
	}, [prefetchCountries, fetchCountries]);
	// Normalize code lists to stable, uppercase, unique, sorted arrays
	const normalizeCodes = (arr?: string[]) => {
		if (!arr || arr.length === 0) return [] as string[];
		const norm = Array.from(
			new Set(arr.map((c) => (c || '').toString().toUpperCase())),
		);
		norm.sort();
		return norm;
	};
	const excludedCodes = useMemo(
		() => normalizeCodes(excludedCountries),
		[excludedCountries],
	);
	const includedCodes = useMemo(
		() => normalizeCodes(includedCountries),
		[includedCountries],
	);
	const excludedKey = useMemo(() => excludedCodes.join('|'), [excludedCodes]);
	const includedKey = useMemo(() => includedCodes.join('|'), [includedCodes]);

	const countries = useMemo(() => {
		const list = data || [];
		if (list.length === 0) return list;
		const hasExcluded = excludedCodes.length > 0;
		const hasIncluded = includedCodes.length > 0;
		if (!hasExcluded && !hasIncluded) return list;
		return list.filter((country) => {
			const code = (country.code || '').toString().toUpperCase();
			if (hasExcluded && excludedCodes.includes(code)) return false;
			if (hasIncluded && !includedCodes.includes(code)) return false;
			return true;
		});
	}, [data, excludedKey, includedKey]);

	const findCountryBy = (opts: {
		id?: string | null;
		code?: string | null;
	}) => {
		const { id, code } = opts;
		console.groupCollapsed('[CountrySelectFetcher] findCountryBy');
		console.log('opts:', { id, code });
		console.log('countries length:', countries?.length ?? 0);

		if (!countries || countries.length === 0) {
			console.log('No countries available');
			console.groupEnd();
			return null;
		}

		if (id) {
			const byId = countries.find((c) => c.id === id) ?? null;
			console.log('search by id:', id, 'found:', !!byId);
			if (byId) {
				console.log('match by id:', byId);
				console.groupEnd();
				return byId;
			}
		}

		if (code) {
			const byCode = countries.find((c) => c.code === code) ?? null;
			console.log('search by code:', code, 'found:', !!byCode);
			if (byCode) {
				console.log('match by code:', byCode);
				console.groupEnd();
				return byCode;
			}
		}

		console.log('No match found');
		console.groupEnd();
		return null;
	};

	// Consolidated selected country resolution: priority -> valueCountry | value | valueId | valueCode | defaultId | defaultCode
	const selectedCountry = useMemo(() => {
	
		return (
			valueCountry ??
			value ??
			findCountryBy({ id: valueId, code: valueCode }) ??
			findCountryBy({ id: defaultValueId, code: defaultValueCode }) ??
			null
		);
	}, [
		valueCountry,
		value,
		valueId,
		valueCode,
		countries,
		defaultValueId,
		defaultValueCode,
	]);

	// Only fire default selection once when nothing is controlled
	useEffect(() => {
	
		
		if (!valueCountry && !value && !valueId && !valueCode) {
			const defaultCountry = findCountryBy({
				id: defaultValueId,
				code: defaultValueCode,
			});
			if (defaultCountry) onChange(defaultCountry);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [countries, defaultValueId, defaultValueCode]);

	return (
		<div className={clsx('flex flex-col', className, widthFull && 'w-full')}>
			{label && (
				<label
					className={cn(
						'mb-[13px] block text-sm font-medium text-gray-700 dark:text-gray-200',
						labelClassName,
					)}
				>
					{label} {required && <span className='text-red-500'>*</span>}
				</label>
			)}
			{underLabel && <p className='mb-1 text-xs text-gray-500'>{underLabel}</p>}
			<CountrySelect
				countries={countries}
				selectedCountry={selectedCountry}
				onSelect={onChange}
				disabled={disabled}
				isLoading={hasPrefetchCountries ? false : isLoading || isFetching}
				listClassName={listClassName}
				classNames={selectClassNames}
				optionLabel={optionLabel}
				fitToSelected={fitToSelected}
			/>
			{typeof error == 'string' && (
				<p className='mt-1 text-xs text-red-500'>{error}</p>
			)}
		</div>
	);
}
