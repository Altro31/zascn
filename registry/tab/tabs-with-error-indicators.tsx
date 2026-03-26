'use client';

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { AlertCircle } from 'lucide-react';
import React, { Fragment, ReactNode, useEffect, useState } from 'react';

type TabItem = {
	label: string;
	icon?: ReactNode;
	content: ReactNode;
	disabled?: boolean;
	hasErrors?: boolean;
	errorCount?: number;
};

type TabsWithIconsProps = {
	tabs: TabItem[];
	activeColorClass?: string;
	handleChange?: (index: number) => void;
	readonly?: boolean;
};

const TabsWithErrorIndicators: React.FC<TabsWithIconsProps> = ({
	tabs,
	activeColorClass = 'bg-primary text-white',
	handleChange,
	readonly = false,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<div className='mb-5'>
			<TabGroup onChange={handleChange}>
				<TabList className='mt-3 flex flex-wrap gap-2'>
					{tabs.map((tab, index) =>
						tab.disabled ? (
							<Tab
								key={index}
								className='text-textColor pointer-events-none -mb-[1px] flex items-center p-3.5 py-2 dark:text-white'
							>
								{tab.icon && tab.icon}
								{tab.label}
							</Tab>
						) : (
							<Tab
								as={Fragment}
								key={index}
							>
								{({ selected }) => (
									<button
										className={`${
											selected
												? `${activeColorClass} text-textColor !outline-none dark:text-white`
												: tab.hasErrors && !readonly
													? 'border-red-300 text-red-700'
													: 'text-textColor dark:text-white'
										} relative -mb-[1px] flex items-center rounded p-3.5 py-2 transition-colors duration-700`}
									>
										<span className='ltr:mr-2 rtl:ml-2'>{tab.icon}</span>
										{tab.label}
										{tab.hasErrors && !readonly && (
											<div className='ml-2 flex items-center gap-1'>
												<AlertCircle className='h-4 w-4 text-red-500' />
												{tab.errorCount && tab.errorCount > 0 && (
													<span className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white'>
														{tab.errorCount}
													</span>
												)}
											</div>
										)}
									</button>
								)}
							</Tab>
						),
					)}
				</TabList>
				<TabPanels>
					{tabs.map((tab, index) => (
						<TabPanel key={index}>
							<div className='pt-5'>{tab.content}</div>
						</TabPanel>
					))}
				</TabPanels>
			</TabGroup>
		</div>
	);
};

export default TabsWithErrorIndicators;
