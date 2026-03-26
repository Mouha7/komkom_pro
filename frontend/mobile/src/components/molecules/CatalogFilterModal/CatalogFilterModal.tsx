import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Button, Icon, Input, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './CatalogFilterModal.styles';
import type { CatalogFilterModalProps } from './CatalogFilterModal.types';

export const CatalogFilterModal: React.FC<CatalogFilterModalProps> = ({
	visible,
	filters,
	onFiltersChange,
	onClose,
	onApply,
}) => {
	const [tempFilters, setTempFilters] = useState<typeof filters>(filters);

	const handleReset = () => {
		setTempFilters({});
		onFiltersChange({});
	};

	const handleApply = () => {
		onFiltersChange(tempFilters);
		onApply();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable
					style={styles.modal}
					onPress={() => undefined}
					accessibilityLabel="Filtrer les produits"
				>
					{/* Header */}
					<View style={styles.header}>
						<Text
							variant="h2"
							style={styles.headerTitle}
							textColorOverride={lightColors.text.primary}
						>
							Filtres
						</Text>
						<Pressable
							onPress={onClose}
							style={styles.closeButton}
							accessibilityRole="button"
							accessibilityLabel="Fermer"
						>
							<Icon
								name="close"
								size={20}
								color={lightColors.text.primary as string}
							/>
						</Pressable>
					</View>

					{/* Content */}
					<ScrollView style={styles.content} scrollEnabled={true}>
						{/* Price Range Section */}
						<View style={styles.section}>
							<Text
								variant="body"
								style={styles.sectionLabel}
								textColorOverride={lightColors.text.primary}
							>
								Plage de prix
							</Text>
							<View style={styles.priceInputsRow}>
								<View style={styles.priceInput}>
									<Input
										placeholder="Min"
										value={
											tempFilters.priceMin
												? String(tempFilters.priceMin)
												: ''
										}
										onChangeText={(text) =>
											setTempFilters({
												...tempFilters,
												priceMin: text
													? parseFloat(text)
													: undefined,
											})
										}
										keyboardType="decimal-pad"
										returnKeyType="done"
									/>
								</View>
								<View style={styles.priceInput}>
									<Input
										placeholder="Max"
										value={
											tempFilters.priceMax
												? String(tempFilters.priceMax)
												: ''
										}
										onChangeText={(text) =>
											setTempFilters({
												...tempFilters,
												priceMax: text
													? parseFloat(text)
													: undefined,
											})
										}
										keyboardType="decimal-pad"
										returnKeyType="done"
									/>
								</View>
							</View>
						</View>

						{/* Stock Status Section */}
						<View style={styles.section}>
							<Text
								variant="body"
								style={styles.sectionLabel}
								textColorOverride={lightColors.text.primary}
							>
								Disponibilité
							</Text>
							<Pressable
								style={styles.stockOption}
								onPress={() =>
									setTempFilters({
										...tempFilters,
										inStock:
											tempFilters.inStock === true
												? undefined
												: true,
									})
								}
								accessibilityRole="checkbox"
								accessibilityState={{
									checked: tempFilters.inStock === true,
								}}
								accessibilityLabel="Afficher seulement les produits en stock"
							>
								<View
									style={{
										width: 20,
										height: 20,
										borderRadius: 4,
										borderWidth: 2,
										borderColor:
											tempFilters.inStock === true
												? lightColors.primary
												: lightColors.border.default,
										backgroundColor:
											tempFilters.inStock === true
												? lightColors.primary
												: 'transparent',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									{tempFilters.inStock === true && (
										<Icon
											name="check"
											size={14}
											color="#FFFFFF"
										/>
									)}
								</View>
								<Text
									variant="body"
									textColorOverride={
										lightColors.text.primary
									}
								>
									En stock seulement
								</Text>
							</Pressable>
						</View>
					</ScrollView>

					{/* Actions */}
					<View style={styles.actions}>
						<Button
							title="Réinitialiser"
							variant="secondary"
							onPress={handleReset}
							containerStyle={styles.actionButton}
						/>
						<Button
							title="Appliquer"
							variant="primary"
							onPress={handleApply}
							containerStyle={styles.actionButton}
						/>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};
