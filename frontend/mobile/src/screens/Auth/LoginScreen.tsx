import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, Icon, IconOnlyButton, Input, Text } from '../../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors, withOpacity } from '../../styles/colors';
import { s, spacing } from '../../styles/spacing';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
	const [rememberMe, setRememberMe] = useState(true);
	const [isPasswordHidden, setIsPasswordHidden] = useState(true);

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<IconOnlyButton
					iconName="arrowLeft"
					onPress={() => navigation.goBack()}
					accessibilityLabel="Retour"
					containerStyle={styles.backButton}
				/>

				<View style={styles.headerBlock}>
					<View style={styles.brandMark}>
						<Icon name="hammer" size={32} color={lightColors.text.onPrimary} strokeWidth={2.5} />
					</View>
					<Text variant="h1" align="center" textColorOverride={lightColors.text.primary}>
						Connexion
					</Text>
					<Text variant="bodyLarge" align="center" textColorOverride={lightColors.text.secondary}>
						Connectez-vous a votre espace KomKom
					</Text>
				</View>

				<View style={styles.formCard}>
					<Input
						label="Numero de telephone ou Email"
						labelVariant="button"
						placeholder="contact@quincaillerie.sn"
						autoCapitalize="none"
						autoCorrect={false}
						keyboardType="email-address"
						leftElement={<Icon name="user" size={20} color={lightColors.text.secondary} />}
					/>

					<Input
						label="Mot de passe"
						labelVariant="button"
						placeholder="••••••••••••••"
						secureTextEntry={isPasswordHidden}
						leftElement={<Icon name="lock" size={20} color={lightColors.text.secondary} />}
						rightElement={
							<Pressable
								onPress={() => setIsPasswordHidden((current) => !current)}
								hitSlop={10}
								accessibilityRole="button"
								accessibilityLabel={isPasswordHidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
							>
								<Icon name={isPasswordHidden ? 'eyeOff' : 'eye'} size={20} color={lightColors.text.secondary} />
							</Pressable>
						}
					/>

					<View style={styles.metaRow}>
						{/* <Pressable
							style={styles.rememberControl}
							onPress={() => setRememberMe((current) => !current)}
							hitSlop={8}
							accessibilityRole="checkbox"
							accessibilityState={{ checked: rememberMe }}
							accessibilityLabel="Se souvenir de moi"
						>
							<View style={[styles.checkbox, rememberMe ? styles.checkboxChecked : null]}>
								{rememberMe ? <Icon name="check" size={16} color={lightColors.text.onPrimary} /> : null}
							</View>
							<Text variant="bodyLarge" textColorOverride={lightColors.text.primary}>
								Se souvenir de moi
							</Text>
						</Pressable> */}

						<Pressable
							hitSlop={8}
							onPress={() => undefined}
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
						onPress={() => navigation.navigate('UIStateLibrary')}
						containerStyle={styles.loginButton}
                        textStyle={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}
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
						onPress={() => navigation.navigate('Signup')}
						containerStyle={styles.signupButton}
                        textStyle={{ color: lightColors.neutral900, fontWeight: '700', fontSize: 16 }}
					/>
				</View>

				<View style={styles.securityRow}>
					<Icon name="shieldCheck" size={16} color={lightColors.success} />
					<Text variant="bodyLarge" style={styles.securityText} textColorOverride={lightColors.text.secondary}>
						Securise par KomKom Identity
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#EFEFF2',
	},
	container: {
		flex: 1,
		paddingHorizontal: spacing.s3,
		paddingTop: spacing.s2,
		paddingBottom: spacing.s4,
	},
	backButton: {
		alignSelf: 'flex-start',
	},
	headerBlock: {
		marginTop: spacing.s5,
		alignItems: 'center',
		rowGap: spacing.s2,
	},
    securityText: {
        fontSize: 12,
        fontWeight: '500',
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '700',
    },
	brandMark: {
		width: 72,
		height: 72,
		borderRadius: 16,
		backgroundColor: lightColors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: withOpacity('#ED762F', 0.2),
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 18,
		shadowOpacity: 1,
		elevation: 6,
	},
	formCard: {
		marginTop: spacing.s4,
		backgroundColor: '#F9FAFB',
		borderRadius: 8,
		padding: spacing.s4,
		rowGap: spacing.s3,
		shadowColor: withOpacity('#000000', 0.08),
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 14,
		shadowOpacity: 1,
		elevation: 2,
	},
    separatorText: {
        fontSize: 12,
        fontWeight: '700',
    },
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		columnGap: spacing.s2,
	},
	rememberControl: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
		flex: 1,
	},
	checkbox: {
		width: 28,
		height: 28,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: lightColors.border.default,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
	},
	checkboxChecked: {
		backgroundColor: lightColors.primary,
		borderColor: lightColors.primary,
	},
	loginButton: {
		minHeight: 58,
		borderRadius: 10,
	},
	separatorRow: {
		marginTop: spacing.s1,
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s2,
	},
	separatorLine: {
		flex: 1,
		height: 1,
		backgroundColor: lightColors.border.default,
	},
	signupButton: {
		minHeight: 58,
		borderRadius: 10,
	},
	securityRow: {
		marginTop: 'auto',
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: spacing.s1,
	},
});

export default LoginScreen;
