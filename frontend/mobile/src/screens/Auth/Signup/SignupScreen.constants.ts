import type { Region } from "react-native-maps";

export const SENEGAL_COUNTRY_CODE = "+221";
export const SENEGAL_LOCAL_DIGITS = 9;

export const COMMON_PASSWORD_PATTERNS = [
	/^password$/i,
	/^password\d+$/i,
	/^123456(?:78|789)?$/,
	/^qwerty(?:123)?$/i,
	/^azerty(?:123)?$/i,
	/^admin(?:123)?$/i,
	/^komkom(?:123)?$/i,
];

export const DAKAR_DEFAULT_REGION: Region = {
	latitude: 14.7167,
	longitude: -17.4677,
	latitudeDelta: 0.06,
	longitudeDelta: 0.06,
};
