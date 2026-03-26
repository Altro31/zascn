import { cn } from '@/lib/utils';
import { Tooltip, TooltipFloatingProps } from '@mantine/core';
import { truncate, TruncateOptions } from 'lodash';

interface Props extends TooltipFloatingProps {
	trucateOptions?: TruncateOptions;
}
export const TooltipBasicTop = ({
	trucateOptions,
	className,
	classNames,
	children,
	...rest
}: Props) => {
	const isTextOnly = typeof children === 'string' || children instanceof String;

	// Mergeable tooltip container classes to allow full content visibility
	const tooltipClasses = cn('p-4 whitespace-pre-line break-words', classNames);

	return (
		<Tooltip
			position='top'
			withArrow
			multiline
			transitionProps={{
				transition: 'pop',
				duration: 300,
				timingFunction: 'ease',
			}}
			classNames={{ tooltip: tooltipClasses }}
			{...rest}
		>
			<div
				className={cn(
					'line-clamp-2 cursor-help text-sm text-gray-600 dark:text-gray-300',
					className,
				)}
			>
				{isTextOnly
					? truncate(children as string, trucateOptions || { length: 50 })
					: children}
			</div>
		</Tooltip>
	);
};
