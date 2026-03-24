import { useEffect, useRef, useState } from "react";

import * as Location from "expo-location";
import type { Region } from "react-native-maps";

import {
	type DebounceMode,
	createGeocodingCacheService,
	isDebouncedRequestCancelledError,
} from "../../../utils/geocodingCache";
import { DAKAR_DEFAULT_REGION } from "./SignupScreen.constants";
import { formatGeocodedAddress } from "./SignupScreen.helpers";
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
	const [storeLocation, setStoreLocation] = useState<StoreLocation | null>(null);
	const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
	const [locationQuery, setLocationQuery] = useState("");
	const [draftAddress, setDraftAddress] = useState("");
	const [draftCoordinates, setDraftCoordinates] = useState<DraftCoordinates>({
		latitude: DAKAR_DEFAULT_REGION.latitude,
		longitude: DAKAR_DEFAULT_REGION.longitude,
	});
	const [draftRegion, setDraftRegion] = useState<Region>(DAKAR_DEFAULT_REGION);
	const [isResolvingLocation, setIsResolvingLocation] = useState(false);
	const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
	const [locationTouched, setLocationTouched] = useState(false);
	const geocodingServiceRef = useRef(
		createGeocodingCacheService({
			ttlMs: 5 * 60 * 1000,
			maxEntries: 120,
			debounceMs: 450,
			coordinatePrecision: 5,
		}),
	);

	useEffect(() => {
		return () => {
			geocodingServiceRef.current.dispose();
		};
	}, []);

	const openLocationModal = () => {
		if (storeLocation) {
			setDraftCoordinates({
				latitude: storeLocation.latitude,
				longitude: storeLocation.longitude,
			});
			setDraftRegion({
				latitude: storeLocation.latitude,
				longitude: storeLocation.longitude,
				latitudeDelta: draftRegion.latitudeDelta,
				longitudeDelta: draftRegion.longitudeDelta,
			});
			setDraftAddress(storeLocation.address);
		}

		setLocationFeedback(null);
		setIsLocationModalVisible(true);
	};

	const closeLocationModal = () => {
		setIsLocationModalVisible(false);
	};

	const resolveAddressFromCoordinates = async (
		latitude: number,
		longitude: number,
	) => {
		setIsResolvingLocation(true);
		setLocationFeedback(null);

		setDraftCoordinates({ latitude, longitude });
		setDraftRegion((current) => ({
			...current,
			latitude,
			longitude,
		}));

		try {
			const geocoded = await geocodingServiceRef.current.reverseGeocode(
				latitude,
				longitude,
				({ latitude: lat, longitude: lng }) =>
					Location.reverseGeocodeAsync({
						latitude: lat,
						longitude: lng,
					}),
			);
			const formattedAddress = formatGeocodedAddress(geocoded[0]);

			if (formattedAddress) {
				setDraftAddress(formattedAddress);
			} else {
				setDraftAddress(`Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`);
			}
		} catch {
			setLocationFeedback(
				"Adresse non resolue automatiquement. Vous pouvez confirmer la position sur la carte.",
			);
			setDraftAddress((current) => {
				if (current.trim().length > 0) {
					return current;
				}

				return `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`;
			});
		} finally {
			setIsResolvingLocation(false);
		}
	};

	const searchLocationByQuery = async (
		query: string,
		mode: DebounceMode,
		showValidationFeedback: boolean,
	) => {
		const normalizedQuery = query.trim();
		if (normalizedQuery.length < 3) {
			if (showValidationFeedback) {
				setLocationFeedback("Saisissez au moins 3 caracteres pour rechercher.");
			}
			return;
		}

		setIsResolvingLocation(true);
		setLocationFeedback(null);

		try {
			const geocoded = await geocodingServiceRef.current.geocode(
				normalizedQuery,
				(searchQuery) => Location.geocodeAsync(searchQuery),
				mode,
			);

			if (!geocoded.length) {
				setLocationFeedback(
					"Aucun resultat trouve. Essayez avec plus de details (quartier, ville).",
				);
				return;
			}

			await resolveAddressFromCoordinates(
				geocoded[0].latitude,
				geocoded[0].longitude,
			);
		} catch (error) {
			if (isDebouncedRequestCancelledError(error)) {
				return;
			}

			setLocationFeedback("Recherche indisponible pour le moment.");
		} finally {
			setIsResolvingLocation(false);
		}
	};

	const handleUseCurrentLocation = async () => {
		setLocationFeedback(null);

		try {
			const permission = await Location.requestForegroundPermissionsAsync();
			if (permission.status !== "granted") {
				setLocationFeedback(
					"Autorisez la localisation pour utiliser votre position actuelle.",
				);
				return;
			}

			setIsResolvingLocation(true);
			const currentPosition = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});

			await resolveAddressFromCoordinates(
				currentPosition.coords.latitude,
				currentPosition.coords.longitude,
			);
		} catch {
			setLocationFeedback(
				"Impossible d'obtenir la position actuelle. Essayez la recherche manuelle.",
			);
			setIsResolvingLocation(false);
		}
	};

	const handleSearchLocation = async () => {
		await searchLocationByQuery(locationQuery, "immediate", true);
	};

	const handleLocationQueryChange = (value: string) => {
		setLocationQuery(value);

		if (!value.trim()) {
			setLocationFeedback(null);
			return;
		}

		void searchLocationByQuery(value, "debounced", false);
	};

	const handleConfirmLocation = () => {
		setStoreLocation({
			latitude: draftCoordinates.latitude,
			longitude: draftCoordinates.longitude,
			address:
				draftAddress.trim().length > 0
					? draftAddress
					: `Lat ${draftCoordinates.latitude.toFixed(6)}, Lng ${draftCoordinates.longitude.toFixed(6)}`,
		});
		setLocationTouched(false);
		closeLocationModal();
	};

	const handleMapCoordinatePick = async (latitude: number, longitude: number) => {
		await resolveAddressFromCoordinates(latitude, longitude);
	};

	const handleDraftRegionChange = (region: Region) => {
		setDraftRegion(region);
	};

	const markLocationAsRequired = () => {
		setLocationTouched(true);
		openLocationModal();
	};

	return {
		storeLocation,
		isLocationModalVisible,
		locationQuery,
		draftAddress,
		draftCoordinates,
		draftRegion,
		isResolvingLocation,
		locationFeedback,
		locationTouched,
		hasStoreLocation: Boolean(storeLocation),
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
