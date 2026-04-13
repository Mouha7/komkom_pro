import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Button, Icon, Input, Text } from '../../atoms';
import { lightColors } from '../../../styles/colors';
import type { EmployeeRole, InviteEmployeePayload } from '../../../mocks/employees';
import { styles } from './InviteEmployeeModal.styles';
import type { InviteEmployeeModalProps } from './InviteEmployeeModal.types';
import { spacing } from '../../../styles/spacing';

const EMPTY_VALUES: InviteEmployeePayload = {
	fullName: '',
	email: '',
	phone: '',
	role: 'seller',
};

export const InviteEmployeeModal: React.FC<InviteEmployeeModalProps> = ({
	visible,
	onClose,
	onApply,
}) => {
	const [draftValues, setDraftValues] = useState<InviteEmployeePayload>(EMPTY_VALUES);
	const [isSaving, setIsSaving] = useState(false);

	const isDisabled = useMemo(() => {
		return (
			draftValues.fullName.trim().length < 3 ||
			draftValues.email.trim().length < 5 ||
			draftValues.phone.trim().length < 8
		);
	}, [draftValues]);

	const handleClose = () => {
		if (isSaving) {
			return;
		}
		onClose();
	};

	const handleReset = () => {
		setDraftValues(EMPTY_VALUES);
	};

	const handleApply = async () => {
		if (isSaving || isDisabled) {
			return;
		}

		setIsSaving(true);
		try {
			await onApply(draftValues);
			handleReset();
			onClose();
		} finally {
			setIsSaving(false);
		}
	};

	const selectRole = (role: EmployeeRole) => {
		setDraftValues((current) => ({
			...current,
			role,
		}));
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={handleClose}
			presentationStyle='overFullScreen'
			statusBarTranslucent
			navigationBarTranslucent
		>
			<Pressable style={styles.overlay} onPress={handleClose}>
				<Pressable style={styles.modal} onPress={() => undefined}>
					<View style={styles.headerRow}>
						<Text variant='h2' style={styles.title} textColorOverride={lightColors.text.primary}>
							Inviter un employe
						</Text>
						<Pressable
							onPress={handleClose}
							style={styles.closeButton}
							accessibilityRole='button'
							accessibilityLabel='Fermer la modale invitation employe'
						>
							<Icon name='close' size={20} color={lightColors.text.primary as string} />
						</Pressable>
					</View>

					<ScrollView style={styles.form}>
                        <View style={styles.inputStyle}>
							<Text variant='small' style={{ fontWeight: 'bold', marginBottom: spacing.s1 }} textColorOverride={lightColors.text.secondary}>
								Role
							</Text>
							<View style={styles.actions}>
								<View style={styles.buttonWrap}>
									<Button
										title='Vendeur'
										variant={draftValues.role === 'seller' ? 'primary' : 'secondary'}
                                        textStyle={styles.label}
										onPress={() => selectRole('seller')}
									/>
								</View>
								<View style={styles.buttonWrap}>
									<Button
										title='Manager'
										variant={draftValues.role === 'manager' ? 'primary' : 'secondary'}
                                        textStyle={styles.label}
										onPress={() => selectRole('manager')}
									/>
								</View>
							</View>
						</View>
						<Input
							label='Nom complet'
							value={draftValues.fullName}
                            labelStyle={styles.label}
                            containerStyle={styles.inputStyle}
							onChangeText={(value) =>
								setDraftValues((current) => ({ ...current, fullName: value }))
							}
						/>
						<Input
							label='Email'
							value={draftValues.email}
                            labelStyle={styles.label}
							onChangeText={(value) =>
								setDraftValues((current) => ({ ...current, email: value }))
							}
							autoCapitalize='none'
                            containerStyle={styles.inputStyle}
							autoCorrect={false}
							keyboardType='email-address'
						/>
						<Input
							label='Telephone'
							value={draftValues.phone}
                            labelStyle={styles.label}
                            containerStyle={styles.inputStyle}
							onChangeText={(value) =>
								setDraftValues((current) => ({ ...current, phone: value }))
							}
							keyboardType='phone-pad'
						/>
					</ScrollView>

					<View style={styles.actions}>
						<View style={styles.buttonWrap}>
							<Button title='Reinitialiser' variant='secondary' onPress={handleReset} disabled={isSaving} textStyle={styles.label} />
						</View>
						<View style={styles.buttonWrap}>
							<Button
								title='Envoyer invitation'
								onPress={() => {
									void handleApply();
								}}
								disabled={isDisabled}
								loading={isSaving}
								textStyle={styles.label}
							/>
						</View>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};
