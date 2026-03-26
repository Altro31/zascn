'use client';

import { cn } from '@/lib/utils';
import {
	Download,
	File,
	FileText,
	FileTextIcon,
	Upload,
	X,
} from 'lucide-react';
import { useRef } from 'react';
import {
	FieldValues,
	useController,
	UseControllerProps,
} from 'react-hook-form';

interface RHFMultiDocumentUploadProps<
	T extends FieldValues,
> extends UseControllerProps<T> {
	label?: string;
	className?: string;
}

function getIconByMimeType(type?: string) {
	if (!type) return <FileText className='h-5 w-5 text-gray-500' />;
	if (type.includes('pdf'))
		return <Download className='h-5 w-5 text-red-500' />;
	if (type.includes('word'))
		return <FileTextIcon className='h-5 w-5 text-blue-500' />;
	if (type.includes('excel') || type.includes('spreadsheet'))
		return <FileTextIcon className='h-5 w-5 text-green-500' />;
	return <File className='h-5 w-5 text-gray-500' />;
}

export function RHFMultiDocumentUpload<T extends FieldValues>({
	label,
	className,
	...props
}: RHFMultiDocumentUploadProps<T>) {
	const { field, fieldState } = useController(props);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const files: File[] = (field.value as File[]) || [];

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = Array.from(e.target.files ?? []);
		if (selected.length > 0) {
			field.onChange([...files, ...selected]);
		}
		e.target.value = '';
	};

	const handleRemove = (index: number) => {
		const updated = [...files];
		updated.splice(index, 1);
		field.onChange(updated);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const dropped = Array.from(e.dataTransfer.files);
		if (dropped.length > 0) {
			field.onChange([...files, ...dropped]);
		}
	};

	return (
		<div className={cn('flex flex-col gap-2', className)}>
			{label && <label className='text-sm font-medium'>{label}</label>}

			<div
				className={cn(
					'cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-800/40',
					fieldState.error && 'border-red-500',
				)}
				onClick={() => fileInputRef.current?.click()}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<Upload className='mx-auto mb-1 h-5 w-5 text-gray-400' />
				<p className='text-xs font-medium text-gray-500'>
					Haz clic o arrastra documentos para subir
				</p>
				<p className='text-xs text-gray-400'>PDF, Word, Excel, imágenes…</p>
			</div>

			<input
				type='file'
				multiple
				accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,image/*'
				ref={fileInputRef}
				className='hidden'
				onChange={handleFileChange}
			/>

			{files.length > 0 && (
				<div className='space-y-2'>
					{files.map((file, index) => (
						<div
							key={index}
							className='flex items-center justify-between rounded-md border px-3 py-2.5 dark:border-slate-700'
						>
							<div className='flex items-center gap-2 overflow-hidden'>
								{getIconByMimeType(file.type)}
								<span className='truncate text-sm'>{file.name}</span>
								<span className='text-xs whitespace-nowrap text-gray-400'>
									({(file.size / 1024).toFixed(0)} KB)
								</span>
							</div>
							<button
								type='button'
								onClick={() => handleRemove(index)}
								className='ml-2 shrink-0 text-red-500 hover:text-red-700'
							>
								<X className='h-4 w-4' />
							</button>
						</div>
					))}
				</div>
			)}

			{fieldState.error && (
				<p className='text-xs text-red-500'>{fieldState.error.message}</p>
			)}
		</div>
	);
}
