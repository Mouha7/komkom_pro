import { getJson } from './httpClient';

export type DevApiV1 = {
	products: unknown[];
	catalog: {
		categories: unknown[];
	};
	home: {
		categories: unknown[];
		promos: unknown[];
	};
	cart: unknown[];
	orders: unknown[];
	notifications: unknown[];
};

type DevApiRoot = {
	v1: DevApiV1;
};

export const getDevApiV1 = async (): Promise<DevApiV1> => {
	const payload = await getJson<DevApiRoot>('/api');
	return payload.v1;
};
