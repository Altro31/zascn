'use client';

import { cn } from '@/lib/utils';
import { Code, Eye } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import CodeEditor from '../html-text-editor/code-editor';
import EditorToolbar from '../html-text-editor/editor-toolbar';
import PreviewPanel from '../html-text-editor/preview-panel';
import {
	modernTemplate,
	portfolioTemplate,
} from '../html-text-editor/templates';
import type { EditorStats, PreviewDevice } from '../html-text-editor/types';

interface RHFHTMLEditorProps {
	name: string;
	label?: string;
	helperText?: string;
	showToolbar?: boolean;
	showPreview?: boolean;
	defaultTab?: 'editor' | 'preview';
	disabled?: boolean;
	variables?: { name: string; description?: string }[];
}

export default function RHFHTMLEditor({
	name,
	label,
	helperText,
	showToolbar = true,
	showPreview = true,
	defaultTab = 'editor',
	disabled = false,
	variables,
}: RHFHTMLEditorProps) {
	const { control } = useFormContext();
	const [activeTab, setActiveTab] = useState(disabled ? 'preview' : defaultTab);
	const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');

	const getStats = (content: string): EditorStats => ({
		lineCount: content.split('\n').length,
		charCount: content.length,
		wordCount: content.trim().split(/\s+/).length,
	});

	const handleFileImport = (
		event: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			if (
				file.type === 'text/html' ||
				file.name.endsWith('.html') ||
				file.name.endsWith('.htm')
			) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const content = e.target?.result as string;
					onChange(content);
					toast.success(
						`🎉 ¡Archivo importado! ${file.name} se ha cargado correctamente.`,
					);
				};
				reader.readAsText(file);
			} else {
				toast.error(
					'❌ Tipo de archivo no válido. Por favor, selecciona un archivo HTML (.html o .htm).',
				);
			}
		}
	};

	const handleExport = (content: string) => {
		const blob = new Blob([content], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'mi-documento.html';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast.success(
			'📥 ¡Archivo exportado! Tu archivo HTML se ha descargado correctamente.',
		);
	};

	const handleCopyCode = async (content: string) => {
		try {
			await navigator.clipboard.writeText(content);
			toast.success(
				'📋 ¡Código copiado! El código HTML se ha copiado al portapapeles.',
			);
		} catch {
			toast.error(
				'❌ Error al copiar. No se pudo copiar el código al portapapeles.',
			);
		}
	};

	const handleClear = (onChange: (value: string) => void) => {
		onChange('');
		toast.success(
			'🧹 ¡Editor limpiado! El contenido del editor se ha eliminado.',
		);
	};

	const insertTemplate = (
		template: string,
		name: string,
		onChange: (value: string) => void,
	) => {
		onChange(template);
		toast.success(
			`✨ ¡Plantilla insertada! Se ha cargado la plantilla: ${name}`,
		);
	};

	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value = '' }, fieldState: { error } }) => {
				const stats = getStats(value);

				return (
					<div className='flex flex-col space-y-4'>
						{label && (
							<label
								htmlFor={name}
								className='text-sm font-medium text-gray-700 dark:text-gray-200'
							>
								{label}
							</label>
						)}

						<div className='rounded-lg'>
							{showToolbar && (
								<div className='mb-4'>
									<EditorToolbar
										onFileImport={(event) => handleFileImport(event, onChange)}
										onExport={() => handleExport(value)}
										onCopyCode={() => handleCopyCode(value)}
										onClear={() => handleClear(onChange)}
										onInsertTemplate={(template, name) =>
											insertTemplate(template, name, onChange)
										}
										modernTemplate={modernTemplate}
										portfolioTemplate={portfolioTemplate}
										onlyPreview={disabled}
									/>
								</div>
							)}

							{/* Tabs */}
							{showPreview ? (
								<div className='w-full'>
									<div className='mb-6 grid h-14 w-full grid-cols-2 gap-1 rounded-lg bg-white/90 p-1 backdrop-blur-sm dark:bg-black'>
										<button
											type='button'
											disabled={disabled}
											onClick={() => setActiveTab('editor')}
											className={cn(
												`flex items-center justify-center gap-1.5 rounded-md px-3 text-base leading-none font-medium whitespace-nowrap transition-all ${
													activeTab === 'editor'
														? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
														: 'hover:bg-primary text-slate-600 hover:text-white'
												}`,
												disabled && 'cursor-not-allowed opacity-50',
											)}
										>
											<Code className='h-4 w-4' />
											Editor de Código
										</button>

										<button
											type='button'
											onClick={() => setActiveTab('preview')}
											className={`flex items-center justify-center gap-1.5 rounded-md px-3 text-base leading-none font-medium whitespace-nowrap transition-all ${
												activeTab === 'preview'
													? 'bg-linear-to-r from-indigo-500 to-blue-500 text-white shadow-lg'
													: 'hover:bg-primary text-slate-600 hover:text-white'
											}`}
										>
											<Eye className='h-4 w-4' />
											Vista Previa
										</button>
									</div>

									{activeTab === 'editor' && (
										<CodeEditor
											htmlContent={value}
											onContentChange={onChange}
											stats={stats}
											variables={variables}
										/>
									)}

									{activeTab === 'preview' && (
										<PreviewPanel
											htmlContent={value}
											previewDevice={previewDevice}
											onDeviceChange={setPreviewDevice}
										/>
									)}
								</div>
							) : (
								<CodeEditor
									htmlContent={value}
									onContentChange={onChange}
									stats={stats}
									variables={variables}
								/>
							)}
						</div>

						{(error || helperText) && (
							<p className='text-xs text-red-500'>
								{error?.message || helperText}
							</p>
						)}
					</div>
				);
			}}
		/>
	);
}
