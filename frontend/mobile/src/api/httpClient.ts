import { appConfig } from '../config';

export class HttpError extends Error {
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = 'HttpError';
		this.status = status;
	}
}

export const buildApiUrl = (path: string): string => {
	const base = appConfig.apiBaseUrl.replace(/\/$/, '');
	const nextPath = path.startsWith('/') ? path : `/${path}`;
	return `${base}${nextPath}`;
};

export const getJson = async <T>(path: string): Promise<T> => {
	const response = await fetch(buildApiUrl(path), {
		headers: {
			Accept: 'application/json',
		},
	});

	if (!response.ok) {
		throw new HttpError(response.status, `Request failed with status ${response.status}`);
	}

	return (await response.json()) as T;
};
