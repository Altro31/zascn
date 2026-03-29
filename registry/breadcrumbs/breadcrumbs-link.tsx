import React from 'react';
import Link from 'next/link';

type BreadcrumbItem = {
	label: string;
	href?: string;
};

type BreadcrumbLinksProps = {
	items: BreadcrumbItem[];
};

const BreadcrumbLinks: React.FC<BreadcrumbLinksProps> = ({ items }) => {
	return (
		<div className='panel py-3!'>
			<nav
				className='flex'
				aria-label='Breadcrumb'
			>
				<ol className='inline-flex items-center space-x-1 md:space-x-3'>
					{items.map((item, idx) => (
						<li
							key={idx}
							className='inline-flex items-center'
						>
							{item.href ? (
								<Link
									href={item.href}
									className='hover:text-primary inline-flex items-center text-gray-700'
								>
									{item.label}
								</Link>
							) : (
								<div className='flex items-center'>
									<svg
										className='h-6 w-6 text-gray-400'
										fill='currentColor'
										viewBox='0 0 20 20'
									>
										<path
											fillRule='evenodd'
											d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
											clipRule='evenodd'
										></path>
									</svg>
									<span className='ml-1 text-sm font-medium text-gray-500 md:ml-2'>
										{item.label}
									</span>
								</div>
							)}
						</li>
					))}
				</ol>
			</nav>
		</div>
	);
};

export default BreadcrumbLinks;
