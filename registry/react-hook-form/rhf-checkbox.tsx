// components/rhf/rhf-checkbox.tsx
'use client';

import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import Checkbox from '../checkbox/checkbox';

interface RHFCheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
	name: string;
	label?: string;
	underLabel?: string;
	required?: boolean;
	showError?: boolean;
}

export default function RHFCheckbox({
	name,
	label = '',
	underLabel,
	required = false,
	disabled = false,
	showError = true,
	...rest
}: RHFCheckboxProps) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			rules={{ required }}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState: { error },
			}) => {
				if (process.env.NODE_ENV !== 'production') {
					console.log('[RHFCheckbox] render', { name, value });
				}
				return (
					<div className='mb-2'>
						<div className='flex cursor-pointer items-center gap-2'>
							<Checkbox
								ref={ref}
								checked={value}
								disabled={disabled}
								onCheckedChange={(checked) => {
									if (process.env.NODE_ENV !== 'production') {
										console.log('[RHFCheckbox] onCheckedChange', {
											name,
											checked,
											previous: value,
										});
									}
									onChange(checked);
								}}
								onBlur={onBlur}
								label={label}
								{...rest}
							/>
						</div>

						{underLabel && (
							<p
								className={`text-white-dark ml-6 text-sm ${disabled ? 'opacity-50' : ''}`}
							>
								{underLabel}
							</p>
						)}

						{showError && error && (
							<p className='mt-1 ml-6 text-sm text-red-500'>
								{error.message || 'Este campo es requerido'}
							</p>
						)}
					</div>
				);
			}}
		/>
	);
}
