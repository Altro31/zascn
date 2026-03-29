import z from 'zod';

export type IPagination = {
	page: number;
	pageSize: number;
};

export type IQueryable = {
	search?: string;
	sortBy?: string;
	isDescending?: boolean;
	pagination?: IPagination;
	properties?: string[];
} & Record<string, unknown>;

export const SearchParams = z
	.looseObject({
		search: z.string(),
		sortBy: z.string(),
		isDescending: z.coerce.boolean(),
		page: z.coerce.number(),
		pageSize: z.coerce.number(),
	})
	.partial();
export type SearchParams = z.infer<typeof SearchParams>;

export interface CustomApiError {
	title?: string;
	status: number;
	detail?: string;
}

export class ApiError extends Error {
	title: string;

	status: number;

	detail: string;

	constructor(error: CustomApiError & object) {
		super();
		this.title = error.title ?? '';
		this.status = error.status;
		this.detail = error.detail ?? '';
	}

	toString() {
		return `${this.title} - ${this.status} - ${this.detail.toString()}`;
	}
}

export type ApiResponse<T> = {
	data?: T;
	error: boolean;
	status: number;
	message?: string;
} & CustomApiError;

export type ApiStatusResponse = {
	status: number;
};

export interface PaginationParams {
	page?: number;
	pageSize?: number;
}

export interface SortingParams {
	sortBy?: string;
	isDescending?: boolean;
}

export interface PaginatedRequest
	extends PaginationParams, SortingParams, SearchParams {}

export interface PaginatedResponse<T> {
	data: T[];
	totalCount: number;
	page: number;
	pageSize: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface Attributes {
	[key: string]: string;
}
