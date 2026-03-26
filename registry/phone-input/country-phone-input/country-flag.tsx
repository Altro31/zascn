'use client';
import { Country } from '@/types/countries';
import Image from 'next/image';
import React from 'react';

interface CountryFlagProps {
	country?: Country | null;
	className?: string;
}

// Placeholder: In real impl, map country.code to an SVG flag component already existing in project.
// For now, simple circle with country.code initials.
export const CountryFlag: React.FC<CountryFlagProps> = ({
	country,
	className = '',
}) => {
	if (!country) {
		return (
			<div
				className={`flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-[10px] font-medium ${className}`}
			>
				?
			</div>
		);
	}
	return (
		<div className={`flex items-center gap-1 ${className}`}>
			<Image
				src={`/assets/images/flags/${country.code.toUpperCase()}.svg`}
				alt={country.code}
				className='rounded-sm object-cover'
				height={20}
				width={24}
			/>
		</div>
	);
};

export default CountryFlag;
