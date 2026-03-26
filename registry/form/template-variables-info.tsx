import { Info } from 'lucide-react';

interface TemplateVariablesInfoProps {
	title: string;
	description: string;
	variables: Array<{
		name: string;
		description: string;
	}>;
}

export default function TemplateVariablesInfo({
	title,
	description,
	variables,
}: TemplateVariablesInfoProps) {
	return (
		<div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4'>
			<div className='flex items-start gap-3'>
				<Info className='mt-0.5 hidden h-5 w-5 shrink-0 text-blue-500 md:block' />
				<div className='flex-1'>
					<h4 className='mb-1 text-sm font-semibold text-blue-800'>{title}</h4>
					<p className='mb-3 text-sm text-blue-700'>{description}</p>
					<div className='space-y-3'>
						<p className='text-sm font-medium text-blue-800'>
							Variables obligatorias:
						</p>
						<div className='grid grid-cols-1 gap-2'>
							{variables.map((variable) => (
								<div
									key={variable.name}
									className='flex w-fit items-start gap-3 rounded border bg-blue-100 p-2'
								>
									<span className='inline-flex shrink-0 items-center rounded border bg-blue-200 px-2 py-1 font-mono text-xs text-blue-800'>
										{variable.name}
									</span>
									<p className='text-xs leading-relaxed text-blue-700'>
										{variable.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
