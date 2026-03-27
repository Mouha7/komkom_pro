import { appConfig } from '../config';

export class HttpError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'HttpError';
		this.status = status;
	}
}

export class NetworkError extends Error {
	readonly url: string;

	constructor(url: string, message: string) {
		super(message);
		this.name = 'NetworkError';
		this.url = url;
	}
}

export const buildApiUrl = (path: string): string => {
	const base = appConfig.apiBaseUrl.replace(/\/$/, '');
	const nextPath = path.startsWith('/') ? path : `/${path}`;
	return `${base}${nextPath}`;
};

export const getJson = async <T>(path: string): Promise<T> => {
	const requestUrl = buildApiUrl(path);
	let response: Response;

	try {
		response = await fetch(requestUrl, {
			headers: {
				Accept: 'application/json',
			},
		});
	} catch (error) {
		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.warn('[api] Network request failed', { requestUrl, error });
		}

		const localhostHint =
			requestUrl.includes('://localhost:') || requestUrl.includes('://127.0.0.1:')
				? ' If you are on a physical device, use LAN IP or EXPO_PUBLIC_API_TUNNEL_BASE_URL (ngrok).' 
				: '';

		throw new NetworkError(requestUrl, `Network request failed for ${requestUrl}.${localhostHint}`.trim());
	}

	if (!response.ok) {
		throw new HttpError(response.status, `Request failed with status ${response.status} for ${requestUrl}`);
	}

	return (await response.json()) as T;
};
