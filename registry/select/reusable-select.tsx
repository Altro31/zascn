'use client';

import { Select } from '@mantine/core';
import React from 'react';

interface ReusableSelectProps {
	value: string;
	onChange: (value: string) => void;
	data: { value: string; label: string }[];
	placeholder?: string;
	maxDropdownHeight?: number;
	searchable?: boolean;
	clearable?: boolean;
	nothingFoundMessage?: string;
	className?: string;
}

export const ReusableSelect: React.FC<ReusableSelectProps> = ({
	value,
	onChange,
	data,
	placeholder = 'Seleccionar',
	maxDropdownHeight = 300,
	searchable = true,
	clearable = true,
	nothingFoundMessage = 'No se encontraron opciones',
	className,
}) => {
	return (
		<Select
			value={value}
			onChange={(val) => onChange(val || '')}
			data={data}
			placeholder={placeholder}
			searchable={searchable}
			clearable={clearable}
			clearButtonProps={{ bg: 'none' }}
			checkIconPosition='right'
			maxDropdownHeight={maxDropdownHeight}
			nothingFoundMessage={nothingFoundMessage}
			className={`min-w-[220px] flex-1 ${className ?? ''}`}
			classNames={{
				input: `
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900
          text-gray-800 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          p-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors
        `,
				dropdown: `
          border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-900
          rounded-lg shadow-lg
          p-1
        `,
				option: `
          px-3 py-2 rounded-md
          hover:bg-blue-500/10 dark:hover:bg-blue-500/20
          focus:bg-blue-500/20 dark:focus:bg-blue-500/30
          text-gray-800 dark:text-gray-100
          cursor-pointer
          transition-colors
        `,
				options: `
          flex flex-col gap-1
          text-gray-900 dark:text-gray-100
        `,
			}}
			comboboxProps={{
				transitionProps: { transition: 'pop', duration: 150 },
				shadow: 'md',
				radius: 'md',
			}}
		/>
	);
};
