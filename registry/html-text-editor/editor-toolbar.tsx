import { Button } from '@/components/button/button';
import { Card, CardContent } from '@/components/cards/card';
import { Copy, Download, Trash as Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';

interface EditorToolbarProps {
	onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onExport: () => void;
	onCopyCode: () => void;
	onClear: () => void;
	onInsertTemplate: (template: string, name: string) => void;
	modernTemplate: string;
	portfolioTemplate: string;
	onlyPreview?: boolean;
}

export default function EditorToolbar({
	onFileImport,
	onExport,
	onCopyCode,
	onClear,
	onlyPreview,
	// onInsertTemplate,
	// modernTemplate,
	// portfolioTemplate,
}: EditorToolbarProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<Card className='mb-6 border-0 bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-black'>
			<CardContent className='p-3'>
				<div className='flex flex-wrap justify-center gap-3'>
					{/* Grupo de archivos */}
					<div className='flex gap-2 rounded-xl'>
						{!onlyPreview && (
							<Button
								onClick={() => fileInputRef.current?.click()}
								className='bg-primary w-[8rem] text-white shadow-lg hover:from-blue-600 hover:to-blue-700'
							>
								<Upload className='mr-2 h-4 w-4' />
								Importar
							</Button>
						)}
						<Button
							onClick={onExport}
							className='bg-secondary w-[8rem] text-white shadow-lg hover:from-indigo-600 hover:to-indigo-700'
						>
							<Download className='mr-2 h-4 w-4' />
							Exportar
						</Button>
					</div>

					{/* Grupo de edición */}
					<div className='flex gap-2 rounded-xl'>
						<Button
							onClick={onCopyCode}
							className='text-primary hover:bg-primary w-[8rem] bg-transparent shadow-lg hover:text-white'
						>
							<Copy className='mr-2 h-4 w-4' />
							Copiar
						</Button>
						{!onlyPreview && (
							<Button
								onClick={onClear}
								variant='secondary'
								outline={true}
								className='w-[8rem] border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50'
							>
								<Trash2 className='mr-2 h-4 w-4' />
								Limpiar
							</Button>
						)}
					</div>

					{/* Grupo de plantillas
          <div className="flex gap-2  rounded-xl">
            <Button
              onClick={() => onInsertTemplate(modernTemplate, "Moderna")}
              className="bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Moderna
            </Button>
            <Button
              onClick={() => onInsertTemplate(portfolioTemplate, "Portfolio")}
              className="bg-linear-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg"
            >
              <Palette className="h-4 w-4 mr-2" />
              Portfolio
            </Button>
          </div> */}
				</div>

				<input
					ref={fileInputRef}
					type='file'
					accept='.html,.htm'
					onChange={onFileImport}
					className='hidden'
				/>
			</CardContent>
		</Card>
	);
}
