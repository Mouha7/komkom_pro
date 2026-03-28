import React from "react";

import { LocationPickerModal as SharedLocationPickerModal } from "../../../features/location";
import type { GeoCoordinates } from "../../../features/location";
import type { DraftCoordinates } from "./SignupScreen.types";
import type { Region } from "react-native-maps";

interface LocationPickerModalProps {
	visible: boolean;
	locationQuery: string;
	draftAddress: string;
	draftCoordinates: DraftCoordinates;
	draftRegion: Region;
	isResolvingLocation: boolean;
	locationFeedback: string | null;
	onClose: () => void;
	onSearch: () => Promise<void>;
	onQueryChange: (value: string) => void;
	onUseCurrentLocation: () => Promise<void>;
	onConfirmLocation: () => void;
	onMapPress: (latitude: number, longitude: number) => Promise<void>;
	onRegionChangeComplete: (region: Region) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
	visible,
	locationQuery,
	draftAddress,
	draftCoordinates,
	draftRegion,
	isResolvingLocation,
	locationFeedback,
	onClose,
	onSearch,
	onQueryChange,
	onUseCurrentLocation,
	onConfirmLocation,
	onMapPress,
	onRegionChangeComplete,
}) => {
	return (
		<SharedLocationPickerModal
			visible={visible}
			locationQuery={locationQuery}
			draftAddress={draftAddress}
			draftCoordinates={draftCoordinates as GeoCoordinates}
			draftRegion={draftRegion}
			isResolvingLocation={isResolvingLocation}
			locationFeedback={locationFeedback}
			onClose={onClose}
			onSearch={onSearch}
			onQueryChange={onQueryChange}
			onUseCurrentLocation={onUseCurrentLocation}
			onConfirmLocation={onConfirmLocation}
			onMapPress={onMapPress}
			onRegionChangeComplete={onRegionChangeComplete}
			labels={{
				title: "Position du magasin",
				searchLabel: "Rechercher une adresse",
				searchPlaceholder: "Ex: HLM Grand Yoff, Dakar",
				useCurrentLocationButton: "Utiliser ma position",
				confirmButton: "Valider",
				emptyAddressHint:
					"Touchez la carte ou utilisez la recherche pour selectionner le magasin.",
				closeA11yLabel: "Fermer la selection de position",
				searchA11yLabel: "Lancer la recherche d'adresse",
			}}
		/>
	);
};
