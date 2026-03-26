import { AlertTriangle } from 'lucide-react';

interface ErrorIndicatorProps {
	errorCount: number;
	onShow: () => void;
	isVisible: boolean;
}

export default function ErrorIndicator({
	errorCount,
	onShow,
	isVisible,
}: ErrorIndicatorProps) {
	if (!isVisible || errorCount === 0) {
		return null;
	}

	return (
		<div className='fixed right-4 bottom-4 z-50'>
			<button
				onClick={onShow}
				className='flex animate-pulse items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-white shadow-lg transition-colors hover:bg-red-600'
			>
				<AlertTriangle className='h-5 w-5' />
				<span className='text-sm font-medium'>
					{errorCount} error{errorCount !== 1 ? 'es' : ''}
				</span>
			</button>
		</div>
	);
}
