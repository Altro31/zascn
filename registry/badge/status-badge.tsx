import { CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

interface StatusBadgeProps {
	isActive: boolean;
	activeText?: string;
	inactiveText?: string;
	className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
	isActive,
	activeText = 'Verified',
	inactiveText = 'Unverified',
	className = '',
}) => {
	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
				isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
			} ${className}`}
		>
			{isActive ? (
				<CheckCircle className='mr-1 h-4 w-4' />
			) : (
				<XCircle className='mr-1 h-4 w-4' />
			)}
			{isActive ? activeText : inactiveText}
		</span>
	);
};

export default StatusBadge;
