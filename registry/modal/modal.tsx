'use client';
import { cn } from '@/lib/utils';
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react';
import { X } from 'lucide-react';
import React, { Fragment } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string | React.ReactNode;
	subtitle?: string | React.ReactNode;
	loading?: boolean;
	className?: string;
	closeOnOutsideClick?: boolean;
	closeButton?: boolean;
	position?: 'top' | 'center' | 'bottom';
	// Permite desactivar el padding interno por defecto del cuerpo
	noBodyPadding?: boolean;
	size?: ModalSize; // Alineado con ModalContainer (sm, md, lg, xl)
}

const positionMap: Record<NonNullable<Props['position']>, string> = {
	top: 'items-start',
	center: 'items-center',
	bottom: 'items-end',
};

const sizeClasses: Record<ModalSize, string> = {
	sm: 'max-w-[520px]',
	md: 'max-w-[650px]',
	lg: 'max-w-3xl',
	xl: 'max-w-5xl',
};

const SimpleModal = ({
	open,
	onClose,
	children,
	title,
	closeOnOutsideClick,
	subtitle,
	className,
	loading = false,
	closeButton = true,
	position = 'top',
	size = 'md',
	noBodyPadding = false,
}: Props) => {
	return (
		<Transition
			appear
			show={open}
			as={Fragment}
		>
			<Dialog
				as='div'
				open={open}
				onClose={closeOnOutsideClick ? onClose : () => {}} // desactivado
				static
			>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0' />
				</TransitionChild>
				<div className='font-display animate-in fade-in fixed inset-0 z-100 flex justify-center bg-black/50 backdrop-blur-[1px] duration-200'>
					<div
						className={cn(
							'flex min-h-screen w-full justify-center p-4',
							positionMap[position],
						)}
					>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<DialogPanel
								as='div'
								className={cn(
									`w-full ${sizeClasses[size]} animate-in zoom-in-95 m-0 flex max-h-[95vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all duration-200 dark:bg-[#1a1c23]`,
									className,
								)}
							>
								<div className='flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4 dark:border-gray-800 dark:bg-[#1a1c23]'>
									{title && (
										<div className='flex items-center gap-2 text-lg font-bold text-[#111818] dark:text-white'>
											{title}
										</div>
									)}
									{closeButton && (
										<button
											type='button'
											className='text-gray-400 transition-colors hover:text-red-500'
											onClick={onClose}
										>
											<X />
										</button>
									)}
								</div>
								{subtitle && (
									<div className='shrink-0 px-6 pb-2 text-sm font-medium text-gray-500 dark:text-gray-300'>
										{subtitle}
									</div>
								)}
								{/* Cuerpo con scroll independiente para evitar que el contenido muy grande se desborde fuera del modal */}
								<div
									className={cn(
										'custom-scrollbar relative min-h-0 flex-1 overflow-y-auto bg-white dark:bg-[#1a1c23]',
										noBodyPadding ? '' : 'px-6 py-4',
									)}
								>
									{loading && (
										<div className='inset-0 z-50 flex h-full items-center justify-center bg-white/40 backdrop-blur-sm dark:bg-slate-900/40'>
											<div className='flex flex-col items-center gap-3 text-slate-600 dark:text-slate-300'>
												<span className='border-primary/30 border-t-primary inline-flex h-10 w-10 animate-spin rounded-full border-4' />
												<span className='text-xs font-medium tracking-wide uppercase'>
													Cargando...
												</span>
											</div>
										</div>
									)}
									<div
										className={cn(
											loading
												? 'pointer-events-none opacity-40 select-none'
												: 'opacity-100',
										)}
									>
										{children}
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default SimpleModal;
