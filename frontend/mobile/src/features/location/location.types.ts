import type { Region } from 'react-native-maps';

export interface GeoCoordinates {
	latitude: number;
	longitude: number;
}

export interface PickedLocation extends GeoCoordinates {
	address: string;
}

export interface LocationPickerState {
	pickedLocation: PickedLocation | null;
	isModalVisible: boolean;
	locationQuery: string;
	draftAddress: string;
	draftCoordinates: GeoCoordinates;
	draftRegion: Region;
	isResolvingLocation: boolean;
	locationFeedback: string | null;
	locationTouched: boolean;
}
