import Badge from '@/components/badge/badge';
import { Code, Sparkles } from 'lucide-react';

interface EditorHeaderProps {
	version?: string;
}

export default function EditorHeader({ version = 'v2.0' }: EditorHeaderProps) {
	return (
		<div className='bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 p-1'>
			<div className='bg-white/10 backdrop-blur-sm'>
				<div className='mx-auto max-w-7xl px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='rounded-xl bg-white/20 p-2'>
								<Code className='h-6 w-6 text-white' />
							</div>
							<div>
								<h1 className='text-2xl font-bold text-white'>
									HTML Editor Pro
								</h1>
								<p className='text-sm text-blue-100'>
									Editor moderno y potente
								</p>
							</div>
						</div>
						<Badge
							variant='secondary'
							className='border-white/30 bg-white/20 text-white'
						>
							<Sparkles className='mr-1 h-3 w-3' />
							{version}
						</Badge>
					</div>
				</div>
			</div>
		</div>
	);
}
