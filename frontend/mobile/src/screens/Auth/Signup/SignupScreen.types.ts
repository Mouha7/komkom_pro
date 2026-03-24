import type { Region } from "react-native-maps";

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

export interface StoreLocation {
	latitude: number;
	longitude: number;
	address: string;
}

export interface DraftCoordinates {
	latitude: number;
	longitude: number;
}

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
