import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '../../../components';
import { lightColors } from '../../../styles/colors';
import { spacing } from '../../../styles/spacing';
import type { HomeCategoryItem } from './HomeSections.types';

type HomeCategoriesSectionProps = {
	items: HomeCategoryItem[];
	onPressCategory: (category: HomeCategoryItem) => void;
};

export const HomeCategoriesSection: React.FC<HomeCategoriesSectionProps> = ({
	items,
	onPressCategory,
}) => {
	return (
		<View style={styles.section}>
			<Text variant='h2' style={{ fontSize: 18, fontWeight: 'bold' }} textColorOverride={lightColors.text.primary}>
				Catégories
			</Text>
			<FlatList
				horizontal
				showsHorizontalScrollIndicator={false}
				data={items}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item, index }) => (
					<Pressable
						onPress={() => onPressCategory(item)}
						style={[
							styles.categoryButton,
							index === items.length - 1 && styles.lastItemSpacing,
						]}
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
		width: 92,
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
	lastItemSpacing: {
		marginRight: spacing.s2,
	},
});
