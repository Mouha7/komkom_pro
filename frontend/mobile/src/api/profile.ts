import { appConfig } from '../config';
import type {
	StoreProfileModel,
	StoreProfileUpdatePayload,
} from '../mocks/profile';
import mockServiceApi from '../mocks/mockService';
import { buildApiUrl, getJson, HttpError, NetworkError } from './httpClient';

const isMockMode = (): boolean => {
	const base = appConfig.apiBaseUrl;
	return base.includes('localhost') || base.includes('127.0.0.1');
};

export const getStoreProfile = async (
	userId: string,
): Promise<StoreProfileModel> => {
	return getJson<StoreProfileModel>(`/api/v1/profile/${userId}`);
};

export const updateStoreProfile = async (
	userId: string,
	payload: StoreProfileUpdatePayload,
): Promise<StoreProfileModel> => {
	if (isMockMode()) {
		const profile = await mockServiceApi.updateStoreProfile(userId, payload);
		if (!profile) {
			throw new HttpError(404, `Profile not found: ${userId}`);
		}
		return profile;
	}

	const requestUrl = buildApiUrl(`/api/v1/profile/${userId}`);
	let response: Response;

	try {
		response = await fetch(requestUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(payload),
		});
	} catch (error) {
		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.warn('[api] Profile update network request failed', {
				requestUrl,
				error,
			});
		}

		throw new NetworkError(
			requestUrl,
			`Network request failed for ${requestUrl}`,
		);
	}

	if (!response.ok) {
		throw new HttpError(
			response.status,
			`Request failed with status ${response.status} for ${requestUrl}`,
		);
	}

	return (await response.json()) as StoreProfileModel;
};
