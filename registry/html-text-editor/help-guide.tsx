import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/cards/card';
import { Eye, Settings, Sparkles, Zap } from 'lucide-react';

export default function HelpGuide() {
	return (
		<Card className='mt-6 border-0 bg-linear-to-br from-white/90 to-blue-50/90 shadow-2xl backdrop-blur-sm'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2 text-xl'>
					<div className='rounded-lg bg-purple-100 p-2'>
						<Settings className='h-5 w-5 text-purple-600' />
					</div>
					Guía de Uso Rápida
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6 md:grid-cols-3'>
					<div className='rounded-xl border border-blue-100 bg-white/70 p-4'>
						<h3 className='mb-3 flex items-center gap-2 font-semibold text-blue-800'>
							<Zap className='h-4 w-4' />
							Funciones Principales
						</h3>
						<ul className='space-y-2 text-sm text-gray-700'>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-blue-400'></span>
								Editor con contador de estadísticas
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-indigo-400'></span>
								Vista previa responsive
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-purple-400'></span>
								Plantillas modernas incluidas
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-violet-400'></span>
								Importación/exportación rápida
							</li>
						</ul>
					</div>

					<div className='rounded-xl border border-indigo-100 bg-white/70 p-4'>
						<h3 className='mb-3 flex items-center gap-2 font-semibold text-indigo-800'>
							<Eye className='h-4 w-4' />
							Vista Previa
						</h3>
						<ul className='space-y-2 text-sm text-gray-700'>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-blue-400'></span>
								Actualización en tiempo real
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-indigo-400'></span>
								Simulación de dispositivos
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-purple-400'></span>
								Entorno seguro (sandbox)
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-violet-400'></span>
								Responsive design testing
							</li>
						</ul>
					</div>

					<div className='rounded-xl border border-purple-100 bg-white/70 p-4'>
						<h3 className='mb-3 flex items-center gap-2 font-semibold text-purple-800'>
							<Sparkles className='h-4 w-4' />
							Consejos Pro
						</h3>
						<ul className='space-y-2 text-sm text-gray-700'>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-blue-400'></span>
								Usa Ctrl+A para seleccionar todo
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-indigo-400'></span>
								Prueba en diferentes dispositivos
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-purple-400'></span>
								Guarda tu trabajo frecuentemente
							</li>
							<li className='flex items-center gap-2'>
								<span className='h-2 w-2 rounded-full bg-violet-400'></span>
								Experimenta con las plantillas
							</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
