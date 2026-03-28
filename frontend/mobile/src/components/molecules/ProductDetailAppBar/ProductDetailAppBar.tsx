import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconOnlyButton } from '../../atoms';
import { spacing } from '../../../styles/spacing';
import { colorTokens } from '../../../styles/colors';
import { styles } from './ProductDetailAppBar.styles';
import type { ProductDetailAppBarProps } from './ProductDetailAppBar.types';

export const ProductDetailAppBar: React.FC<ProductDetailAppBarProps> = ({
	onPressBack,
	onPressShare,
	onPressFavorite,
	isFavorite = false,
	testID,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);

	return (
		<View style={[styles.container, { paddingTop: safeTop }]} testID={testID}>
			<View style={styles.content}>
				<IconOnlyButton
					iconName='arrowLeft'
					onPress={onPressBack}
					accessibilityLabel='Retour'
				/>

				<View style={styles.actions}>
					<IconOnlyButton
						iconName='share'
						onPress={onPressShare}
						accessibilityLabel='Partager le produit'
					/>
					<IconOnlyButton
						iconName='heart'
						onPress={onPressFavorite}
						iconColor={isFavorite ? colorTokens.primary : colorTokens.neutral700}
						accessibilityLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
					/>
				</View>
			</View>
		</View>
	);
};
