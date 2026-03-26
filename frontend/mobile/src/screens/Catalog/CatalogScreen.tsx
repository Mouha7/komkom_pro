import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Button, CatalogAppBar, CatalogFilterModal, Text } from '../../components';
import type { CatalogCategory, ViewMode, FilterOptions } from '../../components';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';

type CatalogScreenProps = BottomTabScreenProps<MainTabParamList, 'Catalog'>;

export const CatalogScreen: React.FC<CatalogScreenProps> = ({ route }) => {
	const selectedCategoryLabel = route.params?.categoryLabel;
	const subtitle = selectedCategoryLabel
		? `Categorie selectionnee: ${selectedCategoryLabel}`
		: 'Ecran provisoire pour continuer le dev frontend avant branchement backend.';

	// Search and view mode
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<ViewMode>('grid');

	// Filter modal
	const [filterModalVisible, setFilterModalVisible] = useState(false);
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

	// Categories
	const [categories] = useState<CatalogCategory[]>([
		{ id: 'all', name: 'Tous' },
		{ id: 'gros-oeuvre', name: 'Gros œuvre' },
		{ id: '3-utillage', name: '3 utillage' },
		{ id: 'plomberie', name: 'Plomberie' },
	]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>('all');

	const handleFilterPress = () => {
		setFilterModalVisible(true);
	};

	const handleCategorySelect = (categoryId: string) => {
		setSelectedCategoryId(categoryId === selectedCategoryId ? undefined : categoryId);
	};

	const handleApplyFilters = () => {
		setFilterModalVisible(false);
		// TODO: Appliquer les filtres à la requête API
		console.log('Filters applied:', filterOptions);
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<CatalogAppBar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				onFilterPress={handleFilterPress}
				categories={categories}
				selectedCategoryId={selectedCategoryId}
				onCategorySelect={handleCategorySelect}
			/>

			<CatalogFilterModal
				visible={filterModalVisible}
				filters={filterOptions}
				onFiltersChange={setFilterOptions}
				onClose={() => setFilterModalVisible(false)}
				onApply={handleApplyFilters}
			/>

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
				<View style={styles.card}>
					<Text variant='h3' textColorOverride={lightColors.text.primary}>
						Catalogue
					</Text>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						{subtitle}
					</Text>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						Recherche: {searchQuery || '(vide)'}
					</Text>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						Catégorie: {selectedCategoryId || '(aucune)'}
					</Text>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						Vue: {viewMode}
					</Text>
					<Button title='Simuler recherche produit' variant='secondary' onPress={() => undefined} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s4,
		paddingTop: spacing.s4,
		paddingBottom: spacing.s5,
	},
	card: {
		backgroundColor: lightColors.surface.default,
		borderRadius: 16,
		padding: spacing.s4,
		rowGap: spacing.s2,
		borderWidth: 1,
		borderColor: lightColors.border.subtle,
	},
});

export default CatalogScreen;

