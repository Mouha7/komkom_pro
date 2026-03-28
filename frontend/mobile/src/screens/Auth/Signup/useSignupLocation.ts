import type { Region } from "react-native-maps";

import {
	DAKAR_DEFAULT_REGION,
	useLocationPicker,
} from "../../../features/location";
import type { DraftCoordinates, StoreLocation } from "./SignupScreen.types";

interface UseSignupLocationResult {
	storeLocation: StoreLocation | null;
	isLocationModalVisible: boolean;
	locationQuery: string;
	draftAddress: string;
	draftCoordinates: DraftCoordinates;
	draftRegion: Region;
	isResolvingLocation: boolean;
	locationFeedback: string | null;
	locationTouched: boolean;
	hasStoreLocation: boolean;
	openLocationModal: () => void;
	closeLocationModal: () => void;
	handleUseCurrentLocation: () => Promise<void>;
	handleSearchLocation: () => Promise<void>;
	handleLocationQueryChange: (value: string) => void;
	handleConfirmLocation: () => void;
	handleMapCoordinatePick: (latitude: number, longitude: number) => Promise<void>;
	handleDraftRegionChange: (region: Region) => void;
	markLocationAsRequired: () => void;
}

export const useSignupLocation = (): UseSignupLocationResult => {
	const {
		pickedLocation,
		isLocationModalVisible,
		locationQuery,
		draftAddress,
		draftCoordinates,
		draftRegion,
		isResolvingLocation,
		locationFeedback,
		locationTouched,
		hasPickedLocation,
		openLocationModal,
		closeLocationModal,
		handleUseCurrentLocation,
		handleSearchLocation,
		handleLocationQueryChange,
		handleConfirmLocation,
		handleMapCoordinatePick,
		handleDraftRegionChange,
		markLocationAsRequired,
	} = useLocationPicker({
		initialRegion: DAKAR_DEFAULT_REGION,
	});

	return {
		storeLocation: pickedLocation as StoreLocation | null,
		isLocationModalVisible,
		locationQuery,
		draftAddress,
		draftCoordinates: draftCoordinates as DraftCoordinates,
		draftRegion,
		isResolvingLocation,
		locationFeedback,
		locationTouched,
		hasStoreLocation: hasPickedLocation,
		openLocationModal,
		closeLocationModal,
		handleUseCurrentLocation,
		handleSearchLocation,
		handleLocationQueryChange,
		handleConfirmLocation,
		handleMapCoordinatePick,
		handleDraftRegionChange,
		markLocationAsRequired,
	};
};
