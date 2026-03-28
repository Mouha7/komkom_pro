import type { Region } from "react-native-maps";

import type {
	GeoCoordinates,
	PickedLocation,
} from "../../../features/location";

export interface PasswordStrength {
	minLength: boolean;
	hasLowercase: boolean;
	hasUppercase: boolean;
	hasNumber: boolean;
	hasSymbol: boolean;
	noLeadingOrTrailingSpaces: boolean;
	notCommon: boolean;
	score: number;
	level: "weak" | "medium" | "strong";
	isAcceptable: boolean;
}

export type StoreLocation = PickedLocation;

export type DraftCoordinates = GeoCoordinates;

export interface SignupLocationState {
	storeLocation: StoreLocation | null;
	isLocationModalVisible: boolean;
	locationQuery: string;
	draftAddress: string;
	draftCoordinates: DraftCoordinates;
	draftRegion: Region;
	isResolvingLocation: boolean;
	locationFeedback: string | null;
	locationTouched: boolean;
}
