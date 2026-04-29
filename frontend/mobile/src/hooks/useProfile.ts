import { useCallback, useEffect, useState } from 'react';

import {
	getStoreProfile,
	updateStoreProfile,
} from '../api/profile';
import type {
	StoreProfileModel,
	StoreProfileUpdatePayload,
} from '../mocks/profile';

type UseProfileResult = {
	profile: StoreProfileModel | null;
	isLoading: boolean;
	errorMessage: string | null;
	reload: () => Promise<void>;
	applyProfileUpdate: (
		payload: StoreProfileUpdatePayload,
	) => Promise<StoreProfileModel>;
};

export const useProfile = (userId: string | undefined): UseProfileResult => {
	const [profile, setProfile] = useState<StoreProfileModel | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const reload = useCallback(async (): Promise<void> => {
		if (!userId) {
			setProfile(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setErrorMessage(null);

		try {
			const nextProfile = await getStoreProfile(userId);
			setProfile(nextProfile);
		} catch (error) {
			const baseMessage = 'Impossible de charger le profil.';

			if (__DEV__ && error instanceof Error) {
				setErrorMessage(`${baseMessage} ${error.message}`);
			} else {
				setErrorMessage(baseMessage);
			}
		} finally {
			setIsLoading(false);
		}
	}, [userId]);

	const applyProfileUpdate = useCallback(
		async (payload: StoreProfileUpdatePayload): Promise<StoreProfileModel> => {
			if (!userId) {
				throw new Error('Utilisateur non connecte.');
			}

			const updatedProfile = await updateStoreProfile(userId, payload);
			setProfile(updatedProfile);
			setErrorMessage(null);
			return updatedProfile;
		},
		[userId],
	);

	useEffect(() => {
		void reload();
	}, [reload]);

	return {
		profile,
		isLoading,
		errorMessage,
		reload,
		applyProfileUpdate,
	};
};
