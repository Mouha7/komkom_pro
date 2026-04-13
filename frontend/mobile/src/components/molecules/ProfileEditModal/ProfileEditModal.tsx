import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Button, Icon, Input, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import { styles } from './ProfileEditModal.styles';
import type {
	ProfileEditModalProps,
	ProfileEditValues,
} from './ProfileEditModal.types';

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
	visible,
	values,
	onClose,
	onApply,
}) => {
	const [draftValues, setDraftValues] = useState<ProfileEditValues>(values);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		setDraftValues(values);
	}, [values, visible]);

	const handleReset = () => {
		setDraftValues(values);
	};

	const handleApply = async () => {
		if (isSaving) {
			return;
		}

		setIsSaving(true);
		try {
			await onApply(draftValues);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={styles.modal} onPress={() => undefined}>
					<View style={styles.headerRow}>
						<Text
							variant='h2'
							style={styles.title}
							textColorOverride={lightColors.text.primary}
						>
							Modifier le profil magasin
						</Text>
						<Pressable
							onPress={onClose}
							style={styles.closeButton}
							accessibilityRole='button'
							accessibilityLabel='Fermer la modale de profil'
						>
							<Icon
								name='close'
								size={20}
								color={lightColors.text.primary as string}
							/>
						</Pressable>
					</View>

					<ScrollView style={styles.form}>
						<Input
							label='Raison sociale'
							value={draftValues.storeName}
                            labelStyle={styles.labelStyle}
                            containerStyle={styles.inputStyle}
							onChangeText={(nextValue) =>
								setDraftValues((current) => ({
									...current,
									storeName: nextValue,
								}))
							}
						/>
						<Input
							label='Proprietaire'
							value={draftValues.ownerName}
                            labelStyle={styles.labelStyle}
                            containerStyle={styles.inputStyle}
							onChangeText={(nextValue) =>
								setDraftValues((current) => ({
									...current,
									ownerName: nextValue,
								}))
							}
						/>
						<Input
							label='NINEA / RC'
							value={draftValues.companyRegistration}
                            labelStyle={styles.labelStyle}
                            containerStyle={styles.inputStyle}
							onChangeText={(nextValue) =>
								setDraftValues((current) => ({
									...current,
									companyRegistration: nextValue,
								}))
							}
						/>
						<Input
							label='Numero WhatsApp'
							value={draftValues.whatsAppNumber}
                            labelStyle={styles.labelStyle}
                            containerStyle={styles.inputStyle}
							onChangeText={(nextValue) =>
								setDraftValues((current) => ({
									...current,
									whatsAppNumber: nextValue,
								}))
							}
							keyboardType='phone-pad'
						/>
						<Input
							label='URL avatar/logo'
							value={draftValues.avatarUrl}
                            labelStyle={styles.labelStyle}
                            containerStyle={styles.inputStyle}
							onChangeText={(nextValue) =>
								setDraftValues((current) => ({
									...current,
									avatarUrl: nextValue,
								}))
							}
							autoCapitalize='none'
							autoCorrect={false}
						/>
					</ScrollView>

					<View style={styles.actions}>
						<View style={styles.buttonWrap}>
							<Button
								title='Reinitialiser'
								variant='secondary'
								onPress={handleReset}
								disabled={isSaving}
							/>
						</View>
						<View style={styles.buttonWrap}>
							<Button
								title='Enregistrer'
								onPress={() => {
									void handleApply();
								}}
								loading={isSaving}
							/>
						</View>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};
