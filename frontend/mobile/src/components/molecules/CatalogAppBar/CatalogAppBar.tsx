import React, { useEffect, useMemo, useRef } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, Input, Text } from "../../atoms";
import { lightColors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { CatalogCategoryChip } from "./CatalogCategoryChip";
import { styles } from "./CatalogAppBar.styles";
import type { CatalogAppBarProps } from "./CatalogAppBar.types";

export const CatalogAppBar: React.FC<CatalogAppBarProps> = ({
	searchQuery,
	onSearchChange,
	viewMode,
	onViewModeChange,
	onFilterPress,
	isFilterActive = false,
	categories,
	selectedCategoryId,
	onCategorySelect,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);
	const chipsListRef = useRef<FlatList<CatalogAppBarProps['categories'][number]> | null>(null);

	const selectedCategoryIndex = useMemo(
		() => categories.findIndex((item) => item.id === selectedCategoryId),
		[categories, selectedCategoryId],
	);

	useEffect(() => {
		if (selectedCategoryIndex < 0) {
			return;
		}

		requestAnimationFrame(() => {
			chipsListRef.current?.scrollToIndex({
				index: selectedCategoryIndex,
				animated: true,
				viewPosition: 0.5,
			});
		});
	}, [selectedCategoryIndex]);

	return (
		<View style={[styles.container, { paddingTop: safeTop }]}>
			<View style={styles.content}>
				{/* Row 1: Title + View Mode + Filter */}
				<View style={styles.topRow}>
					<Text
						variant="h2"
						style={styles.title}
						textColorOverride={lightColors.text.primary}
					>
						Catalogue
					</Text>
					<View style={styles.actionsRow}>
						<Pressable
							onPress={() =>
								onViewModeChange(
									viewMode === "grid" ? "list" : "grid",
								)
							}
							style={({ pressed }) => [
								styles.actionButton,
								pressed && styles.actionButtonPressed,
							]}
							accessibilityRole="button"
							accessibilityLabel={`Vue ${viewMode === "grid" ? "grille" : "liste"}`}
						>
							<Icon
								name={viewMode === "grid" ? "grid" : "list"}
								size={24}
								color={lightColors.text.primary as string}
							/>
						</Pressable>

						<Pressable
							onPress={onFilterPress}
							style={({ pressed }) => [
								styles.actionButton,
								pressed && styles.actionButtonPressed,
							]}
							accessibilityRole="button"
							accessibilityState={{ selected: isFilterActive }}
							accessibilityLabel="Ouvrir les filtres"
						>
							{isFilterActive ? <View style={styles.filterActiveDot} /> : null}
							<Icon
								name="sliderFilter"
								size={24}
								color={lightColors.text.primary as string}
							/>
						</Pressable>
					</View>
				</View>

				{/* Row 2: Search with neutral100 background */}
				<View style={styles.searchRow}>
					<View style={styles.searchInputWrapper}>
						<Input
							value={searchQuery}
							onChangeText={onSearchChange}
							placeholder="Rechercher un produit, réf..."
							returnKeyType="search"
							autoCorrect={false}
							autoCapitalize="none"
							leftElement={
								<Icon
									name="search"
									size={22}
									color={lightColors.text.secondary}
								/>
							}
                            containerStyle={styles.searchInputContainer}
							rightElement={
								searchQuery.length > 0 ? (
									<Pressable
										onPress={() => onSearchChange("")}
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

				{/* Row 3: Horizontal scrollable category chips */}
				{categories.length > 0 && (
					<View style={styles.categoryChipsRow}>
						<FlatList
							ref={chipsListRef}
							horizontal
							scrollEnabled={categories.length > 3}
							showsHorizontalScrollIndicator={false}
							data={categories}
							keyExtractor={(item) => item.id}
							onScrollToIndexFailed={(info) => {
								chipsListRef.current?.scrollToOffset({
									offset: Math.max(info.averageItemLength * info.index, 0),
									animated: true,
								});
							}}
							contentContainerStyle={styles.categoryChipsContent}
							renderItem={({ item }) => {
								const isSelected = item.id === selectedCategoryId;
								return (
									<CatalogCategoryChip
										id={item.id}
										label={item.name}
										isActive={isSelected}
										onPress={() => onCategorySelect(item.id)}
									/>
								);
							}}
						/>
					</View>
				)}
			</View>
		</View>
	);
};
