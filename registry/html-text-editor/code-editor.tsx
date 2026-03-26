import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/cards/card';
import { Code, MousePointerClick } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { EditorStats } from './types';

interface TemplateVariable {
	name: string;
	description?: string;
}

interface CodeEditorProps {
	htmlContent: string;
	onContentChange: (content: string) => void;
	stats: EditorStats; // kept for potential future use
	variables?: TemplateVariable[]; // variables available for insertion via context menu
}

export default function CodeEditor({
	htmlContent,
	onContentChange,
	variables,
}: CodeEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const cardRef = useRef<HTMLDivElement | null>(null);
	const menuRef = useRef<HTMLUListElement | null>(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
	const [selectionRange, setSelectionRange] = useState<{
		start: number;
		end: number;
	}>({ start: 0, end: 0 });

	// Fallback default variables (mirrors the ones listed in TemplateVariablesInfo)
	const fallbackVariables: TemplateVariable[] = [
		{ name: '@username', description: 'Nombre del usuario' },
		{ name: '@bussinesphone', description: 'Número de teléfono del negocio' },
		{ name: '@bussinesmail', description: 'Correo del negocio' },
		{ name: '@bussinesname', description: 'Nombre del negocio' },
	];

	const varsToShow =
		variables && variables.length > 0 ? variables : fallbackVariables;

	// Close menu when clicking outside or pressing Escape
	useEffect(() => {
		const handleGlobalClick = (e: MouseEvent) => {
			// If click is outside the menu, close it
			if (!(e.target instanceof HTMLElement)) return;
			if (!e.target.closest('.html-editor-context-menu')) {
				setMenuVisible(false);
			}
		};
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setMenuVisible(false);
		};
		window.addEventListener('click', handleGlobalClick);
		window.addEventListener('keydown', handleEsc);
		return () => {
			window.removeEventListener('click', handleGlobalClick);
			window.removeEventListener('keydown', handleEsc);
		};
	}, []);

	const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
		e.preventDefault();
		const target = e.currentTarget;
		// Store current selection/caret
		setSelectionRange({
			start: target.selectionStart,
			end: target.selectionEnd,
		});

		// Position relative to card container to avoid viewport scroll offset issues
		const cardRect = cardRef.current?.getBoundingClientRect();
		if (cardRect) {
			const relativeX = e.clientX - cardRect.left;
			const relativeY = e.clientY - cardRect.top;
			setMenuPosition({ x: relativeX, y: relativeY });
		} else {
			setMenuPosition({ x: e.clientX, y: e.clientY });
		}
		setMenuVisible(true);
	};

	const insertVariable = (variable: string) => {
		const { start, end } = selectionRange;
		const newValue =
			htmlContent.slice(0, start) + variable + htmlContent.slice(end);
		onContentChange(newValue);
		// Restore focus & move caret after inserted variable
		requestAnimationFrame(() => {
			const ta = textareaRef.current;
			if (ta) {
				const caretPos = start + variable.length;
				ta.focus();
				ta.selectionStart = ta.selectionEnd = caretPos;
			}
		});
		setMenuVisible(false);
	};

	// Prevent scrolling the page when using wheel inside menu (optional UX enhancement)
	useEffect(() => {
		if (!menuVisible) return;
		const preventScroll = (e: WheelEvent) => {
			if ((e.target as HTMLElement)?.closest('.html-editor-context-menu')) {
				e.preventDefault();
			}
		};
		window.addEventListener('wheel', preventScroll, { passive: false });
		return () => window.removeEventListener('wheel', preventScroll);
	}, [menuVisible]);

	// Clamp menu inside card bounds when visible
	useEffect(() => {
		if (menuVisible && cardRef.current && menuRef.current) {
			const cardRect = cardRef.current.getBoundingClientRect();
			const menuRect = menuRef.current.getBoundingClientRect();
			let { x, y } = menuPosition;
			// x/y are relative to card; card width/height for boundaries
			if (x + menuRect.width > cardRect.width) {
				x = cardRect.width - menuRect.width - 8; // padding from edge
			}
			if (y + menuRect.height > cardRect.height) {
				y = cardRect.height - menuRect.height - 8;
			}
			if (x < 8) x = 8;
			if (y < 8) y = 8;
			if (x !== menuPosition.x || y !== menuPosition.y) {
				setMenuPosition({ x, y });
			}
		}
	}, [menuVisible, menuPosition]);

	return (
		<Card
			ref={cardRef}
			className='relative border-0 bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-black'
		>
			<CardHeader>
				<div className='flex items-center justify-between dark:bg-black'>
					<CardTitle className='flex flex-col gap-4 text-xl md:flex-row md:items-start md:justify-between'>
						<div className='flex items-center gap-3'>
							<div className='rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40'>
								<Code className='h-5 w-5 text-blue-600 dark:text-blue-400' />
							</div>

							<span className='font-semibold'>Editor de Código HTML</span>
						</div>

						<div className='flex max-w-xl items-start gap-2 rounded-md bg-blue-100/60 px-3 py-2 text-xs text-blue-700 dark:bg-gray-800/60 dark:text-blue-300'>
							<MousePointerClick className='mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400' />
							<span>
								Haz clic derecho dentro del editor para abrir el menú contextual
								e insertar cualquiera de estas variables en la posición actual
								del cursor.
							</span>
						</div>
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className='p-0'>
				<textarea
					ref={textareaRef}
					value={htmlContent}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						onContentChange(e.target.value)
					}
					onContextMenu={handleContextMenu}
					placeholder='<h1>Escribe tu código HTML aquí...</h1>'
					className='min-h-[600px] w-full resize-none rounded-2xl border-0 bg-white p-4 font-mono text-sm outline-none focus:border focus:border-white focus:ring-0 dark:bg-black'
				/>
				{menuVisible && (
					<ul
						ref={menuRef}
						className='html-editor-context-menu absolute z-50 min-w-[220px] overflow-hidden rounded-md border border-gray-200 bg-white/95 p-1 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900'
						style={{ top: menuPosition.y, left: menuPosition.x }}
					>
						{varsToShow.map((v) => (
							<li key={v.name}>
								<button
									type='button'
									onClick={() => insertVariable(v.name)}
									className='group flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm text-gray-800 transition-colors hover:bg-blue-600 hover:text-white dark:text-gray-200 dark:hover:bg-blue-600'
								>
									<span className='font-mono font-semibold'>{v.name}</span>

									{v.description && (
										<span className='truncate text-xs text-gray-500 group-hover:text-white dark:text-gray-400'>
											{v.description}
										</span>
									)}
								</button>
							</li>
						))}
						<li className='mt-1 border-t border-gray-100 px-3 pt-2 text-[10px] tracking-wide text-gray-700 uppercase dark:border-gray-800 dark:text-gray-500'>
							Click para insertar variable
						</li>
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
