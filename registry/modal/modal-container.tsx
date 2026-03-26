import React from 'react';
import { X } from 'lucide-react';

import clsx from 'clsx';
import { Button } from '@/sections/order/flow/ui/button';
import { IconButton } from '@/sections/order/flow/ui/icon-button';

interface HeaderAction {
	id?: string;
	label: string;
	onClick: () => void;
	icon?: React.ReactNode;
	variant?: 'ghost' | 'outline' | 'primary';
	disabled?: boolean;
}

interface FooterAction {
	label: string;
	onClick: () => void;
	icon?: React.ReactNode;
	disabled?: boolean;
	loading?: boolean;
	variant?: 'primary' | 'danger' | 'success';
}

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalContainerProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	icon?: React.ReactNode;
	size?: ModalSize;
	headerActions?: HeaderAction[];
	footerLeftAction?: HeaderAction; // e.g. Cancelar / Atrás
	footerAction?: FooterAction; // e.g. Guardar / Continuar
	children?: React.ReactNode;
	className?: string;
	isBusy?: boolean; // Deshabilita interacciones mientras se guarda
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
	isOpen,
	onClose,
	title,
	icon,
	size = 'md',
	headerActions = [],
	footerLeftAction,
	footerAction,
	children,
	className,
	isBusy = false,
}) => {
	if (!isOpen) return null;

	const sizeClasses: Record<ModalSize, string> = {
		sm: 'max-w-[520px]',
		md: 'max-w-[650px]',
		lg: 'max-w-3xl',
		xl: 'max-w-5xl',
	};

	return (
		<div
			className={clsx(
				'font-display animate-in fade-in fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-[1px] duration-200',
				className,
			)}
		>
			<div
				className={`w-full ${sizeClasses[size]} animate-in zoom-in-95 m-4 flex max-h-[95vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 dark:bg-[#1a1c23]`}
			>
				{/* Header */}
				<div className='flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-gray-800 dark:bg-[#1a1c23]'>
					<h2 className='flex items-center gap-2 text-lg font-bold text-[#111818] dark:text-white'>
						{icon ? (
							<span className='bg-primary/10 text-primary rounded-lg p-1.5'>
								{icon}
							</span>
						) : null}
						{title}
					</h2>

					<div className='flex items-center gap-2'>
						{headerActions.map((action) => (
							<Button
								key={action.id ?? action.label}
								variant={action.variant ?? 'ghost'}
								disabled={isBusy || action.disabled}
								onClick={action.onClick}
								className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide text-gray-500 uppercase transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
							>
								{action.icon}
								{action.label}
							</Button>
						))}
						<IconButton
							icon={<X className='h-5 w-5' />}
							onClick={onClose}
							variant='ghost'
							disabled={isBusy}
							className='text-gray-400 transition-colors hover:text-red-500'
						/>
					</div>
				</div>

				{/* Content */}
				<div className='custom-scrollbar max-h-[85vh] flex-1 overflow-y-auto bg-white dark:bg-[#1a1c23]'>
					{children}
				</div>

				{/* Footer */}
				{(footerLeftAction || footerAction) && (
					<div className='flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-[#232830]'>
						<div>
							{footerLeftAction ? (
								<Button
									type='button'
									variant={footerLeftAction.variant ?? 'ghost'}
									onClick={footerLeftAction.onClick}
									disabled={isBusy || footerLeftAction.disabled}
									className='flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide text-gray-500 uppercase transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
								>
									{footerLeftAction.icon}
									{footerLeftAction.label}
								</Button>
							) : (
								<span />
							)}
						</div>

						<div className='flex items-center gap-3'>
							{footerAction ? (
								<Button
									type='button'
									onClick={footerAction.onClick}
									disabled={isBusy || footerAction.disabled}
									className='shadow-primary/20 flex items-center gap-2 px-6 py-2 text-xs font-bold tracking-wider uppercase shadow-md'
								>
									{isBusy || footerAction.loading ? (
										<span className='mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
									) : (
										footerAction.icon
									)}
									{footerAction.label}
								</Button>
							) : null}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
