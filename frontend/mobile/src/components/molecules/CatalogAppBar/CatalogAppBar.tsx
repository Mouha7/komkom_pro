import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, Icon, Input, Text } from "../../atoms";
import { lightColors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { styles } from "./CatalogAppBar.styles";
import type { CatalogAppBarProps } from "./CatalogAppBar.types";

export const CatalogAppBar: React.FC<CatalogAppBarProps> = ({
	searchQuery,
	onSearchChange,
	viewMode,
	onViewModeChange,
	onFilterPress,
	categories,
	selectedCategoryId,
	onCategorySelect,
}) => {
	const insets = useSafeAreaInsets();
	const safeTop = Math.max(insets.top, spacing.s1);

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
							accessibilityLabel="Ouvrir les filtres"
						>
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
									size={20}
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
							horizontal
							scrollEnabled={categories.length > 3}
							showsHorizontalScrollIndicator={false}
							data={categories}
							keyExtractor={(item) => item.id}
							contentContainerStyle={styles.categoryChipsContent}
							renderItem={({ item }) => {
								const isSelected = item.id === selectedCategoryId;
								return (
									<Button
										title={item.name}
										onPress={() => onCategorySelect(item.id)}
										variant="secondary"
										accessibilityLabel={`Filtrer par ${item.name}`}
										containerStyle={
											isSelected
												? { backgroundColor: "#ED762F", borderColor: "#ED762F" }
												: undefined
										}
										textStyle={
											isSelected ? { color: "#FFFFFF", fontWeight: "700" } : undefined
										}
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
