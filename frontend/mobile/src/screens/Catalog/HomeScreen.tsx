import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { AppBar, Button, Text } from '../../components';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';

type CatalogScreenProps = BottomTabScreenProps<MainTabParamList, 'Catalog'>;


export const CatalogScreen: React.FC<CatalogScreenProps> = ({ route }) => {
	const selectedCategoryLabel = route.params?.categoryLabel;
	const subtitle = selectedCategoryLabel
		? `Categorie selectionnee: ${selectedCategoryLabel}`
		: 'Ecran provisoire pour continuer le dev frontend avant branchement backend.';

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<AppBar title='Catalogue' titleAlign='left' />
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
				<View style={styles.card}>
					<Text variant='h3' textColorOverride={lightColors.text.primary}>
						Catalogue
					</Text>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						{subtitle}
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

