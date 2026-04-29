import React from "react";
import { Pressable } from "react-native";

import { Text } from "../../atoms";
import { styles } from "./CatalogAppBar.styles";
import type { CatalogCategoryChipProps } from "./CatalogAppBar.types";

export const CatalogCategoryChip: React.FC<CatalogCategoryChipProps> = ({
	id,
	label,
	isActive,
	onPress,
	testID,
}) => {
	return (
		<Pressable
			style={[
				styles.categoryChipContainer,
				isActive && styles.categoryChipContainerActive,
			]}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityState={{ selected: isActive }}
			accessibilityLabel={`Filtrer par ${label}`}
			testID={testID ?? `catalog-category-chip-${id}`}
		>
			<Text
				style={[
					styles.categoryChipLabel,
					isActive && styles.categoryChipLabelActive,
				]}
			>
				{label}
			</Text>
		</Pressable>
	);
};