import { Button } from '@/components/button/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/cards/card';
import { Monitor, Play, Smartphone, Sparkles, Tablet } from 'lucide-react';
import type { PreviewDevice } from './types';

interface PreviewPanelProps {
	htmlContent: string;
	previewDevice: PreviewDevice;
	onDeviceChange: (device: PreviewDevice) => void;
}

export default function PreviewPanel({
	htmlContent,
	previewDevice,
	onDeviceChange,
}: PreviewPanelProps) {
	const getPreviewWidth = () => {
		switch (previewDevice) {
			case 'mobile':
				return '375px';
			case 'tablet':
				return '768px';
			default:
				return '100%';
		}
	};

	return (
		<Card className='border-0 bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-black'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle className='flex items-center gap-2 text-xl'>
						<div className='rounded-lg bg-indigo-100 p-2'>
							<Play className='h-5 w-5 text-indigo-600' />
						</div>
						Vista Previa en Tiempo Real
					</CardTitle>
					<div className='flex gap-2'>
						<Button
							variant={previewDevice === 'desktop' ? 'primary' : 'secondary'}
							size='sm'
							onClick={() => onDeviceChange('desktop')}
						>
							<Monitor className='h-4 w-4' />
						</Button>
						<Button
							variant={previewDevice === 'tablet' ? 'primary' : 'secondary'}
							size='sm'
							onClick={() => onDeviceChange('tablet')}
						>
							<Tablet className='h-4 w-4' />
						</Button>
						<Button
							variant={previewDevice === 'mobile' ? 'primary' : 'secondary'}
							size='sm'
							onClick={() => onDeviceChange('mobile')}
						>
							<Smartphone className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className='p-2 md:p-4'>
				<div className='flex justify-center'>
					<div
						className='overflow-hidden rounded-xl border shadow-2xl transition-all duration-300'
						style={{ width: getPreviewWidth(), maxWidth: '100%' }}
					>
						<iframe
							srcDoc={htmlContent}
							className='min-h-[600px] w-full border-0'
							title='Vista previa HTML'
							sandbox='allow-scripts allow-same-origin'
						/>
					</div>
				</div>
				<div className='mt-6 rounded-xl border border-blue-100 bg-linear-to-r from-blue-50 to-purple-50 p-4 dark:border-slate-700 dark:from-slate-800 dark:to-indigo-900'>
					<div className='flex items-center gap-2 text-blue-800 dark:text-indigo-200'>
						<Sparkles className='h-5 w-5' />
						<p className='font-medium'>
							✨ Vista previa actualizada automáticamente • Dispositivo:{' '}
							{previewDevice === 'desktop'
								? 'Escritorio'
								: previewDevice === 'tablet'
									? 'Tablet'
									: 'Móvil'}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
