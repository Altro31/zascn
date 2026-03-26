import { Country } from '@/types/countries';

export function getCountriesFilter(input: string) {
	const endsWithSpace = input.endsWith(' ');
	const value = input.trim().toLowerCase();

	return (country: Country) => {
		if (!value) return true;

		const code = String(country.phoneNumberCode).toLowerCase();

		if (endsWithSpace) {
			return code === value;
		}
		return code.includes(value);
	};
}

export function filterCountriesByPhoneCode(
	input: string,
	countries: Country[],
): Country[] {
	return countries.filter(getCountriesFilter(input));
}
