import React, { forwardRef, InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'type' | 'value'
> {
	label?: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	disabled?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{ label, checked, onCheckedChange, onBlur, disabled = false, ...rest },
		ref,
	) => {
		return (
			<label className='flex cursor-pointer items-center gap-2'>
				<input
					ref={ref}
					type='checkbox'
					className='mr-2 h-4 w-4'
					checked={checked}
					disabled={disabled}
					onChange={(e) => onCheckedChange(e.target.checked)}
					onBlur={onBlur}
					{...rest}
				/>
				{label && (
					<span className={`text-white-dark ${disabled ? 'opacity-50' : ''}`}>
						{label}
					</span>
				)}
			</label>
		);
	},
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
