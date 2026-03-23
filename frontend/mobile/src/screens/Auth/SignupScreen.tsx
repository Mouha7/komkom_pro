import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, IconOnlyButton, Text } from '../../components';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<IconOnlyButton
					iconName="arrowLeft"
					onPress={() => navigation.goBack()}
					accessibilityLabel="Retour"
				/>

				<View style={styles.content}>
					<Text variant="h1" align="center" textColorOverride={lightColors.text.primary}>
						Creation de compte
					</Text>
					<Text variant="bodyLarge" align="center" textColorOverride={lightColors.text.secondary}>
						Ecran d'inscription a implementer.
					</Text>

					<Button
						title="Voir la bibliotheque UI"
						onPress={() => navigation.navigate('UIStateLibrary')}
						containerStyle={styles.primaryButton}
					/>
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
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		rowGap: spacing.s3,
	},
	primaryButton: {
		alignSelf: 'stretch',
		minHeight: 52,
		borderRadius: 10,
		marginTop: spacing.s2,
	},
});

export default SignupScreen;
