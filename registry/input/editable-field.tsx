import { FieldValues } from 'react-hook-form';
import InputWithLabel from '@/components/input/input-with-label';
import { useState, useCallback } from 'react';

interface EditableFieldProps<T extends FieldValues> {
	label: string;
	placeholder?: string;
	editing: boolean;
	value: string;
	validate?: (value: string) => string | null;
	onSave?: (value: string) => Promise<void>;
	onChange: (value: string) => void;
	error?: string;
}

export function EditableField<T extends FieldValues>({
	label,
	placeholder,
	editing,
	value,
	validate,
	onSave,
	onChange,
	error,
}: EditableFieldProps<T>) {
	const [isSaving, setIsSaving] = useState(false);
	const errorMessage = editing && validate ? validate(value ?? '') : null;

	const handleSave = useCallback(async () => {
		if (!onSave) return;
		try {
			setIsSaving(true);
			const result = await onSave(value);
		} finally {
			setIsSaving(false);
		}
	}, [onSave, value]);

	if (editing) {
		return (
			<div className='space-y-1'>
				<div className='relative'>
					<InputWithLabel
						id={value}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						label={label}
						placeholder={placeholder}
						autoFocus={false}
						className='text-sm'
						onBlur={handleSave}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								handleSave();
							}
						}}
						disabled={isSaving}
					/>
					{isSaving && (
						<span className='pointer-events-none absolute right-3 -bottom-1 -translate-y-1/2'>
							<span className='inline-block size-4 animate-spin rounded-full border-2 border-blue-500 border-r-transparent' />
						</span>
					)}
				</div>
				{errorMessage ||
					(error && (
						<p className='text-xs text-red-600 dark:text-red-400'>
							{errorMessage}
							{error}
						</p>
					))}
			</div>
		);
	}
	return (
		<div className='space-y-1'>
			<p className='text-xs font-medium text-slate-600 dark:text-slate-300'>
				{label}
			</p>
			<div className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'>
				{value || 'No especificado'}
			</div>
			{errorMessage && (
				<p className='text-xs text-red-600 dark:text-red-400'>{errorMessage}</p>
			)}
		</div>
	);
}

export default EditableField;
