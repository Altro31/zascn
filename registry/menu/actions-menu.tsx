import { ActionIcon, Menu } from '@mantine/core';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import DeleteDialog from '../modal/delete-modal';
import { cn } from '@/lib/utils';

// Definir el tipo de acción reutilizable
export interface ActionItem {
	key: string;
	label: string;
	icon: React.ReactNode;
	onClick?: () => void;
	danger?: boolean;
	disabled?: boolean;
	disabledReason?: string;
	visible?: boolean;
	dividerBefore?: boolean;
	dividerAfter?: boolean;
}

// Props ahora es solo un array de acciones, y props opcionales para el estado de eliminar
export interface ActionsMenuProps {
	actions: ActionItem[];
	deleteDialogProps?: {
		onConfirm: () => Promise<void> | void;
		loading?: boolean;
		open?: boolean;
		onClose: () => void;
	};
	renderTarget?: React.ReactNode; // Permite custom trigger
}

export const DEFAULT_ICON_SIZE = 'h-4 w-4';

const ActionsMenu = ({
	actions,
	deleteDialogProps,
	renderTarget,
}: ActionsMenuProps) => {
	// Soporte local para el modal de eliminar si es necesario
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pendingAction, setPendingAction] = useState<
		(() => Promise<void> | void) | null
	>(null);

	// Si deleteDialogProps está presente, necesitamos controlar el modal de eliminar
	const handleDelete = async () => {
		const fn = pendingAction ?? deleteDialogProps?.onConfirm;
		if (!fn) {
			setDeleteDialogOpen(false);
			setPendingAction(null);
			return;
		}

		setLoading(true);
		try {
			await fn();
		} catch (error) {
			console.error('Error executing confirm action:', error);
		} finally {
			setLoading(false);
			setDeleteDialogOpen(false);
			setPendingAction(null);
			if (deleteDialogProps?.onClose) deleteDialogProps.onClose();
		}
	};

	// Renderizar acciones, respetando dividers y visibilidad
	const renderActions = () => {
		const items: React.ReactNode[] = [];
		actions.forEach((action) => {
			if (action.visible === false) return;
			if (action.dividerBefore)
				items.push(<Menu.Divider key={`before-${action.key}`} />);
			items.push(
				<Menu.Item
					key={action.key}
					className={cn(
						'flex items-center gap-1 rounded-md p-1 text-sm',
						action.danger ? 'hover:bg-red-500!' : 'hover:text-white!',
						action.disabled && 'opacity-60',
					)}
					leftSection={action.icon}
					onClick={(e) => {
						if (action.disabled) return;
						e.preventDefault();
						e.stopPropagation(); // Evitar que el menú se cierre automáticamente
						const isConfirm =
							action.key.toLowerCase().includes('delete') ||
							action.key.toLowerCase().includes('deactive');
						if (isConfirm) {
							if (action.onClick) {
								setPendingAction(() => action.onClick as () => void);
							} else if (deleteDialogProps?.onConfirm) {
								setPendingAction(
									() => deleteDialogProps.onConfirm as () => void,
								);
							} else {
								setPendingAction(null);
							}
							setDeleteDialogOpen(true);
							return;
						}
						// Normal action - execute immediately
						action.onClick?.();
					}}
					disabled={action.disabled}
					title={action.disabled ? action.disabledReason : undefined}
				>
					{action.label}
				</Menu.Item>,
			);
			if (action.dividerAfter)
				items.push(<Menu.Divider key={`after-${action.key}`} />);
		});
		return items;
	};

	return (
		<>
			<Menu
				shadow='lg'
				width={200}
			>
				<Menu.Target>
					<div
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						{renderTarget ? (
							renderTarget
						) : (
							<ActionIcon
								variant='subtle'
								size='sm'
							>
								<MoreHorizontal className='h-5 w-5' />
							</ActionIcon>
						)}
					</div>
				</Menu.Target>
				<Menu.Dropdown className='space-y-2 rounded-md border border-gray-200! bg-white! p-2 text-gray-700! dark:border-gray-700! dark:bg-black!'>
					<Menu.Label className='ml-1'>Opciones</Menu.Label>
					{renderActions()}
				</Menu.Dropdown>
			</Menu>

			<DeleteDialog
				onClose={
					deleteDialogProps?.onClose || (() => setDeleteDialogOpen(false))
				}
				onConfirm={deleteDialogProps?.onConfirm || handleDelete}
				loading={deleteDialogProps?.loading ?? loading}
				open={deleteDialogProps?.open ?? deleteDialogOpen}
			/>
		</>
	);
};

export default ActionsMenu;
