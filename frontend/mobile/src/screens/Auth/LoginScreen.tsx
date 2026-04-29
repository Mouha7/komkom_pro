import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppBar, Icon, Text } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useResponsive } from '../../hooks/useResponsive';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors } from '../../styles/colors';
import { clamp } from '../../styles/responsive';
import { spacing } from '../../styles/spacing';
import { LoginFormCard } from './Login/LoginFormCard';
import { LoginHeader } from './Login/LoginHeader';
import { styles } from './Login/LoginScreen.styles';
import { useLoginForm } from './Login/useLoginForm';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
	const { isPasswordHidden, emailInputRef, passwordInputRef, togglePasswordVisibility } = useLoginForm();
	const { signIn } = useAuth();
	const { width, isMedium, isExpanded } = useResponsive();
	const horizontalPadding = isExpanded ? clamp(width * 0.08, spacing.s4, spacing.s8) : isMedium ? spacing.s5 : spacing.s3;

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
			<AppBar
				title=""
				leftIconName="arrowLeft"
				onPressLeft={() => navigation.goBack()}
			/>
			<View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
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
