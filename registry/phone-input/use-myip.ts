import {
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query';

export interface MyIpFlag {
	img: string;
	emoji: string;
	emoji_unicode: string;
}

export interface MyIpConnection {
	asn: number;
	org: string;
	isp: string;
	domain: string;
}

export interface MyIpTimezone {
	id: string;
	abbr: string;
	is_dst: boolean;
	offset: number;
	utc: string;
	current_time: string;
}

export interface MyIpResponse {
	About_Us: string;
	ip: string;
	success: boolean;
	type: string;
	continent: string;
	continent_code: string;
	country: string;
	country_code: string;
	region: string;
	region_code: string;
	city: string;
	latitude: number;
	longitude: number;
	is_eu: boolean;
	postal: string;
	calling_code: string;
	capital: string;
	borders: string;
	flag: MyIpFlag;
	connection: MyIpConnection;
	timezone: MyIpTimezone;
}

// In-memory singleton cache to avoid duplicate fetches (e.g., React StrictMode double mounts)
let myIpCache: MyIpResponse | null = null;
let myIpPromise: Promise<MyIpResponse> | null = null;

async function fetchMyIpRaw(): Promise<MyIpResponse> {
	const res = await fetch('https://ipwho.is/', { cache: 'no-store' });
	if (!res.ok) throw new Error('Network error');
	const data: MyIpResponse = await res.json();
	if (!data.success) throw new Error('Lookup failed');
	return data;
}

// Cached fetch that ignores external AbortSignal to prevent premature cancellation in StrictMode.
function fetchMyIpCached(): Promise<MyIpResponse> {
	if (myIpCache) return Promise.resolve(myIpCache);
	if (myIpPromise) return myIpPromise;
	myIpPromise = fetchMyIpRaw()
		.then((data) => {
			myIpCache = data;
			return data;
		})
		.finally(() => {
			myIpPromise = null; // allow refresh later if needed
		});
	return myIpPromise;
}

export const useMyIp = (
	options?: Omit<UseQueryOptions<MyIpResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
	return useQuery<MyIpResponse, Error>({
		queryKey: ['my-ip'],
		// Do not pass the signal to the cached fetch to avoid abort races
		queryFn: () => fetchMyIpCached(),
		// Provide initialData if already fetched (instant synchronous availability)
		initialData: myIpCache ?? undefined,
		staleTime: 1000 * 60 * 10,
		gcTime: 1000 * 60 * 30,
		retry: 1,
		...options,
	});
};
export const usePrefetchMyIp = () => {
	// IMPORTANT: don't destructure prefetchQuery; it relies on 'this' internally.
	const queryClient = useQueryClient();
	return async () => {
		await queryClient.prefetchQuery({
			queryKey: ['my-ip'],
			queryFn: () => fetchMyIpCached(),
		});
	};
};

// Ejemplo:
// const { data, isLoading, error } = useMyIp();
