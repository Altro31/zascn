import { Country } from '@/types/countries';

export function getCountriesFilter(input: string, option: keyof Country) {
	const endsWithSpace = input.endsWith(' ');
	const value = input.trim().toLowerCase();

	return (country: Country) => {
		if (!value) return true;

		const code = String(country[option]).toLowerCase();

		if (endsWithSpace) {
			return code === value;
		}
		return code.includes(value);
	};
}

export function filterCountriesByOption(
	input: string,
	countries: Country[],
	option: keyof Country,
): Country[] {
	return countries.filter(getCountriesFilter(input, option));
}
