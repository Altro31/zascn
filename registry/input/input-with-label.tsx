import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { CSSProperties, ChangeEvent, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface Props extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'onBlur' | 'value' | 'size' | 'className'
> {
	id: string;
	placeholder?: string;
	value: string | number;
	onChange: (_: ChangeEvent<HTMLInputElement>) => void;
	onBlur?: () => void;
	error?: FieldError;
	label?: string;
	labelClassName?: string;
	underLabel?: string;
	disabled?: boolean;
	type?: string;
	maskValue?: string;
	size?: 'small' | 'medium' | 'large';
	width?: CSSProperties['width'];
	required?: boolean;
	dataTest?: string;
	autoComplete?: string;
	minMax?: { min: number; max: number };
	className?: string;
	containerClassname?: string;
	// Nuevas props para manejar la contraseña
	togglePasswordVisibility?: () => void;
	showPassword?: boolean;
	isPassword?: boolean;
}

const sizes = {
	small: 'form-input-sm',
	medium: 'form-input',
	large: 'form-input-lg',
};

const InputWithLabel = forwardRef<HTMLInputElement, Props>(
	(
		{
			id,
			placeholder,
			value,
			containerClassname,
			onChange,
			onBlur,
			error: errorAlert,
			label,
			labelClassName,
			underLabel,
			disabled,
			type,
			required,
			size = 'medium',
			dataTest,
			autoComplete,
			minMax,
			className,
			togglePasswordVisibility,
			showPassword = false,
			isPassword = false,
			maskValue,
			...rest
		},
		ref,
	) => (
		<div
			className={cn('relative flex w-full flex-col gap-1', containerClassname)}
		>
			<div className={cn('flex flex-col', label && 'gap-2')}>
				<div className='flex flex-col gap-1'>
					{label && (
						<label
							htmlFor={id}
							className={cn(
								'text-sm font-semibold text-gray-700 dark:text-gray-200',
								labelClassName,
							)}
						>
							{label}
							{required && <span className='text-red-500'> *</span>}
						</label>
					)}
					{underLabel && (
						<p className='text-xs font-normal text-gray-600'>{underLabel}</p>
					)}
				</div>
				<div className='relative'>
					<div
						className={cn('relative', maskValue && 'flex items-center gap-2')}
					>
						{maskValue && (
							<div className='rounded-xl border border-blue-500 p-3 text-gray-800'>
								{maskValue}
							</div>
						)}
						<input
							ref={ref}
							onFocus={(e) => {
								if (type === 'number' && (value === 0 || value === '0')) {
									e.target.select();
								}
							}}
							onKeyDown={(e) => {
								if (type === 'number' && (value === 0 || value === '0')) {
									// Si el usuario presiona un número, reemplazar el 0
									if (e.key.match(/^[0-9]$/)) {
										e.preventDefault();
										onChange({
											...e,
											target: {
												...e.target,
												value: e.key,
											},
										} as unknown as ChangeEvent<HTMLInputElement>);
									}
								}
							}}
							className={cn(
								'form-input',
								className,
								sizes[size],
								errorAlert &&
									'border-red-500 focus:border-red-500 focus:ring-red-500',
								disabled && 'cursor-not-allowed opacity-50',
								// Añadir padding extra cuando hay ícono de ojo
								isPassword && 'pr-10',
							)}
							autoComplete={autoComplete}
							required={required}
							type={type} // Ahora el tipo se controla desde el componente padre
							id={id}
							placeholder={placeholder}
							value={value}
							onChange={(e) => {
								if (e.target.value.length == rest.maxLength) return;
								if (type === 'number' && (value === 0 || value === '0')) {
									if (
										e.target.value.length === 2 &&
										e.target.value.startsWith('0')
									) {
										e.target.value = e.target.value.slice(1);
									}
								}
								onChange(e as unknown as ChangeEvent<HTMLInputElement>);
							}}
							onBlur={onBlur}
							disabled={disabled}
							data-test={dataTest}
							min={minMax?.min}
							max={minMax?.max}
							{...rest}
						/>
					</div>

					{/* Botón para mostrar/ocultar contraseña */}
					{isPassword && (
						<span className='absolute end-4 top-1/2 -translate-y-1/2'>
							<button
								type='button' // Importante para evitar submit accidental
								onClick={togglePasswordVisibility}
								className='size-5 text-gray-500 hover:text-gray-700 focus:outline-none'
							>
								{showPassword ? <Eye /> : <Eye />}
							</button>
						</span>
					)}
				</div>
			</div>

			{errorAlert && (
				<p className='ml-3 text-xs text-red-500'>{errorAlert.message}</p>
			)}
		</div>
	),
);

InputWithLabel.displayName = 'InputWithLabel';

export default InputWithLabel;
