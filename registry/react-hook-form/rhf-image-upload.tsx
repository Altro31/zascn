'use client';

import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
	useController,
	UseControllerProps,
	useFormContext,
} from 'react-hook-form';

interface RHFImageUploadProps extends UseControllerProps {
	label?: string;
	defaultImage?: string;
	variant?: 'square' | 'rounded' | 'circle';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
	containerClassName?: string;
}

export function RHFImageUpload({
	label,
	defaultImage,
	variant = 'circle',
	size = 'md',
	className,
	containerClassName,
	...props
}: RHFImageUploadProps) {
	const formProps = useFormContext();
	const { field, fieldState } = useController(props ?? formProps);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(defaultImage || null);
	const [isDragging, setIsDragging] = useState(false);

	// Mantener el preview en sync con el valor del campo (File o URL) y la imagen por defecto
	useEffect(() => {
		// Si hay un File, priorizarlo
		if (field.value instanceof File) {
			const objectUrl = URL.createObjectURL(field.value);
			setPreview(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}

		// Si el valor es una URL válida (string), usarla como preview
		if (typeof field.value === 'string' && isValidImageSrc(field.value)) {
			setPreview(field.value);
			return;
		}

		// En cualquier otro caso, caer a la imagen por defecto
		setPreview(defaultImage || null);
	}, [defaultImage, field.value]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			field.onChange(file);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		field.onChange(null);
		setPreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (file && file.type.startsWith('image/')) {
			field.onChange(file);
		}
	};

	const isValidImageSrc = (src: string | null) => {
		if (!src) return false;

		// Aceptamos URLs absolutas, rutas que empiezan con "/" y blobs/data URLs
		if (
			src.startsWith('http://') ||
			src.startsWith('https://') ||
			src.startsWith('/') ||
			src.startsWith('data:') ||
			src.startsWith('blob:')
		) {
			return true;
		}

		// Cualquier otra cosa (por ejemplo "shipping-agents/xxx.webp") se considera no válida
		return false;
	};

	const safePreview = isValidImageSrc(preview) ? preview : null;

	// Tamaños según la prop
	const sizeClasses = {
		sm: 'w-24 h-24',
		md: 'w-32 h-32',
		lg: 'w-40 h-40',
	};

	// Bordes según la variante
	const variantClasses = {
		square: 'rounded-none',
		rounded: 'rounded-lg',
		circle: 'rounded-full',
	};

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			{label && <label className='text-sm font-medium'>{label}</label>}

			<div
				className={cn(
					'relative flex cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 transition-all',
					sizeClasses[size],
					variantClasses[variant],
					isDragging && 'border-blue-500 bg-blue-50',
					fieldState.error && 'border-red-500',
					containerClassName,
				)}
				onClick={handleClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{safePreview ? (
					<>
						<Image
							src={safePreview}
							alt='Profile preview'
							fill
							className='object-cover'
						/>
						<button
							type='button'
							className='absolute top-1 right-1 rounded-full bg-white p-1 shadow-sm transition-colors hover:bg-gray-100'
							onClick={handleRemove}
						>
							<X className='size-4 text-gray-600' />
						</button>
					</>
				) : (
					<div className='flex w-full flex-col items-center justify-center p-3 text-center'>
						<Upload className='mb-2 size-4 text-gray-400' />
						<span className='text-xs font-medium text-gray-500'>
							Arrastra tu foto aquí
						</span>
						<span className='mt-1 text-xs text-gray-400'>
							o haz clic para seleccionar
						</span>
					</div>
				)}

				<input
					type='file'
					accept='image/*'
					onChange={handleFileChange}
					ref={fileInputRef}
					className='hidden'
				/>
			</div>

			{fieldState.error && (
				<p className='text-xs text-red-500'>{fieldState.error.message}</p>
			)}
		</div>
	);
}
