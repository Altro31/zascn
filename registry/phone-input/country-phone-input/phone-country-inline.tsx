import { useEffect, useState } from 'react';
import CountriesCombobox from './country-combobox';
import PhoneNumberInput from './phone-number-input';
import useCountries from '../use-countries';
import { Country } from '@/types/countries';
import { useMyIp } from '../use-myip';
import clsx from 'clsx';

export interface PhoneCountryInlineProps {
	value?: string;
	countryCode?: string;
	disabled?: boolean;
	onChange?: (data: { number: string; country: Country }) => void;
	onValidChange?: (valid: boolean) => void;
	showSuccess?: boolean;
	error?: string;
	containerClassname?: string; // nuevo prop
}

export default function PhoneCountryInline({
	value = '',
	countryCode,
	disabled,
	onChange,
	onValidChange,
	showSuccess,
	error,
	containerClassname,
}: PhoneCountryInlineProps) {
	const { countries, isLoading } = useCountries();
	const myIp = useMyIp();
	const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
	const [number, setNumber] = useState(value);
	const [internalError, setInternalError] = useState<string | undefined>();

	useEffect(() => {
		if (!countries.length) return;
		if (!currentCountry) {
			const target = countryCode
				? countries.find((c) => c.code === countryCode)
				: undefined;
			if (target) {
				setCurrentCountry(target);
				return;
			}
			if (myIp.data) {
				const { country_code, country, region, calling_code, ip } = myIp.data;
				setCurrentCountry({
					code: country_code,
					name: country,
					id: ip,
					active: true,
					phoneNumberCode: Number(calling_code),
					region,
				});
			}
		}
	}, [countries, countryCode, currentCountry, myIp.data]);

	useEffect(() => {
		if (onChange && currentCountry) {
			onChange({ number, country: currentCountry });
		}
		const valid = /^\d{4,15}$/.test(number);
		setInternalError(!valid && number ? 'Formato inválido' : undefined);
		onValidChange?.(!!currentCountry && valid);
	}, [number, currentCountry, onChange, onValidChange]);

	return (
		<div className={clsx(`flex items-start gap-2`, containerClassname)}>
			<CountriesCombobox
				countries={countries}
				selectedCountry={currentCountry}
				onSelect={(c) => setCurrentCountry(c)}
				disabled={disabled || isLoading}
			/>
			<div className='relative min-w-[140px] flex-1'>
				<PhoneNumberInput
					value={number}
					onChange={setNumber}
					maxLength={15}
					disabled={disabled}
				/>
				{showSuccess && !error && !internalError && (
					<span className='animate-scale-in absolute top-1/2 right-2 -translate-y-1/2 text-green-500'>
						✓
					</span>
				)}
			</div>
			{(error || internalError) && (
				<p className='mt-1 text-xs text-red-500'>{error || internalError}</p>
			)}
		</div>
	);
}
