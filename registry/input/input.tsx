'use client';
import clsx from 'clsx';
import React from 'react';

export interface BaseInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string | null;
	wrapperClassName?: string;
	label?: string;
	hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, BaseInputProps>(
	({ className, id, disabled, ...rest }, ref) => {
		return (
			<input
				id={id}
				ref={ref}
				disabled={disabled}
				className={clsx(
					className,
					' form-input placeholder:text-white-dark ps-10 transition-shadow duration-200 focus:shadow-[0_0_18px_rgba(59,130,246,0.35)] focus:ring-4 focus:outline-none dark:focus:shadow-[0_0_14px_rgba(80,83,29,0.35)]',
				)}
				{...rest}
			/>
		);
	},
);
Input.displayName = 'Input';

export default Input;
