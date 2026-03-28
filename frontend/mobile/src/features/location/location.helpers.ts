import * as Location from 'expo-location';

export const formatGeocodedAddress = (
	address: Location.LocationGeocodedAddress | undefined,
): string => {
	if (!address) {
		return '';
	}

	const line = [address.name, address.streetNumber, address.street]
		.filter(Boolean)
		.join(' ')
		.trim();
	const locality = [address.district, address.city, address.region]
		.filter(Boolean)
		.join(', ')
		.trim();

	return [line, locality, address.country].filter(Boolean).join(' - ');
};
