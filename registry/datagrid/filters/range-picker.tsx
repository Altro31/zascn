'use client';

import { Spanish } from 'flatpickr/dist/l10n/es';
import 'flatpickr/dist/flatpickr.css';
import Flatpickr from 'react-flatpickr';

interface RangePickerProps {
	value?: [Date, Date] | null;
	onChange: (range: [Date, Date] | null) => void;
	placeholder?: string;
	dateFormat?: string;
	className?: string;
	disabled?: boolean;
	label?: string;
}

export default function RangePicker({
	value,
	onChange,
	placeholder = 'Seleccionar rango...',
	dateFormat = 'Y-m-d',
	className = '',
	disabled = false,
	label,
}: RangePickerProps) {
	return (
		<div className={`w-full ${className}`}>
			{label && (
				<label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200'>
					{label}
				</label>
			)}
			<Flatpickr
				options={{
					mode: 'range',
					dateFormat,
					locale: Spanish,
				}}
				value={value ?? undefined}
				placeholder={placeholder}
				disabled={disabled}
				className={
					'form-input w-full rounded-xl border-2 border-slate-200 bg-white text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900/60 ' +
					className
				}
				onChange={(dates) => {
					if (dates.length === 2) {
						onChange([dates[0], dates[1]]);
					} else {
						onChange(null);
					}
				}}
			/>
		</div>
	);
}
