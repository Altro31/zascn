import type { PaginatedResponse, SearchParams } from '@/lib/types';
import { DataTableColumn } from 'mantine-datatable';

export type DataGridFilterTab = {
	key: string;
	title: string;
	onClick: () => void;
	count?: number | string;
	icon?: React.ReactNode;
	disabled?: boolean;
	className?: string;
};

export interface DataGridFilterTabsOptions {
	variant?: 'underline' | 'pill' | 'soft';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

export interface DataGridProps<T> {
	data?: PaginatedResponse<T>;
	simpleData?: T[]; // For simple data without pagination
	columns: DataTableColumn<T>[];
	// Estado de carga externo (por ejemplo, cuando los datos vienen de React Query)
	loading?: boolean;
	searchParams?: SearchParams;
	onSearchParamsChange?: (params: SearchParams) => void;
	onRowClick?: ({ record, index }: { record: T; index?: number }) => void;
	// Optional row-level className resolver
	getRowClassName?: (record: T) => string;
	searchPlaceholder?: string;
	enableSearch?: boolean;
	enablePagination?: boolean;
	enableSorting?: boolean;
	enableColumnToggle?: boolean; // New prop for column visibility toggle
	enableRowSelection?: boolean; // Enable built-in row selection (checkboxes)
	minHeight?: number;
	className?: string;
	emptyText?: string;
	onCreate?: () => void;
	createLoading?: boolean; // Optional prop for create button loading state
	createText?: string; // Optional prop for create button text
	// Props for additional components
	leftActions?: React.ReactNode;
	rightActions?: React.ReactNode;
	customActions?: React.ReactNode;
	// Tabs/filters area
	filterTabs?: DataGridFilterTab[];
	filterTabsOptions?: DataGridFilterTabsOptions;
	defaultActiveFilterKey?: string;
	activeFilterKey?: string;
	onFilterTabChange?: (key: string) => void;
	// Optional controlled search: parent can provide a search value and handler
	searchValueOverride?: string;
	onSearchChangeOverride?: (value: string) => void;
	searchProperties: (keyof T & any)[];
	// When true, search filters simpleData locally instead of updating searchParams
	enableLocalSearch?: boolean;
	// Bulk selection action (renders button when any row is selected)
	bulkAction?: {
		label: string;
		onClick: (selected: T[]) => Promise<void> | void;
		className?: string;
		disabled?: boolean;
		loading?: boolean;
	};
	selectAllLabel?: string; // Label for "select all visible" button
	excludeRowFromSelection?: (record: T) => boolean; // Function to determine if a row should be excluded from selection
	// Accessors of columns that should NOT trigger onRowClick when clicked
	ignoreRowClickAccessors?: string[];
}

export interface ColumnSelectorProps<T> {
	columns: DataTableColumn<T>[];
	hiddenColumns: string[];
	onToggleColumn: (columnAccessor: string) => void;
	isOpen: boolean;
	onToggle: () => void;
}
