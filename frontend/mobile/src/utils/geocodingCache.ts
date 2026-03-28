export type DebounceMode = "immediate" | "debounced";

export interface GeocodingCacheServiceOptions {
	ttlMs?: number;
	maxEntries?: number;
	debounceMs?: number;
	coordinatePrecision?: number;
}

interface CacheEntry<T> {
	value: T[];
	expiresAt: number;
	lastAccessedAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 80;
const DEFAULT_DEBOUNCE_MS = 450;
const DEFAULT_COORDINATE_PRECISION = 5;
const DEBOUNCED_REQUEST_CANCELLED = "DEBOUNCED_REQUEST_CANCELLED";

const createDebouncedRequestCancelledError = (): Error => {
	const error = new Error(DEBOUNCED_REQUEST_CANCELLED);
	error.name = DEBOUNCED_REQUEST_CANCELLED;
	return error;
};

const normalizeQuery = (query: string): string =>
	query.trim().replace(/\s+/g, " ").toLowerCase();

const toCoordinateKey = (
	latitude: number,
	longitude: number,
	precision: number,
): string => {
	const factor = 10 ** precision;
	const normalizedLatitude = Math.round(latitude * factor) / factor;
	const normalizedLongitude = Math.round(longitude * factor) / factor;
	return `${normalizedLatitude}:${normalizedLongitude}`;
};

const pruneOldestEntry = <T>(cache: Map<string, CacheEntry<T>>): void => {
	if (cache.size === 0) {
		return;
	}

	let oldestKey: string | undefined;
	let oldestAccess = Number.POSITIVE_INFINITY;

	for (const [key, entry] of cache.entries()) {
		if (entry.lastAccessedAt < oldestAccess) {
			oldestAccess = entry.lastAccessedAt;
			oldestKey = key;
		}
	}

	if (oldestKey) {
		cache.delete(oldestKey);
	}
};

const getFromCache = <T>(
	cache: Map<string, CacheEntry<T>>,
	key: string,
): T[] | null => {
	const entry = cache.get(key);
	if (!entry) {
		return null;
	}

	if (entry.expiresAt <= Date.now()) {
		cache.delete(key);
		return null;
	}

	entry.lastAccessedAt = Date.now();
	return entry.value;
};

const setInCache = <T>(
	cache: Map<string, CacheEntry<T>>,
	key: string,
	value: T[],
	ttlMs: number,
	maxEntries: number,
): void => {
	cache.set(key, {
		value,
		expiresAt: Date.now() + ttlMs,
		lastAccessedAt: Date.now(),
	});

	while (cache.size > maxEntries) {
		pruneOldestEntry(cache);
	}
};

export const isDebouncedRequestCancelledError = (error: unknown): boolean => {
	return (
		error instanceof Error &&
		(error.name === DEBOUNCED_REQUEST_CANCELLED ||
			error.message === DEBOUNCED_REQUEST_CANCELLED)
	);
};

export const createGeocodingCacheService = (
	options: GeocodingCacheServiceOptions = {},
) => {
	const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
	const maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
	const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
	const coordinatePrecision =
		options.coordinatePrecision ?? DEFAULT_COORDINATE_PRECISION;

	const geocodeCache = new Map<string, CacheEntry<unknown>>();
	const reverseGeocodeCache = new Map<string, CacheEntry<unknown>>();

	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let pendingDebounceReject: ((reason?: unknown) => void) | null = null;

	const runDebounced = <T>(task: () => Promise<T>): Promise<T> => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		if (pendingDebounceReject) {
			pendingDebounceReject(createDebouncedRequestCancelledError());
			pendingDebounceReject = null;
		}

		return new Promise<T>((resolve, reject) => {
			pendingDebounceReject = reject;
			debounceTimer = setTimeout(async () => {
				debounceTimer = null;
				pendingDebounceReject = null;

				try {
					resolve(await task());
				} catch (error) {
					reject(error);
				}
			}, debounceMs);
		});
	};

	const geocode = async <T>(
		query: string,
		fetcher: (normalizedQuery: string) => Promise<T[]>,
		mode: DebounceMode = "immediate",
	): Promise<T[]> => {
		const normalizedQuery = normalizeQuery(query);
		if (!normalizedQuery) {
			return [];
		}

		const cachedResult = getFromCache(geocodeCache as Map<string, CacheEntry<T>>, normalizedQuery);
		if (cachedResult) {
			return cachedResult;
		}

		const fetchAndCache = async (): Promise<T[]> => {
			const result = await fetcher(normalizedQuery);
			setInCache(
				geocodeCache as Map<string, CacheEntry<T>>,
				normalizedQuery,
				result,
				ttlMs,
				maxEntries,
			);
			return result;
		};

		if (mode === "debounced") {
			return runDebounced(fetchAndCache);
		}

		return fetchAndCache();
	};

	const reverseGeocode = async <T>(
		latitude: number,
		longitude: number,
		fetcher: (coords: { latitude: number; longitude: number }) => Promise<T[]>,
	): Promise<T[]> => {
		const cacheKey = toCoordinateKey(latitude, longitude, coordinatePrecision);
		const cachedResult = getFromCache(
			reverseGeocodeCache as Map<string, CacheEntry<T>>,
			cacheKey,
		);
		if (cachedResult) {
			return cachedResult;
		}

		const result = await fetcher({ latitude, longitude });
		setInCache(
			reverseGeocodeCache as Map<string, CacheEntry<T>>,
			cacheKey,
			result,
			ttlMs,
			maxEntries,
		);

		return result;
	};

	const clear = (): void => {
		geocodeCache.clear();
		reverseGeocodeCache.clear();
	};

	const dispose = (): void => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
		if (pendingDebounceReject) {
			pendingDebounceReject(createDebouncedRequestCancelledError());
			pendingDebounceReject = null;
		}
		clear();
	};

	return {
		geocode,
		reverseGeocode,
		clear,
		dispose,
	};
};
