import React from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';

interface SweetAlertProps {
	title?: string;
	text?: string;
	icon?: SweetAlertIcon;
	confirmButtonText?: string;
	cancelButtonText?: string;
	className?: string;
	buttonText?: string;
	onConfirm?: () => void;
	children?: React.ReactNode;
}

const SweetAlert: React.FC<SweetAlertProps> = ({
	title = 'Are you sure?',
	text = 'This action cannot be undone!',
	icon = 'warning',
	confirmButtonText = 'Confirm',
	cancelButtonText = 'Cancel',
	className = '',
	buttonText,
	onConfirm,
	children,
}) => {
	const showAlert = async () => {
		const result = await Swal.fire({
			title,
			text,
			icon,
			showCancelButton: true,
			confirmButtonText,
			cancelButtonText,
			padding: '2em',
			customClass: { popup: 'sweet-alerts' },
		});

		if (result.isConfirmed && onConfirm) {
			onConfirm();
			await Swal.fire({
				title: 'Success',
				text: 'Action completed successfully',
				icon: 'success',
				customClass: { popup: 'sweet-alerts' },
			});
		}
	};

	return (
		<div className={`mb-5 ${className}`}>
			{buttonText && (
				<div className='flex items-center justify-center'>
					<button
						type='button'
						className='btn btn-danger'
						onClick={showAlert}
					>
						{buttonText}
					</button>
				</div>
			)}
			{children}
		</div>
	);
};

export default SweetAlert;
