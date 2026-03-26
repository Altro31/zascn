import SimpleModal from './modal';

interface DeleteDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	warningMessage?: string;
	loading?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
	open,
	onClose,
	onConfirm,
	title = '¿Estás seguro de que quieres eliminar?',
	description = 'Esta acción eliminará permanentemente el elemento.',
	warningMessage,
	loading,
}) => {
	return (
			<SimpleModal
				onClose={onClose}
				open={open}
				title={title}
				className='max-w-xl'
			>
				<div className='space-y-4'>
					<p className='text-gray-700 dark:text-gray-200'>{description}</p>
					{warningMessage && (
						<div className='rounded border border-red-200 bg-red-50 p-3'>
							<p className='text-sm text-red-800'>{warningMessage}</p>
						</div>
					)}
					<div className='flex justify-end space-x-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							disabled={loading}
							className='rounded border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50'
						>
							Cancelar
						</button>
						<button
							type='button'
							onClick={onConfirm}
							disabled={loading}
							className='bg-danger rounded px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50'
						>
							{loading ? 'Eliminando...' : 'Eliminar'}
						</button>
					</div>
				</div>
			</SimpleModal>
	);
};

export default DeleteDialog;
