import { useEffect, useRef, useState } from 'react';

export default function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const handler = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (handler.current) clearTimeout(handler.current);
		handler.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			if (handler.current) clearTimeout(handler.current);
		};
	}, [value, delay]);

	return debouncedValue;
}
