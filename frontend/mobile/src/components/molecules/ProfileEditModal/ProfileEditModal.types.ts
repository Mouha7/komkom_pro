export type ProfileEditValues = {
	storeName: string;
	ownerName: string;
	companyRegistration: string;
	whatsAppNumber: string;
	avatarUrl: string;
};

export type ProfileEditModalProps = {
	visible: boolean;
	values: ProfileEditValues;
	onClose: () => void;
	onApply: (values: ProfileEditValues) => Promise<void>;
};
