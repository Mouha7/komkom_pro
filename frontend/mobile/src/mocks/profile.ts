export interface StoreProfileLocationModel {
	address: string;
	latitude: number;
	longitude: number;
	lastUpdatedAt: string;
}

export interface StoreProfileModel {
	id: string;
	userId: string;
	email: string;
	storeName: string;
	ownerName: string;
	companyRegistration: string;
	whatsAppNumber: string;
	avatarUrl: string;
	isVerified: boolean;
	location: StoreProfileLocationModel;
}

export type StoreProfileUpdatePayload = Partial<
	Pick<
		StoreProfileModel,
		'storeName' | 'ownerName' | 'companyRegistration' | 'whatsAppNumber' | 'avatarUrl' | 'email' | 'isVerified'
	>
> & {
	location?: Partial<StoreProfileLocationModel>;
};

export const DEFAULT_STORE_PROFILE: StoreProfileModel = {
	id: 'store-profile-dev-user',
	userId: 'dev-user',
	email: 'demo@komkom.local',
	storeName: 'Quincaillerie Sow & Freres',
	ownerName: 'Amadou Sow',
	companyRegistration: '004218942 2B3',
	whatsAppNumber: '+221 77 123 45 67',
	avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FAfrican%2F2',
	isVerified: true,
	location: {
		address: 'Marche Sandaga, Allee 3, Dakar',
		latitude: 14.6691,
		longitude: -17.4334,
		lastUpdatedAt: '2026-02-15T10:00:00.000Z',
	},
};
