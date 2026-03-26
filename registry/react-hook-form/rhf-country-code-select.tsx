import { cn } from '@/lib/utils';
import { getCountries } from '@/services/countries';
import type { Country } from '@/types/countries';
import {
	Combobox,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Transition,
} from '@headlessui/react';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
	name: string;
	variant?: 'code' | 'name'; // ← nueva prop para filtrar
	inputClassname?: string;
};

export function RHFCountrySelect({
	name,
	variant = 'code',
	inputClassname,
}: Props) {
	const { control, watch } = useFormContext();
	const [countries, setCountries] = useState<Country[]>([]);
	const [query, setQuery] = useState('');
	const selectedCountryId = watch(name);
	const selectedCountry = countries.find(
		(country) => Number(country.id) === Number(selectedCountryId),
	);

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const res = await getCountries();
				const data = res.data;
				if (data) {
					setCountries(data?.data || []);
				} else {
					throw new Error('No data received');
				}
			} catch (err: any) {
				console.error('Error fetching countries:', err);
				if (control && 'setError' in control) {
					control.setError(name, {
						type: 'manual',
						message: 'Error al obtener países',
					});
				}
			}
		};
		fetchCountries();
	}, [control, name]);

	const filteredCountries =
		query === ''
			? countries
			: countries.filter((country) => {
					if (variant === 'code') {
						const cleanedQuery = query.replace(/[^0-9]/g, '');
						return country?.phoneNumberCode?.toString().includes(cleanedQuery);
					}
					// variant === "name"
					return country.name.toLowerCase().includes(query.toLowerCase());
				});

	const getFlag = (code: string) => (
		<Image
			src={`/assets/images/flags/${code.toUpperCase()}.svg`}
			alt={code}
			className='h-5 w-6 rounded-sm object-cover'
			height={20}
			width={30}
		/>
	);

	return (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange } }) => (
				<div className='w-full max-w-[100px] shrink-0'>
					<Combobox
						value={selectedCountry ?? null}
						onChange={(val) => onChange(Number(val?.id) ?? -1)}
					>
						<div className='relative flex w-full flex-col gap-1'>
							<div className='relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left sm:text-sm'>
								<ComboboxInput
									className={cn('form-input pl-8', inputClassname)}
									displayValue={(country: Country) =>
										country
											? variant === 'code'
												? `(+${country.phoneNumberCode})`
												: country.name
											: ''
									}
									onChange={(event) => setQuery(event.target.value)}
									placeholder={variant === 'code' ? '286' : 'Cuba'}
								/>
								{selectedCountry && (
									<div className='absolute top-1/2 left-2 z-30 -translate-y-1/2'>
										{getFlag(selectedCountry.code)}
									</div>
								)}
							</div>
							<Transition
								as={Fragment}
								leave='transition ease-in duration-300'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
								afterLeave={() => setQuery('')}
							>
								<ComboboxOptions className='custom-scrollbar absolute z-20 mt-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
									{filteredCountries.length === 0 && query !== '' ? (
										<div className='relative cursor-default px-4 py-2 text-gray-700 select-none'>
											No encontrado
										</div>
									) : (
										filteredCountries.map((country) => (
											<ComboboxOption
												key={country.id}
												className={({ selected }) =>
													`hover:bg-secondary relative cursor-pointer p-2 transition-colors duration-300 hover:text-white ${
														selected ? 'bg-primary text-white' : 'text-gray-900'
													}`
												}
												value={country}
											>
												{({ selected }) => (
													<span
														className={`flex items-center gap-2 truncate ${
															selected ? 'font-medium' : 'font-normal'
														}`}
													>
														{getFlag(country.code)}
														{variant === 'code'
															? `(+${country.phoneNumberCode})`
															: country.name}
													</span>
												)}
											</ComboboxOption>
										))
									)}
								</ComboboxOptions>
							</Transition>
						</div>
					</Combobox>
				</div>
			)}
		/>
	);
}
