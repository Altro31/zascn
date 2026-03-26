'use client';

import { Code, Eye } from 'lucide-react';
import CodeEditor from './code-editor';
import EditorHeader from './editor-header';
import EditorToolbar from './editor-toolbar';
import HelpGuide from './help-guide';
import PreviewPanel from './preview-panel';
import { modernTemplate, portfolioTemplate } from './templates';
import { useHTMLEditor } from './useHTMLEditor';

export default function HTMLEditor() {
	const {
		htmlContent,
		setHtmlContent,
		activeTab,
		setActiveTab,
		previewDevice,
		setPreviewDevice,
		stats,
		handleFileImport,
		handleExport,
		handleCopyCode,
		handleClear,
		insertTemplate,
	} = useHTMLEditor();

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900'>
			<EditorHeader />

			<div className='mx-auto max-w-7xl p-6'>
				<EditorToolbar
					onFileImport={handleFileImport}
					onExport={handleExport}
					onCopyCode={handleCopyCode}
					onClear={handleClear}
					onInsertTemplate={insertTemplate}
					modernTemplate={modernTemplate}
					portfolioTemplate={portfolioTemplate}
				/>

				{/* Custom Tabs */}
				<div className='w-full'>
					<div className='mb-6 grid h-14 w-full grid-cols-2 rounded-lg bg-white/90 p-1 backdrop-blur-sm'>
						<button
							onClick={() => setActiveTab('editor')}
							className={`flex items-center justify-center gap-2 rounded-md text-lg font-medium transition-all ${
								activeTab === 'editor'
									? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
									: 'text-slate-600 hover:bg-white/50'
							}`}
						>
							<Code className='h-5 w-5' />
							Editor de Código
						</button>
						<button
							onClick={() => setActiveTab('preview')}
							className={`flex items-center justify-center gap-2 rounded-md text-lg font-medium transition-all ${
								activeTab === 'preview'
									? 'bg-linear-to-r from-indigo-500 to-blue-500 text-white shadow-lg'
									: 'text-slate-600 hover:bg-white/50'
							}`}
						>
							<Eye className='h-5 w-5' />
							Vista Previa
						</button>
					</div>

					{activeTab === 'editor' && (
						<div className='mt-6'>
							<CodeEditor
								htmlContent={htmlContent}
								onContentChange={setHtmlContent}
								stats={stats}
							/>
						</div>
					)}

					{activeTab === 'preview' && (
						<div className='mt-6'>
							<PreviewPanel
								htmlContent={htmlContent}
								previewDevice={previewDevice}
								onDeviceChange={setPreviewDevice}
							/>
						</div>
					)}
				</div>

				<HelpGuide />
			</div>
		</div>
	);
}
