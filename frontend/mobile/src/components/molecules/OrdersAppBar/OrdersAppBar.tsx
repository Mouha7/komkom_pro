import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Input, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { styles } from './OrdersAppBar.styles';
import type { OrdersAppBarProps } from './OrdersAppBar.types';

export const OrdersAppBar: React.FC<OrdersAppBarProps> = ({
	searchQuery,
	onSearchChange,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);

	return (
		<View style={[styles.container, { paddingTop: safeTop }]}>
			<View style={styles.content}>
				<Text variant="h2" style={styles.title}>
					Mes Commandes
				</Text>
				<Input
					value={searchQuery}
					onChangeText={onSearchChange}
					placeholder="Rechercher une commande, réf..."
					returnKeyType="search"
					autoCorrect={false}
					autoCapitalize="none"
					containerStyle={styles.searchInputContainer}
					leftElement={
						<Icon
							name="search"
							size={22}
							color={lightColors.text.secondary}
						/>
					}
					rightElement={
						searchQuery.length > 0 ? (
							<Pressable
								onPress={() => onSearchChange('')}
								style={styles.clearButton}
								accessibilityRole="button"
								accessibilityLabel="Effacer la recherche"
							>
								<Icon
									name="close"
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
