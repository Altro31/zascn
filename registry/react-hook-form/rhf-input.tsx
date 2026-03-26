'use client';
import { Controller, useFormContext } from 'react-hook-form';
import { CSSProperties, ChangeEvent, useState } from 'react';
import InputWithLabel from '../input/input-with-label';
import { cn } from '@/lib/utils';
import TextArea from '../input/text-area';

// ----------------------------------------------------------------------

interface Props extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'onBlur' | 'value' | 'size'
> {
	name: string;
	type?: string;
	disabled?: boolean;
	size?: 'small' | 'medium';
	label?: string;
	placeholder?: string;
	underLabel?: string;
	width?: CSSProperties['width'];
	required?: boolean;
	dataTest?: string;
	autoComplete?: string;
	isNotAccountant?: boolean;
	minMax?: { min: number; max: number };
	showError?: boolean;
	containerClassname?: string;
	rows?: number;
	className?: string;
}

export default function RHFInputWithLabel({
	name,
	type = 'text',
	disabled,
	size,
	label,
	placeholder,
	underLabel,
	width,
	required,
	dataTest,
	autoComplete,
	isNotAccountant,
	minMax,
	showError = true,
	containerClassname,
	rows = 3,
	className,
	...rest
}: Props) {
	const { control } = useFormContext();

	// Estado para controlar la visibilidad de la contraseña
	const [showPassword, setShowPassword] = useState(false);

	const handleChange =
		(onChange: (...event: any) => void) =>
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;

			// Convertir a número si es input de tipo number
			if (type === 'number') {
				onChange(value === '' ? '' : Number(value));
			} else {
				onChange(value);
			}
			console.debug(isNotAccountant);
		};

	// const handleNumberChange = (value: string, onChange: any) => {
	// 	console.log('1');

	// 	if (value === '') {
	// 		console.log('2');
	// 		onChange('');
	// 		return;
	// 	}

	// 	// Permitir números decimales válidos
	// 	if (/^\d*\.?\d*$/.test(value)) {
	// 		console.log('3');
	// 		// Si termina con punto, mantener como string para permitir escribir el decimal
	// 		if (value.endsWith('.')) {
	// 			console.log('4');
	// 			onChange(value);
	// 		} else {
	// 			console.log('5');
	// 			const numericValue = parseFloat(value);
	// 			onChange(isNaN(numericValue) ? 0 : numericValue);
	// 		}
	// 	}
	// };

	return (
		<Controller
			name={name}
			control={control}
			render={({
				field: { onBlur, onChange, value },
				fieldState: { error },
			}) =>
				type === 'textarea' ? (
					<div
						className={cn('flex flex-col gap-1', containerClassname)}
						style={{ width }}
					>
						{label && (
							<label
								className='text-black dark:text-white'
								htmlFor={name}
							>
								{label}
							</label>
						)}
						<TextArea
							id={name}
							placeholder={placeholder}
							rows={rows}
							onChange={(e) => onChange(e)}
							onBlur={onBlur}
							value={value}
							disabled={disabled}
							onContextMenu={
								rest.onContextMenu as unknown as React.MouseEventHandler<HTMLTextAreaElement>
							}
							className={className}
						/>
						{underLabel && (
							<small className='text-sm text-gray-500'>{underLabel}</small>
						)}
						{showError && error && (
							<span className='text-sm text-red-600'>{error.message}</span>
						)}
					</div>
				) : (
					<InputWithLabel
						required={required}
						placeholder={placeholder}
						underLabel={underLabel}
						label={label}
						onBlur={onBlur}
						onChange={handleChange(onChange)}
						value={value}
						id={name}
						error={showError ? error : undefined}
						disabled={disabled}
						type={type === 'password' && !showPassword ? 'password' : type}
						size={size}
						width={width}
						dataTest={dataTest}
						autoComplete={autoComplete}
						minMax={minMax}
						togglePasswordVisibility={() => setShowPassword(!showPassword)}
						showPassword={showPassword}
						isPassword={type === 'password'}
						className={className}
						containerClassname={containerClassname}
						{...rest}
					/>
				)
			}
		/>
	);
}
