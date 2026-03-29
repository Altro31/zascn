import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface InfoCardProps {
	icon: ReactNode;
	title: string;
	description: string;
	iconBgColor?: string;
	iconTextColor?: string;
	className?: string;
}

export function InfoCard({
	icon,
	title,
	description,
	iconBgColor = 'bg-[#3b3f5c]',
	iconTextColor = 'text-[#f1f2f3]',
	className = '',
}: InfoCardProps) {
	return (
		<div className={cn(`flex items-center justify-center`, className)}>
			<div className='border-white-light w-full max-w-76 rounded border bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none'>
				<div className='px-6 py-7'>
					<div
						className={cn(
							iconBgColor,
							`mb-5 inline-block p-3`,
							iconTextColor,
							`rounded-full`,
						)}
					>
						{icon}
					</div>
					<h5 className='dark:text-white-light mb-4 text-xl font-semibold text-[#3b3f5c]'>
						{title}
					</h5>
					<p className='text-white-dark'>{description}</p>
				</div>
			</div>
		</div>
	);
}
