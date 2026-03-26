'use client';
import Input from '@/components/input/input';
import React from 'react';

interface PhoneNumberInputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'onChange' | 'value'
	> {
	value: string;
	onChange: (value: string) => void; // custom handler returns digits-only value
	maxLength?: number; // default to 15 (ITU E.164 max is 15 digits not counting +)
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
	value,
	onChange,
	maxLength = 15,
	id = 'phone-input',
	placeholder = 'Ingrese número',
	disabled,
	className,
	...rest
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const digitsOnly = e.target.value.replace(/\D/g, '');
		onChange(digitsOnly.slice(0, maxLength));
	};

	return (
		<Input
			id={id}
			type='tel'
			inputMode='numeric'
			pattern='[0-9]*'
			value={value}
			onChange={handleChange}
			placeholder={placeholder}
			disabled={disabled}
			className={`w-full rounded-l-none ps-3 ${className || ''}`}
			{...rest}
		/>
	);
};

export default PhoneNumberInput;
