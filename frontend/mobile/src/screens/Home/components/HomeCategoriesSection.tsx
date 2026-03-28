import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { Icon, Text } from '../../../components';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import type { HomeCategoryItem } from './HomeSections.types';

type HomeCategoriesSectionProps = {
	items: HomeCategoryItem[];
	onPressCategory: (category: HomeCategoryItem) => void;
};

const CATEGORY_ITEM_WIDTH = 92;
const CATEGORY_ITEM_GAP = spacing.s2;

export const HomeCategoriesSection: React.FC<HomeCategoriesSectionProps> = ({
	items,
	onPressCategory,
}) => {
	const [containerWidth, setContainerWidth] = useState(0);

	const canScrollHorizontally = useMemo(() => {
		if (containerWidth === 0) {
			return true;
		}

		const totalItemsWidth = items.length * CATEGORY_ITEM_WIDTH;
		const totalGapsWidth = Math.max(items.length - 1, 0) * CATEGORY_ITEM_GAP;
		const totalContentWidth = totalItemsWidth + totalGapsWidth + spacing.s2;

		return totalContentWidth > containerWidth;
	}, [containerWidth, items.length]);

	const handleLayout = (event: LayoutChangeEvent): void => {
		const nextWidth = event.nativeEvent.layout.width;
		if (nextWidth !== containerWidth) {
			setContainerWidth(nextWidth);
		}
	};

	return (
		<View style={styles.section} onLayout={handleLayout}>
			<Text variant='h2' style={{ fontSize: 18, fontWeight: 'bold' }} textColorOverride={lightColors.text.primary}>
				Catégories
			</Text>
			<FlatList
				horizontal
				scrollEnabled={canScrollHorizontally}
				showsHorizontalScrollIndicator={false}
				data={items}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => onPressCategory(item)}
						style={styles.categoryButton}
						accessibilityRole='button'
						accessibilityLabel={`Ouvrir la categorie ${item.label}`}
					>
						<View style={styles.iconWrap}>
							<Icon name={item.iconName} size={22} color={lightColors.primary} />
						</View>
						<Text variant='small' textColorOverride={lightColors.text.primary} style={styles.label}>
							{item.label}
						</Text>
					</Pressable>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		rowGap: spacing.s2,
	},
	listContent: {
		paddingRight: spacing.s2,
	},
	categoryButton: {
		alignItems: 'center',
		width: CATEGORY_ITEM_WIDTH,
		rowGap: spacing.s2,
	},
	iconWrap: {
		width: 64,
		height: 64,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: lightColors.surface.default,
		borderWidth: 1,
		borderColor: lightColors.border.default,
	},
	label: {
		fontSize: 13,
		fontWeight: '700',
		textAlign: 'center',
	},
});
