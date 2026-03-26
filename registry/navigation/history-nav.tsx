'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/button/button';

const HistoryNav = () => {
	const goBack = () => {
		if (typeof window !== 'undefined') window.history.back();
	};

	const goForward = () => {
		if (typeof window !== 'undefined') window.history.forward();
	};

	return (
		<div className='flex items-center gap-2 ltr:mr-2 rtl:ml-2'>
			<Button
				size='sm'
				onClick={goBack}
				className='flex items-center gap-2 rounded-md bg-gray-100! text-gray-700! hover:bg-gray-200! border-none! shadow-none!'
				aria-label='Atrás'
			>
				<ChevronLeft className='h-5 w-5' />
				<span className='hidden md:inline'>Atrás</span>
			</Button>

			<Button
				size='sm'
				onClick={goForward}
				className='flex items-center gap-2 rounded-md bg-gray-100! text-gray-700! hover:bg-gray-200! border-none! shadow-none!'
				aria-label='Adelante'
			>
				<ChevronRight className='h-5 w-5' />
				<span className='hidden md:inline'>Adelante</span>
			</Button>
		</div>
	);
};

export default HistoryNav;
