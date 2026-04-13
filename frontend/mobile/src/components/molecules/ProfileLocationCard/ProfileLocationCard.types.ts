export type ProfileLocationCardProps = {
	address: string;
	latitude: number;
	longitude: number;
	lastUpdatedAt: string;
	onPressUpdateLocation: () => void;
	isUpdatingLocation?: boolean;
};
