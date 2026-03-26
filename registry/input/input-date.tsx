import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parse, Locale } from 'date-fns';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/popover/popover';
import { Calendar } from 'lucide-react';

interface DateInputProps {
	id?: string;
	value?: Date | null;
	onChange?: (date: Date | null) => void;
	onBlur?: () => void;
	placeholder?: string;
	label?: string;
	underLabel?: string;
	disabled?: boolean;
	required?: boolean;
	error?: string;
	width?: string;
	className?: string;
	containerClassName?: string;
	showError?: boolean;
	minDate?: Date;
	maxDate?: Date;
	locale?: Locale;
	inputSize?: 'sm' | 'md' | 'lg';
	formatValue?: (value: Date) => string;
}

export default function DateInput({
	id,
	value,
	onChange,
	onBlur,
	placeholder = 'Selecciona una fecha',
	label,
	underLabel,
	disabled,
	required,
	error,
	className = '',
	containerClassName = '',
	showError,
	minDate,
	maxDate,
	locale,
	inputSize = 'md',
	formatValue,
}: DateInputProps) {
	const [open, setOpen] = useState(false);
	const [inputValue, setInputValue] = useState(value);

	const sizes = {
		sm: 'px-3 py-1 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-5 py-3 text-lg',
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(new Date(e.target.value));
		const parsed = parse(e.target.value, 'yyyy-MM-dd', new Date());
		if (!isNaN(parsed.getTime())) {
			onChange?.(parsed);
		} else {
			onChange?.(null);
		}
	};

	const getFormattedValue = (value?: Date | null) => {
		if (!value) return '';
		if (formatValue) return formatValue(value);
		return format(value, 'yyyy-MM-dd');
	};

	return (
		<div className={`flex flex-col ${containerClassName}`}>
			{label && (
				<label
					htmlFor={id}
					className='mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300'
				>
					{label}
					{required && <span className='ml-1 text-red-500'>*</span>}
				</label>
			)}

			<Popover
				open={open}
				onOpenChange={setOpen}
			>
				<PopoverTrigger asChild>
					<div className='relative'>
						<input
							id={id}
							value={getFormattedValue(inputValue)}
							onChange={handleInputChange}
							onBlur={onBlur}
							disabled={disabled}
							placeholder={placeholder}
							className={`flex w-full items-center ${sizes[inputSize]} rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:hover:border-primary ${error ? 'border-red-500' : ''} pr-10 ${className} `}
						/>
						<Calendar
							className='absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-400 dark:text-gray-300'
							onClick={() => !disabled && setOpen(!open)}
						/>
					</div>
				</PopoverTrigger>

				<PopoverContent
					className='w-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-slate-100'
					align='start'
				>
					<DayPicker
						mode='single'
						selected={value ?? undefined}
						onSelect={(date) => {
							if (date) {
								setInputValue(date);
								onChange?.(date);
							}
							setOpen(false);
						}}
						disabled={disabled}
						fromDate={minDate}
						toDate={maxDate}
						locale={locale}
						captionLayout='dropdown'
						className='p-2'
						modifiersClassNames={{
							selected: 'bg-primary text-white rounded-lg shadow',
							today: 'font-bold text-primary',
						}}
					/>
				</PopoverContent>
			</Popover>

			{underLabel && (
				<span className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
					{underLabel}
				</span>
			)}

			{showError && error && (
				<span className='mt-1 text-xs text-red-500'>{error}</span>
			)}
		</div>
	);
}
