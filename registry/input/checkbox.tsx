import { Check } from 'lucide-react';
import React from 'react';

export interface CheckboxProps extends Omit<
	React.HTMLAttributes<HTMLLabelElement>,
	'onChange'
> {
	checked: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}

export default function Checkbox({
	checked,
	disabled,
	onChange,
	className = '',
	...rest
}: CheckboxProps) {
	return (
		<label
			className={`inline-flex cursor-pointer items-center ${className}`}
			{...rest}
		>
			<input
				type='checkbox'
				checked={checked}
				disabled={disabled}
				onChange={(e) => onChange?.(e.target.checked)}
				className='peer sr-only'
			/>
			<span className='peer-focus:ring-primary/50 peer-checked:ring-primary/50 peer-checked:bg-primary peer-checked:border-primary inline-flex h-2 w-2 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors peer-focus:ring-2 peer-checked:ring-2 peer-focus:ring-offset-2 peer-focus:ring-offset-white peer-focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:peer-focus:ring-offset-slate-900 peer-checked:ring-offset-2 peer-checked:ring-offset-white peer-checked:outline-none dark:peer-checked:ring-offset-slate-900'>
				<Check className='h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100' />
			</span>
		</label>
	);
}
