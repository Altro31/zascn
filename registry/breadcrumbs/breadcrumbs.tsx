import React from 'react';
import { useRouter } from 'next/navigation';

export interface BreadcrumbItem {
	label: string;
	onClick?: () => void;
	linkTo?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
	className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
	const router = useRouter();
	return (
		<ol
			className={`dark:text-white-dark flex font-semibold text-gray-500 ${className || ''}`}
		>
			{items.map((item, index) => {
				const Comp = item.linkTo === undefined ? 'button' : 'a';
				// Intermediate: any except first and last
				const isIntermediate =
					index > 0 && index < items.length - 1 && item.linkTo;
				// Penultimate: if there are 4+ items, index === items.length - 2
				const isPenultimate =
					items.length >= 4 && index === items.length - 2 && item.linkTo;
				const handleClick = (e: React.MouseEvent) => {
					if (isIntermediate || isPenultimate) {
						e.preventDefault();
						router.back();
					} else if (item.onClick) {
						item.onClick();
					}
				};
				return (
					<li
						key={index}
						className={
							index !== 0
								? "dark:before:text-white-dark before:px-1.5 before:text-gray-500 before:content-['/']"
								: ''
						}
					>
						<Comp
							{...(Comp === 'button'
								? { type: 'button' }
								: { href: item.linkTo })}
							onClick={handleClick}
							className={`text-black dark:text-white ${index !== 0 ? 'dark:hover:text-white-light/70 hover:text-black/70' : ''}`}
						>
							{item.label}
						</Comp>
					</li>
				);
			})}
		</ol>
	);
};

export default Breadcrumb;
