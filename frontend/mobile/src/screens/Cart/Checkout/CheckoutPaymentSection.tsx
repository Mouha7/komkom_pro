import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '../../../components';
import { lightColors } from '../../../styles/colors';
import { CHECKOUT_PAYMENT_OPTIONS } from './CheckoutScreen.constants';
import { styles } from './CheckoutScreen.styles';
import type { CheckoutPaymentSectionProps } from './CheckoutScreen.types';

export const CheckoutPaymentSection: React.FC<CheckoutPaymentSectionProps> = ({
	selectedPaymentMethod,
	onSelectPaymentMethod,
}) => {
	return (
		<View style={styles.section}>
			<Text
				variant='overline'
				textColorOverride={lightColors.text.secondary}
				style={styles.sectionTitle}
			>
				2. Options de paiement
			</Text>
			<View style={styles.radioGroup}>
				{CHECKOUT_PAYMENT_OPTIONS.map((option) => {
					const isActive = option.id === selectedPaymentMethod;

					return (
						<Pressable
							key={option.id}
							onPress={() => onSelectPaymentMethod(option.id)}
							style={[styles.radioCard, isActive && styles.radioCardActive]}
							accessibilityRole='radio'
							accessibilityState={{ checked: isActive }}
							accessibilityLabel={option.title}
						>
							<View style={[styles.radioCircle, isActive && styles.radioCircleActive]}>
								{isActive ? <View style={styles.radioCircleInner} /> : null}
							</View>

							<View style={styles.radioContent}>
								<Text
									variant='button'
									textColorOverride={lightColors.text.primary}
									style={[styles.radioTitle, isActive && styles.radioTitleActive]}
								>
									{option.title}
								</Text>
								<Text
									variant='small'
									textColorOverride={lightColors.text.secondary}
									style={styles.radioDescription}
								>
									{option.description}
								</Text>
							</View>

							<View style={styles.radioIconWrap}>
								<Icon
									name={option.iconName}
									size={24}
									color={isActive ? lightColors.primary : lightColors.text.secondary}
								/>
							</View>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};
