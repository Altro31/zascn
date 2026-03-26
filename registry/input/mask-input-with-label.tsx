import { cn } from '@/lib/utils';
import { CSSProperties, ChangeEvent } from 'react';
import { FieldError } from 'react-hook-form';
import MaskedInput, { Mask } from 'react-text-mask';

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
	underLabel?: string;
	disabled?: boolean;
	type?: string;
	size?: 'small' | 'medium' | 'large';
	width?: CSSProperties['width'];
	required?: boolean;
	dataTest?: string;
	autoComplete?: string;
	className?: string;
	containerClassname?: string;
	mask: Mask | ((value: string) => Mask);
}

const MaskInputWithLabel: React.FC<Props> = ({
	id,
	placeholder,
	value,
	containerClassname,
	onChange,
	onBlur,
	error: errorAlert,
	label,
	underLabel,
	disabled,
	type,
	required,
	size = 'medium',
	width = '100%',
	dataTest,
	autoComplete,
	className,
	mask,
	...rest
}) => (
	<div
		className={cn('relative flex w-full flex-col gap-1', containerClassname)}
		style={{ width }}
	>
		<div className={cn('flex flex-col', label && 'gap-2')}>
			<div className='flex flex-col gap-1'>
				{label && (
					<label
						htmlFor={id}
						className='text-sm font-semibold text-gray-700 dark:text-gray-200'
					>
						{label}
						{required && '*'}
					</label>
				)}
				{underLabel && (
					<p className='text-xs font-normal text-gray-600'>{underLabel}</p>
				)}
			</div>
			<div className='relative'>
				<div className={cn('relative')}>
					<MaskedInput
						className={cn(
							className,
							errorAlert &&
								'border-red-500 focus:border-red-500 focus:ring-red-500',
							disabled && 'cursor-not-allowed opacity-50',
						)}
						autoComplete={autoComplete}
						required={required}
						type={type}
						id={id}
						placeholder={placeholder}
						value={value}
						onChange={(e) => {
							onChange(e as unknown as ChangeEvent<HTMLInputElement>);
						}}
						onBlur={onBlur}
						disabled={disabled}
						data-test={dataTest}
						style={{ width } as any}
						mask={mask}
						{...(rest as any)}
					/>
				</div>
			</div>
		</div>

		{errorAlert && (
			<p className='ml-3 text-xs text-red-500'>{errorAlert.message}</p>
		)}
	</div>
);

export default MaskInputWithLabel;
