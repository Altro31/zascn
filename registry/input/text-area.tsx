import { cn } from '@/lib/utils';
interface TextAreaProps
	extends Omit<React.ComponentProps<'textarea'>, 'onChange'> {
	id?: string;
	name?: string;
	placeholder?: string;
	rows?: number;
	value: string;
	disabled?: boolean;
	onChange: (value: string) => void;
	onBlur?: () => void;
	className?: string;
}

const TextArea = ({
	id,
	name,
	placeholder,
	rows = 3,
	value,
	disabled = false,
	onChange,
	onBlur,
	className,
	...props
}: TextAreaProps) => {
	return (
		<textarea
			id={id}
			name={name}
			placeholder={placeholder}
			rows={rows}
			className={cn('form-textarea min-h-[64px] resize-y p-2', className)}
			onChange={(e) => onChange(e.target.value)}
			onBlur={onBlur}
			value={value}
			disabled={disabled}
			{...props}
		/>
	);
};

TextArea.displayName = 'TextArea';

export default TextArea;
