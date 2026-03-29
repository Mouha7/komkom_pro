import React from 'react';
import { Image, Pressable, View, useWindowDimensions } from 'react-native';

import { Icon, Text } from '../../atoms';
import { QuantityControl } from '../QuantityControl';
import { styles } from './CartItem.styles';
import type { CartItemProps } from './CartItem.types';

const formatPrice = (price: number, currency: string): string => {
	return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
};

const deriveBrand = (name: string): string => {
	const firstToken = name.trim().split(/\s+/)[0] || 'PRODUIT';
	return firstToken.toUpperCase();
};

export const CartItem: React.FC<CartItemProps> = ({
	item,
	onIncrease,
	onDecrease,
	onRemove,
	disabled = false,
	testID,
	containerStyle,
}) => {
	const { width: screenWidth } = useWindowDimensions();
	const isRegularScreen = screenWidth >= 768 && screenWidth < 1024;
	const isLargeScreen = screenWidth >= 1024;
	const removeIconSize = isLargeScreen ? 26 : isRegularScreen ? 25 : 24;

	return (
		<View
			style={[
				styles.container,
				isRegularScreen && styles.containerRegular,
				isLargeScreen && styles.containerLarge,
				containerStyle,
			]}
			testID={testID}
		>
			<View
				style={[
					styles.imageWrap,
					isRegularScreen && styles.imageWrapRegular,
					isLargeScreen && styles.imageWrapLarge,
				]}
			>
				<Image
					source={{ uri: item.imageUrl || 'https://via.placeholder.com/200x200?text=Produit' }}
					style={[
						styles.image,
						isRegularScreen && styles.imageRegular,
						isLargeScreen && styles.imageLarge,
					]}
					resizeMode="cover"
				/>
			</View>
			<View style={[styles.body, isRegularScreen && styles.bodyRegular]}>
				<View style={[styles.topRow, isRegularScreen && styles.topRowRegular]}>
					<Text
						variant="overline"
						style={[styles.brand, isRegularScreen && styles.brandRegular]}
					>
						{item.brand || deriveBrand(item.name)}
					</Text>
					<Pressable
						onPress={() => onRemove?.(item.productId)}
						disabled={disabled}
						style={[styles.removeButton, isRegularScreen && styles.removeButtonRegular]}
						accessibilityRole="button"
						accessibilityLabel={'Retirer ' + item.name}
					>
						<Icon name="close" size={removeIconSize} color="#374151" />
					</Pressable>
				</View>
				<Text
					variant="h2"
					maxLines={2}
					style={[
						styles.title,
						isRegularScreen && styles.titleRegular,
						isLargeScreen && styles.titleLarge,
					]}
				>
					{item.name}
				</Text>
				<View style={[styles.footer, isRegularScreen && styles.footerRegular]}>
					<View style={[styles.priceWrap, isRegularScreen && styles.priceWrapRegular]}>
						<Text
							variant="small"
							style={[
								styles.totalPrice,
								isRegularScreen && styles.totalPriceRegular,
								isLargeScreen && styles.totalPriceLarge,
							]}
						>
							{formatPrice(item.price * item.quantity, item.currency || 'FCFA')}
						</Text>
						{item.description ? (
							<Text
								variant="small"
								color="secondary"
								style={[styles.unitPrice, isRegularScreen && styles.unitPriceRegular]}
							>
								{item.description}
							</Text>
						) : null}
					</View>
					<QuantityControl
						quantity={item.quantity}
						onDecrease={() => onDecrease?.(item.productId)}
						onIncrease={() => onIncrease?.(item.productId)}
						disabled={disabled}
						decreaseAccessibilityLabel={'Diminuer quantite de ' + item.name}
						increaseAccessibilityLabel={'Augmenter quantite de ' + item.name}
						containerStyle={[
							styles.qtyControl,
							isRegularScreen && styles.qtyControlRegular,
							isLargeScreen && styles.qtyControlLarge,
						]}
						buttonStyle={[
							styles.qtyAction,
							isRegularScreen && styles.qtyActionRegular,
							isLargeScreen && styles.qtyActionLarge,
						]}
						valueVariant='small'
						valueStyle={[
							styles.qtyValue,
							isRegularScreen && styles.qtyValueRegular,
							isLargeScreen && styles.qtyValueLarge,
						]}
					/>
				</View>
			</View>
		</View>
	);
};
