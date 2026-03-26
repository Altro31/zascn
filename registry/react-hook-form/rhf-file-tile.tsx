'use client';

import { useEffect, useState } from 'react';
import {
	Control,
	FieldPath,
	useController,
	useFormContext,
} from 'react-hook-form';
import {
	Trash2,
	File as FileIcon,
	FileText,
	FileSpreadsheet,
	FileArchive,
	FileAudio,
	FileVideo,
	FileCode,
} from 'lucide-react';

export interface RHFFileTileProps<
	TFieldValues extends Record<string, any> = any,
> {
	/** Nombre completo del campo, por ejemplo: "photos.0" o "documents.0.file" */
	name: FieldPath<TFieldValues> | string;
	/** Callback opcional para eliminar el ítem del array */
	onRemove?: () => void;
	/** Acepta por defecto solo imágenes; se puede sobreescribir para otros archivos */
	accept?: string;
	/** Texto que se muestra en el estado vacío */
	emptyLabel?: string;
}

export function RHFFileTile<TFieldValues extends Record<string, any> = any>(
	props: RHFFileTileProps<TFieldValues>,
) {
	const {
		name,
		onRemove,
		accept = 'image/*',
		emptyLabel = 'Subir archivo',
	} = props;

	const methods = useFormContext<TFieldValues>();
	const control: Control<TFieldValues> = methods.control;

	const { field } = useController({
		name: name as FieldPath<TFieldValues>,
		control,
	});

	const [preview, setPreview] = useState<string | null>(null);
	const [isImage, setIsImage] = useState(false);
	const [isPdf, setIsPdf] = useState(false);

	// Generar / limpiar preview al cambiar el File
	useEffect(() => {
		const current = field.value as any;
		if (current instanceof File) {
			const mime = current.type || '';
			const name = current.name?.toLowerCase?.() ?? '';
			const isImg = mime.startsWith('image/');
			const isPdfFile = mime === 'application/pdf' || name.endsWith('.pdf');
			setIsImage(isImg);
			setIsPdf(isPdfFile);

			if (isImg || isPdfFile) {
				const objectUrl = URL.createObjectURL(current);
				setPreview(objectUrl);
				return () => {
					URL.revokeObjectURL(objectUrl);
				};
			}
		}

		setPreview(null);
		setIsImage(false);
		setIsPdf(false);
	}, [field.value]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			field.onChange(file);
		}
		// permitir volver a seleccionar el mismo archivo si es necesario
		e.currentTarget.value = '';
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onRemove) {
			onRemove();
		} else {
			field.onChange(null);
		}
	};

	const file = field.value as any as File | undefined;
	const hasFile = file instanceof File;
	const fileName = file?.name ?? '';
	const ext = fileName.includes('.')
		? fileName.split('.').pop()?.toLowerCase()
		: undefined;

	const getIconForExtension = () => {
		if (!ext) return FileIcon;
		if (['txt', 'md', 'rtf', 'doc', 'docx', 'odt', 'pdf'].includes(ext))
			return FileText;
		if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return FileSpreadsheet;
		if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return FileArchive;
		if (['mp3', 'wav', 'ogg'].includes(ext)) return FileAudio;
		if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return FileVideo;
		if (['js', 'ts', 'tsx', 'jsx', 'json', 'css', 'html'].includes(ext))
			return FileCode;
		return FileIcon;
	};

	const Icon = getIconForExtension();

	return (
		<div className='group relative aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900'>
			{hasFile ? (
				<>
					{isImage && preview && (
						<img
							src={preview}
							alt='Preview de imagen'
							className='h-full w-full object-cover'
						/>
					)}
					{!isImage && isPdf && preview && (
						<div className='flex h-full w-full flex-col overflow-hidden bg-slate-900/80'>
							<iframe
								src={preview}
								title={fileName || 'Vista previa PDF'}
								className='h-full w-full border-0'
							/>
							<div className='line-clamp-1 bg-black/60 px-2 py-1 text-[10px] font-medium text-slate-50'>
								PDF: {fileName}
							</div>
						</div>
					)}
					{!isImage && !isPdf && (
						<div className='flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-50 px-3 text-slate-500 dark:bg-slate-900 dark:text-slate-200'>
							<div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700'>
								<Icon className='h-5 w-5' />
							</div>
							<span className='max-w-full truncate text-[10px] font-medium'>
								{fileName || 'Archivo seleccionado'}
							</span>
						</div>
					)}
					{onRemove && (
						<button
							type='button'
							onClick={handleRemove}
							className='absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white dark:bg-slate-800/90'
						>
							<Trash2 className='h-3.5 w-3.5' />
						</button>
					)}
				</>
			) : (
				<label className='hover:text-primary flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-slate-400 transition-colors hover:bg-slate-100/50 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'>
					<div className='rounded-full bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-600'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
							<polyline points='17 8 12 3 7 8' />
							<line
								x1='12'
								y1='3'
								x2='12'
								y2='15'
							/>
						</svg>
					</div>
					<span className='text-[10px] font-medium'>{emptyLabel}</span>
					<input
						type='file'
						accept={accept}
						className='hidden'
						onChange={handleFileChange}
					/>
					{onRemove && (
						<button
							type='button'
							onClick={handleRemove}
							className='absolute top-1 right-1 p-1 text-slate-300 hover:text-red-500'
						>
							<Trash2 className='h-3 w-3' />
						</button>
					)}
				</label>
			)}
		</div>
	);
}

export default RHFFileTile;
