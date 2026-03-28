import type { Region } from 'react-native-maps';

import { DAKAR_DEFAULT_REGION as DEFAULT_DAKAR_DEFAULT_REGION } from '../../constants';

export const DAKAR_DEFAULT_REGION: Region = {
	...DEFAULT_DAKAR_DEFAULT_REGION,
};

export const GEOLOCATION_CACHE_TTL_MS = 5 * 60 * 1000;
export const GEOLOCATION_CACHE_MAX_ENTRIES = 120;
export const GEOLOCATION_DEBOUNCE_MS = 450;
export const GEOLOCATION_COORDINATE_PRECISION = 5;
