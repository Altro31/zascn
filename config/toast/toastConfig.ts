'use client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export type ToastType = 'success' | 'error' | 'info' | 'warning';
interface ToastConfig {
	position?:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right';
	autoClose?: number;
	hideProgressBar?: boolean;
	closeOnClick?: boolean;
	pauseOnHover?: boolean;
	draggable?: boolean;
	progress?: number;
	theme?: 'light' | 'dark';
	transition?: any;
}

const defaultToastConfig: ToastConfig = {
	position: 'bottom-right',
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: 'light',
	transition: undefined,
};

const showToast = (
	message: string,
	type: ToastType,
	config: ToastConfig = {},
) => {
	const finalConfig = { ...defaultToastConfig, ...config };
	switch (type) {
		case 'success':
			toast.success(message, finalConfig);
			break;
		case 'error':
			toast.error(message, finalConfig);
			break;
		case 'info':
			toast.info(message, finalConfig);
			break;
		case 'warning':
			toast.warn(message, finalConfig);
			break;
		default:
			toast(message, finalConfig);
	}
};

export default showToast;
