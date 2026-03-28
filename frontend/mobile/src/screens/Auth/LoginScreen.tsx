import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Icon, IconOnlyButton, Text } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors } from '../../styles/colors';
import { LoginFormCard } from './Login/LoginFormCard';
import { LoginHeader } from './Login/LoginHeader';
import { styles } from './Login/LoginScreen.styles';
import { useLoginForm } from './Login/useLoginForm';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
	const { isPasswordHidden, emailInputRef, passwordInputRef, togglePasswordVisibility } = useLoginForm();
	const { signIn } = useAuth();

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<IconOnlyButton
					iconName="arrowLeft"
					onPress={() => navigation.goBack()}
					accessibilityLabel="Retour"
					containerStyle={styles.backButton}
				/>

				<LoginHeader />

				<LoginFormCard
					isPasswordHidden={isPasswordHidden}
					inputRefs={{ emailInputRef, passwordInputRef }}
					onTogglePasswordVisibility={togglePasswordVisibility}
					onForgotPasswordPress={() => undefined}
					onLoginPress={() => signIn({ email: 'buyer@komkom.local', role: 'buyer' })}
					onCreateAccountPress={() => navigation.navigate('Signup')}
				/>

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

export default LoginScreen;
