import { forwardRef } from 'react';
import { Button } from '../button/button';

export interface LoaderButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string;
	loading?: boolean;
	children: React.ReactNode;
	// Allow passing input-like props for consistency
	name?: string;
	value?: string | number;
	form?: string;
	formAction?: string;
}

export const LoaderButton = forwardRef<HTMLButtonElement, LoaderButtonProps>(
	(
		{ className, children, loading = false, type = 'button', ...props },
		ref,
	) => {
		return (
			<Button
				ref={ref}
				type={type}
				className={className}
				{...props}
			>
				{loading && (
					<span className='inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4'></span>
				)}
				{children}
			</Button>
		);
	},
);

LoaderButton.displayName = 'LoaderButton';

export default LoaderButton;
