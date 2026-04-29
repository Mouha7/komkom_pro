import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Input, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { styles } from './EmployeeManagementAppBar.styles';
import type { EmployeeManagementAppBarProps } from './EmployeeManagementAppBar.types';

export const EmployeeManagementAppBar: React.FC<EmployeeManagementAppBarProps> = ({
	searchQuery,
	onSearchChange,
	onPressBack,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);

	return (
		<View style={[styles.container, { paddingTop: safeTop }]}>
			<View style={styles.content}>
				<View style={styles.topRow}>
					<Pressable
						onPress={onPressBack}
						style={({ pressed }) => [
							styles.actionButton,
							pressed && styles.actionButtonPressed,
						]}
						accessibilityRole='button'
						accessibilityLabel='Retour au profil'
					>
						<Icon
							name='arrowLeft'
							size={24}
							color={lightColors.text.primary as string}
						/>
					</Pressable>

					<View style={styles.titleContainer}>
						<Text variant='h2' style={styles.title} textColorOverride={lightColors.text.primary}>
							Gestion Employés
						</Text>
					</View>

					<View style={styles.actionSpacer} />
				</View>

				<Input
					value={searchQuery}
					onChangeText={onSearchChange}
					placeholder='Rechercher par nom, email...'
					returnKeyType='search'
					autoCorrect={false}
					autoCapitalize='none'
					containerStyle={styles.searchInputContainer}
					leftElement={
						<Icon
							name='search'
							size={22}
							color={lightColors.text.secondary}
						/>
					}
					rightElement={
						searchQuery.length > 0 ? (
							<Pressable
								onPress={() => onSearchChange('')}
								accessibilityRole='button'
								accessibilityLabel='Effacer la recherche'
							>
								<Icon
									name='close'
									size={18}
									color={lightColors.text.secondary}
								/>
							</Pressable>
						) : null
					}
				/>
			</View>
		</View>
	);
};
