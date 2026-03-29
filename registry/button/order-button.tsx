import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| 'primary'
		| 'secondary'
		| 'outline'
		| 'ghost'
		| 'destructive'
		| 'link';
	size?: 'default' | 'sm' | 'lg' | 'icon';
	loading?: boolean;
}

export const OrderButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'primary',
			size = 'default',
			loading,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const variants = {
			primary:
				'bg-primary text-white hover:opacity-90 shadow-md shadow-primary/20',
			secondary: 'bg-[var(--color-secondary-gold)] text-white hover:opacity-90',
			outline: 'border border-primary text-primary hover:bg-primary/5',
			ghost:
				'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-primary',
			destructive: 'bg-red-500 text-white hover:bg-red-600',
			link: 'text-primary underline-offset-4 hover:underline',
		};

		const sizes = {
			default: 'h-10 px-4 py-2',
			sm: 'h-8 px-3 rounded-md text-xs',
			lg: 'h-11 px-8 rounded-md',
			icon: 'h-10 w-10 p-0',
		};

		return (
			<button
				ref={ref}
				className={cn(
					'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-bold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
					variants[variant],
					sizes[size],
					className,
				)}
				disabled={disabled || loading}
				{...props}
			>
				{loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
				{children}
			</button>
		);
	},
);

OrderButton.displayName = 'Button';
