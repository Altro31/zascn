import type { MantineSize, PaginationProps, TextProps } from '@mantine/core';
import type { JSX } from 'react';

export type DataTablePageSizeSelectorProps =
	| {
			onRecordsPerPageChange?: never;
			recordsPerPageOptions?: never;
			recordsPerPageLabel?: never;
	  }
	| {
			/**
			 * Callback fired a new page size is selected.
			 * Receives new page size as argument.
			 */
			onRecordsPerPageChange: (recordsPerPage: number) => void;

			/**
			 * Array of page sizes (numbers) to show in records per page selector.
			 */
			recordsPerPageOptions: number[];

			/**
			 * Label for records per page selector.
			 */
			recordsPerPageLabel?: string;
	  };

export type PaginationRenderContext = {
	state: {
		paginationSize: MantineSize;
		page: number;
		totalPages: number;
		totalRecords: number | undefined;
		recordsPerPage: number | undefined;
		recordsLength: number | undefined;
		fetching: boolean | undefined;
		from?: number;
		to?: number;
		isWrapped: boolean;
	};
	actions: {
		setPage: (page: number) => void;
		setRecordsPerPage?: (n: number) => void;
	};
	Controls: {
		Text: (props?: Partial<TextProps>) => JSX.Element;
		PageSizeSelector: (
			props?: Partial<DataTablePageSizeSelectorProps>,
		) => JSX.Element;
		Pagination: (props?: Partial<PaginationProps>) => JSX.Element;
	};
};
