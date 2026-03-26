import { TooltipBasicTop } from '@/components/tooltip-top-basic';

interface ValueRendererProps {
	value: any;
	withTooltip?: boolean;
	tooltipText?: string;
}

export const EmptyValue = () => (
	<span className='text-gray-400 italic dark:text-gray-500'>
		No especificado
	</span>
);

const BooleanValue = ({ value }: ValueRendererProps) => (
	<span
		className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
			value
				? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
				: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
		}`}
	>
		{value ? 'Habilitado' : 'Deshabilitado'}
	</span>
);

const ColorValue = ({ value }: ValueRendererProps) => (
	<div className='flex items-center gap-2'>
		<div
			className='h-6 w-6 rounded-full border-2 border-gray-300 dark:border-gray-600'
			style={{ backgroundColor: value }}
		/>
		<span className='font-mono text-sm text-gray-900 dark:text-gray-100'>
			{value}
		</span>
	</div>
);

const TextValue = ({ value, withTooltip, tooltipText }: ValueRendererProps) => {
	if (withTooltip && tooltipText) {
		return (
			<TooltipBasicTop label={tooltipText}>{String(value)}</TooltipBasicTop>
		);
	}

	return (
		<span className='font-medium text-gray-900 dark:text-gray-100'>
			{value}
		</span>
	);
};
export const VALUE_RERENDERS: Record<
	string,
	(props: ValueRendererProps) => React.JSX.Element
> = {
	boolean: BooleanValue,
	color: ColorValue,
	text: TextValue,
	number: TextValue,
};
