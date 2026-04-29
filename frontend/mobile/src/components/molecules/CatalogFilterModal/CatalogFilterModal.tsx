import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Button, Icon, Input, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { ALL_PRODUCT_TYPES, getProductTypeLabel, type ProductType, ALL_STOCK_STATUSES, getStockStatusLabel, type StockStatus } from '../../../constants';
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

	useEffect(() => {
		setTempFilters(filters);
	}, [filters, visible]);

	const handleReset = () => {
		setTempFilters({});
		onFiltersChange({});
	};

	const handleApply = () => {
		onFiltersChange(tempFilters);
		onApply();
	};

	const handleCategoryToggle = (categoryId: ProductType) => {
		const currentCategories = tempFilters.categoryIds || [];
		const isSelected = currentCategories.includes(categoryId);
		const newCategories = isSelected
			? currentCategories.filter((id) => id !== categoryId)
			: [...currentCategories, categoryId];

		setTempFilters({
			...tempFilters,
			categoryIds: newCategories.length > 0 ? newCategories : undefined,
		});
	};

	const handleStockToggle = (statusId: StockStatus) => {
		const currentStatuses = tempFilters.stockStatuses || [];
		const isSelected = currentStatuses.includes(statusId);
		const newStatuses = isSelected
			? currentStatuses.filter((id) => id !== statusId)
			: [...currentStatuses, statusId];

		setTempFilters({
			...tempFilters,
			stockStatuses: newStatuses.length > 0 ? newStatuses : undefined,
		});
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
			presentationStyle="overFullScreen"
			statusBarTranslucent
			navigationBarTranslucent
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
						{/* Product Types Section */}
						<View style={styles.section}>
							<Text
								variant="body"
								style={styles.sectionLabel}
								textColorOverride={lightColors.text.primary}
							>
								Types de produits
							</Text>
							<View style={styles.categoriesContainer}>
								{ALL_PRODUCT_TYPES.map((categoryId) => {
									const isSelected =
										tempFilters.categoryIds?.includes(
											categoryId
										) ?? false;
									return (
										<Pressable
											key={categoryId}
											style={styles.categoryOption}
											onPress={() =>
												handleCategoryToggle(
													categoryId
												)
											}
											accessibilityRole="checkbox"
											accessibilityState={{
												checked: isSelected,
											}}
											accessibilityLabel={getProductTypeLabel(
												categoryId
											)}
										>
											<View
												style={{
													width: 20,
													height: 20,
													borderRadius: 4,
													borderWidth: 2,
													borderColor: isSelected
														? lightColors.primary
														: lightColors.border
															.default,
													backgroundColor: isSelected
														? lightColors.primary
														: 'transparent',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												{isSelected && (
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
												{getProductTypeLabel(
													categoryId
												)}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>

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
							<View style={styles.categoriesContainer}>
								{ALL_STOCK_STATUSES.map((statusId) => {
									const isSelected =
										tempFilters.stockStatuses?.includes(
											statusId
										) ?? false;
									return (
										<Pressable
											key={statusId}
											style={styles.categoryOption}
											onPress={() =>
												handleStockToggle(
													statusId
												)
											}
											accessibilityRole="checkbox"
											accessibilityState={{
												checked: isSelected,
											}}
											accessibilityLabel={getStockStatusLabel(
												statusId
											)}
										>
											<View
												style={{
													width: 20,
													height: 20,
													borderRadius: 4,
													borderWidth: 2,
													borderColor: isSelected
														? lightColors.primary
														: lightColors.border
															.default,
													backgroundColor: isSelected
														? lightColors.primary
														: 'transparent',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												{isSelected && (
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
												{getStockStatusLabel(
													statusId
												)}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>
					</ScrollView>

					{/* Actions */}
					<View style={styles.actions}>
						<Button
							title="Réinitialiser"
							variant="secondary"
							onPress={handleReset}
							containerStyle={styles.actionButton}
                            textStyle={{ fontWeight: '700' }}
						/>
						<Button
							title="Appliquer"
							variant="primary"
							onPress={handleApply}
							containerStyle={styles.actionButton}
                            textStyle={{ fontWeight: '700' }}
						/>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};

export default CatalogFilterModal;
