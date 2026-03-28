import React from 'react';
import { Pressable, View } from 'react-native';

import { Button, Icon, Input, Text } from '../../../components';
import { lightColors } from '../../../styles/colors';
import type { LoginInputRefs } from './LoginScreen.types';
import { styles } from './LoginScreen.styles';

interface LoginFormCardProps {
	isPasswordHidden: boolean;
	inputRefs: LoginInputRefs;
	onTogglePasswordVisibility: () => void;
	onForgotPasswordPress: () => void;
	onLoginPress: () => void;
	onCreateAccountPress: () => void;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
	isPasswordHidden,
	inputRefs,
	onTogglePasswordVisibility,
	onForgotPasswordPress,
	onLoginPress,
	onCreateAccountPress,
}) => {
	return (
		<View style={styles.formCard}>
			<Input
				label="Numero de telephone ou Email"
				labelVariant="button"
				labelStyle={styles.labelStyle}
				placeholder="contact@quincaillerie.sn"
				autoCapitalize="none"
				autoCorrect={false}
				keyboardType="email-address"
				returnKeyType="next"
				blurOnSubmit={false}
				onSubmitEditing={() => inputRefs.passwordInputRef.current?.focus()}
				inputRef={inputRefs.emailInputRef}
				leftElement={<Icon name="user" size={20} color={lightColors.text.secondary} />}
			/>

			<Input
				label="Mot de passe"
				labelVariant="button"
				labelStyle={styles.labelStyle}
				placeholder="••••••••••••••"
				secureTextEntry={isPasswordHidden}
				returnKeyType="done"
				onSubmitEditing={() => inputRefs.passwordInputRef.current?.blur()}
				inputRef={inputRefs.passwordInputRef}
				leftElement={<Icon name="lock" size={20} color={lightColors.text.secondary} />}
				rightElement={
					<Pressable
						onPress={onTogglePasswordVisibility}
						hitSlop={10}
						accessibilityRole="button"
						accessibilityLabel={isPasswordHidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
					>
						<Icon name={isPasswordHidden ? 'eyeOff' : 'eye'} size={20} color={lightColors.text.secondary} />
					</Pressable>
				}
			/>

			<View style={styles.metaRow}>
				<Pressable
					hitSlop={8}
					onPress={onForgotPasswordPress}
					accessibilityRole="button"
					accessibilityLabel="Mot de passe oublie"
				>
					<Text variant="h3" style={styles.forgotPasswordText} textColorOverride={lightColors.primary}>
						Mot de passe oublie ?
					</Text>
				</Pressable>
			</View>

			<Button
				title="Se connecter"
				onPress={onLoginPress}
				containerStyle={styles.loginButton}
				textStyle={styles.primaryButtonText}
			/>

			<View style={styles.separatorRow}>
				<View style={styles.separatorLine} />
				<Text variant="h3" align="center" style={styles.separatorText} textColorOverride={lightColors.text.secondary}>
					NOUVEAU MAGASIN ?
				</Text>
				<View style={styles.separatorLine} />
			</View>

			<Button
				title="Creer un compte KomKom"
				variant="secondary"
				onPress={onCreateAccountPress}
				containerStyle={styles.signupButton}
				textStyle={styles.secondaryButtonText}
			/>
		</View>
	);
};
