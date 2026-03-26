import React from 'react';
import { useFormContext } from 'react-hook-form';

import { EmptyValue, VALUE_RERENDERS } from './read-only-type-components';

interface ReadOnlyFieldProps {
	label: string;
	name: string;
	type?: 'text' | 'number' | 'color' | 'boolean';
	className?: string;
	withTooltip?: boolean;
	tooltipText?: string;
}

export default function ReadOnlyField({
	label,
	name,
	type = 'text',
	className = '',
	withTooltip = false,
	tooltipText,
}: ReadOnlyFieldProps) {
	const { watch } = useFormContext();
	const value = watch(name);

	const Renderer = VALUE_RERENDERS[type];

	const renderValue = () => {
		if (value === undefined || value === null || value === '') {
			return <EmptyValue />;
		}

		if (!Renderer) {
			return (
				<span className='font-medium text-gray-900 dark:text-gray-100'>
					{value}
				</span>
			);
		}

		return (
			<Renderer
				value={value}
				withTooltip={withTooltip}
				tooltipText={tooltipText}
			/>
		);
	};

	return (
		<div className={className}>
			<label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
				{label}
			</label>
			<div className='mt-2 rounded-md border border-gray-200 bg-gray-200/50 p-2 dark:border-gray-700 dark:bg-gray-800'>
				{renderValue()}
			</div>
		</div>
	);
}
