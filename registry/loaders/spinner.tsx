'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
	size?: number;
	className?: string;
}

export function Spinner({ size = 12, className }: SpinnerProps) {
	return (
		<span
			className={cn(
				'inline-block animate-spin rounded-full border-2 border-white/60 border-t-white',
				className,
			)}
			style={{ width: size, height: size }}
			aria-live='polite'
			aria-busy='true'
		/>
	);
}

export default Spinner;
