import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
	AppBar,
	Button,
	ErrorState,
	Icon,
	ProfileBusinessCard,
	ProfileEditModal,
	ProfileHeader,
	ProfileLocationCard,
	ProfileSettingsCard,
	SkeletonListItem,
} from '../../components';
import {
	DAKAR_DEFAULT_REGION,
	LocationPickerModal,
	useLocationPicker,
} from '../../features/location';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useResponsive } from '../../hooks/useResponsive';
import { useToast } from '../../hooks/useToast';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';
import { lightColors, withOpacity } from '../../styles/colors';
import { clamp } from '../../styles/responsive';
import { spacing } from '../../styles/spacing';
import type { ProfileEditValues, ProfileSettingItem } from '../../components';

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;
type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
	const { showToast } = useToast();
	const { signOut, user } = useAuth();
	const { profile, isLoading, errorMessage, reload, applyProfileUpdate } =
		useProfile(user?.id);
	const { width, isMedium, isExpanded } = useResponsive();
	const rootNavigation = navigation.getParent<RootStackNavigationProp>();
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const lastSyncedLocationKeyRef = useRef<string | null>(null);

	const {
		pickedLocation,
		isLocationModalVisible,
		locationQuery,
		draftAddress,
		draftCoordinates,
		draftRegion,
		isResolvingLocation,
		locationFeedback,
		openLocationModal,
		closeLocationModal,
		handleUseCurrentLocation,
		handleSearchLocation,
		handleLocationQueryChange,
		handleConfirmLocation,
		handleMapCoordinatePick,
		handleDraftRegionChange,
	} = useLocationPicker({
		initialRegion: DAKAR_DEFAULT_REGION,
	});

	const horizontalPadding = isExpanded
		? clamp(width * 0.08, spacing.s4, spacing.s8)
		: isMedium
			? spacing.s5
			: spacing.s3;

	const settingsItems = useMemo<ProfileSettingItem[]>(
		() => [
			{
				id: 'employees',
				iconName: 'user',
				title: 'Gestion des employes',
			},
			{
				id: 'notifications',
				iconName: 'bell',
				title: 'Preferences de notification',
			},
			{
				id: 'security',
				iconName: 'shieldCheck',
				title: 'Securite et mot de passe',
			},
			{
				id: 'support',
				iconName: 'headphones',
				title: 'Aide et support technique',
			},
		],
		[],
	);

	const editValues = useMemo<ProfileEditValues>(
		() => ({
			storeName: profile?.storeName ?? '',
			ownerName: profile?.ownerName ?? '',
			companyRegistration: profile?.companyRegistration ?? '',
			whatsAppNumber: profile?.whatsAppNumber ?? '',
			avatarUrl: profile?.avatarUrl ?? '',
		}),
		[profile],
	);

	useEffect(() => {
		if (!pickedLocation || !profile) {
			return;
		}

		const locationSyncKey =
			pickedLocation.latitude.toFixed(6) +
			'|' +
			pickedLocation.longitude.toFixed(6) +
			'|' +
			pickedLocation.address;

		if (lastSyncedLocationKeyRef.current === locationSyncKey) {
			return;
		}

		lastSyncedLocationKeyRef.current = locationSyncKey;

		void applyProfileUpdate({
			location: {
				address: pickedLocation.address,
				latitude: pickedLocation.latitude,
				longitude: pickedLocation.longitude,
				lastUpdatedAt: new Date().toISOString(),
			},
		})
			.then(() => {
				showToast({
					tone: 'success',
					title: 'Position mise a jour',
					message: 'La localisation de livraison a ete enregistree.',
				});
			})
			.catch(() => {
				showToast({
					tone: 'danger',
					title: 'Mise a jour impossible',
					message: 'Impossible de sauvegarder la position du magasin.',
				});
			});
	}, [applyProfileUpdate, pickedLocation, profile, showToast]);

	const handleApplyProfileEdit = async (
		values: ProfileEditValues,
	): Promise<void> => {
		await applyProfileUpdate({
			storeName: values.storeName,
			ownerName: values.ownerName,
			companyRegistration: values.companyRegistration,
			whatsAppNumber: values.whatsAppNumber,
			avatarUrl: values.avatarUrl,
		});

		setIsEditModalVisible(false);
		showToast({
			tone: 'success',
			title: 'Profil mis a jour',
			message: 'Les informations du magasin ont ete enregistrees.',
		});
	};

	const handleLogout = (): void => {
		void signOut();
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<AppBar
				title='Profil Magasin'
				rightActions={[
					{
						id: 'notifications',
						iconName: 'bell',
						onPress: () => rootNavigation?.navigate('Notifications'),
						accessibilityLabel: 'Ouvrir les notifications',
					},
				]}
			/>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.contentContainer,
					{ paddingHorizontal: horizontalPadding },
				]}
			>
				{isLoading ? (
					<>
						<SkeletonListItem showAvatar lineWidths={[0.8, 0.5]} />
						<SkeletonListItem showAvatar={false} lineWidths={[0.9, 0.75, 0.7]} />
						<SkeletonListItem showAvatar={false} lineWidths={[0.9, 0.6]} />
					</>
				) : errorMessage ? (
					<ErrorState
						title='Profil indisponible'
						description={errorMessage}
						actionLabel='Reessayer'
						onActionPress={() => {
							void reload();
						}}
					/>
				) : profile ? (
					<>
						<ProfileHeader
							storeName={profile.storeName}
							ownerName={profile.ownerName}
							avatarUrl={profile.avatarUrl}
							isVerified={profile.isVerified}
						/>

						<ProfileBusinessCard
							storeName={profile.storeName}
							companyRegistration={profile.companyRegistration}
							whatsAppNumber={profile.whatsAppNumber}
							onPressEdit={() => setIsEditModalVisible(true)}
						/>

						<ProfileLocationCard
							address={profile.location.address}
							latitude={profile.location.latitude}
							longitude={profile.location.longitude}
							lastUpdatedAt={profile.location.lastUpdatedAt}
							onPressUpdateLocation={openLocationModal}
							isUpdatingLocation={isResolvingLocation}
						/>

						<ProfileSettingsCard items={settingsItems} />

						<View style={styles.logoutWrap}>
							<Button
								title='Se deconnecter'
								variant='secondary'
								onPress={handleLogout}
								containerStyle={styles.logoutButton}
								textStyle={styles.logoutText}
								leftIcon={
									<Icon
										name='logOut'
										size={18}
										strokeWidth={3}
										color={lightColors.danger}
									/>
								}
							/>
						</View>
					</>
				) : null}
			</ScrollView>

			{profile ? (
				<ProfileEditModal
					visible={isEditModalVisible}
					values={editValues}
					onClose={() => setIsEditModalVisible(false)}
					onApply={handleApplyProfileEdit}
				/>
			) : null}

			<LocationPickerModal
				visible={isLocationModalVisible}
				locationQuery={locationQuery}
				draftAddress={draftAddress}
				draftCoordinates={draftCoordinates}
				draftRegion={draftRegion}
				isResolvingLocation={isResolvingLocation}
				locationFeedback={locationFeedback}
				onClose={closeLocationModal}
				onSearch={handleSearchLocation}
				onQueryChange={handleLocationQueryChange}
				onUseCurrentLocation={handleUseCurrentLocation}
				onConfirmLocation={handleConfirmLocation}
				onMapPress={handleMapCoordinatePick}
				onRegionChangeComplete={handleDraftRegionChange}
				labels={{
					title: 'Position du magasin',
					searchPlaceholder: 'Ex: Marche Sandaga, Dakar',
					confirmButton: 'Enregistrer',
					useCurrentLocationButton: 'Utiliser ma position',
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s4,
		paddingBottom: spacing.s6,
		rowGap: spacing.s4,
	},
	logoutWrap: {
		paddingTop: spacing.s1,
	},
	logoutButton: {
		backgroundColor: withOpacity(lightColors.danger as string, 0.12),
		borderColor: withOpacity(lightColors.danger as string, 0.3),
		borderWidth: 1,
	},
	logoutText: {
		color: lightColors.danger,
		fontWeight: 'bold',
	},
});

export default ProfileScreen;
