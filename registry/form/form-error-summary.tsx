import { AlertTriangle, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { FieldErrors } from 'react-hook-form';

interface FormErrorSummaryProps {
	errors: FieldErrors;
	tabMappings: Record<
		string,
		{ tabIndex: number; tabName: string; fieldLabel: string }
	>;
	onFieldClick?: (fieldName: string, tabIndex: number) => void;
	onClose?: () => void;
	isVisible?: boolean;
}

export default function FormErrorSummary({
	errors,
	tabMappings,
	onFieldClick,
	onClose,
	isVisible = true,
}: FormErrorSummaryProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const hasPlayedRef = useRef(false);
	const errorEntries = Object.entries(errors).filter(
		([, error]) => error?.message,
	);

	if (!isVisible || errorEntries.length === 0) {
		return null;
	}

	// sound is handled by the parent/container via onError to avoid hook mismatches

	const groupedErrors = errorEntries.reduce(
		(acc, [fieldName, error]) => {
			const mapping = tabMappings[fieldName];
			if (!mapping) return acc;

			const { tabIndex, tabName } = mapping;
			if (!acc[tabIndex]) {
				acc[tabIndex] = { tabName, errors: [] };
			}

			acc[tabIndex].errors.push({
				fieldName,
				fieldLabel: mapping.fieldLabel,
				message: (error?.message as string) || 'Error desconocido',
			});

			return acc;
		},
		{} as Record<
			number,
			{
				tabName: string;
				errors: Array<{
					fieldName: string;
					fieldLabel: string;
					message: string;
				}>;
			}
		>,
	);

	return (
		<div className='fixed top-4 right-4 left-4 z-50 mx-auto max-w-4xl'>
			<div className='overflow-hidden rounded-lg border border-red-200 bg-red-50 shadow-lg'>
				{/* Header siempre visible */}
				<div className='p-4'>
					<div className='flex w-full items-start justify-between'>
						<div className='flex flex-1 items-center gap-3'>
							<AlertTriangle className='h-6 w-6 shrink-0 text-red-500' />
							<div className='flex-1'>
								<h3 className='text-sm font-semibold text-red-800'>
									{errorEntries.length} error
									{errorEntries.length !== 1 ? 'es' : ''} en el formulario
								</h3>
								<p className='mt-1 text-xs text-red-600'>
									{isExpanded
										? 'Ocultar detalles'
										: 'Haz clic para ver los detalles'}
								</p>
							</div>

							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className='ml-2 rounded px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-800'
							>
								{isExpanded ? 'Ocultar' : 'Ver detalles'}
							</button>
						</div>

						<div className='flex items-center gap-2'>
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className='rounded-full p-1 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600'
								title={isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
							></button>

							{onClose && (
								<button
									onClick={onClose}
									className='rounded-full p-1 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600'
									title='Cerrar'
								>
									<X className='h-4 w-4' />
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Contenido desplegable */}
				{isExpanded && (
					<div className='bg-red-25 animate-in slide-in-from-top-1 border-t border-red-200 px-4 pb-4 duration-200'>
						<div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
							{Object.entries(groupedErrors).map(
								([tabIndex, { tabName, errors: tabErrors }]) => (
									<div
										key={tabIndex}
										className='rounded-md border border-red-200 bg-white p-3 shadow-sm'
									>
										<div className='mb-2 flex items-center gap-2'>
											<div className='h-2 w-2 rounded-full bg-red-500'></div>
											<h4 className='text-sm font-medium text-red-800'>
												{tabName}
											</h4>
											<span className='rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600'>
												{tabErrors.length}
											</span>
										</div>
										<ul className='space-y-1'>
											{tabErrors.map(({ fieldName, fieldLabel, message }) => (
												<li key={fieldName}>
													<button
														onClick={() =>
															onFieldClick?.(fieldName, parseInt(tabIndex))
														}
														className='w-full rounded p-1 text-left text-xs text-red-700 transition-colors hover:bg-red-50 hover:text-red-900'
													>
														<span className='font-medium'>{fieldLabel}:</span>
														<span className='ml-1'>{message}</span>
													</button>
												</li>
											))}
										</ul>
									</div>
								),
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
