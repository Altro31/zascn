interface Props {
	isEnabled: boolean;
	isLoading?: boolean;
	onToggle: () => void;
}
const ToggleSwitch = ({ isEnabled, isLoading = false, onToggle }: Props) => {
	return (
		<button
			type='button'
			role='switch'
			aria-checked={isEnabled}
			aria-busy={isLoading}
			aria-disabled={isLoading}
			disabled={isLoading}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				if (isLoading) return;
				onToggle();
			}}
			className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900 ${
				isEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
			} ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
		>
			<span
				className={`pointer-events-none relative inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
			>
				{isLoading ? (
					<span className='h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent' />
				) : (
					<svg
						className={`h-3 w-3 text-blue-500 transition-all duration-200 ${
							isEnabled ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
						}`}
						fill='none'
						stroke='currentColor'
						strokeWidth='3'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M5 13l4 4L19 7'
						/>
					</svg>
				)}
			</span>
		</button>
	);
};

export default ToggleSwitch;
