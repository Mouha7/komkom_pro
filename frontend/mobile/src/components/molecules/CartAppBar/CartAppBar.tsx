import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconOnlyButton, Text } from '../../atoms';
import { colorTokens } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import { styles, CART_APP_BAR_BUTTON_SIZE } from './CartAppBar.styles';
import type { CartAppBarProps } from './CartAppBar.types';

export const CartAppBar: React.FC<CartAppBarProps> = ({
	title = 'Mon Panier',
	itemCount,
	onPressBack,
	onPressClear,
	isClearDisabled = false,
	hideRightButton = false,
	testID,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);
	const titleWithCount = itemCount ? title + ' (' + String(itemCount) + ')' : title;

	return (
		<View style={[styles.container, { paddingTop: safeTop }]} testID={testID}>
			<View style={styles.content}>
				<IconOnlyButton
					iconName='arrowLeft'
					onPress={onPressBack}
					size={CART_APP_BAR_BUTTON_SIZE}
					borderRadius={CART_APP_BAR_BUTTON_SIZE / 2}
					iconSize={24}
					accessibilityLabel='Retour'
				/>

				<View style={styles.titleWrap}>
					<Text variant='h1' style={styles.title} maxLines={1} align='center'>
						{titleWithCount}
					</Text>
				</View>

				{hideRightButton ? (
					<View style={{ width: CART_APP_BAR_BUTTON_SIZE, height: CART_APP_BAR_BUTTON_SIZE }} />
				) : (
					<IconOnlyButton
						iconName='trash'
						onPress={onPressClear}
						disabled={isClearDisabled}
						size={CART_APP_BAR_BUTTON_SIZE}
						borderRadius={CART_APP_BAR_BUTTON_SIZE / 2}
						iconSize={24}
						iconColor={colorTokens.danger}
						accessibilityLabel='Vider le panier'
					/>
				)}
			</View>
		</View>
	);
};
