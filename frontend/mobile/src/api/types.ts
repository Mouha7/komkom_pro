export type JsonServerPage<T> = {
	first: number;
	prev: number | null;
	next: number | null;
	last: number;
	pages: number;
	items: number;
	data: T[];
};

export const extractPageData = <T>(payload: JsonServerPage<T> | T[]): T[] => {
	if (Array.isArray(payload)) {
		return payload;
	}

	if (payload && Array.isArray(payload.data)) {
		return payload.data;
	}

	return [];
};
