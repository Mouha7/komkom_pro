import React from 'react';
import { View } from 'react-native';

import { Icon, Text } from '../../../components';
import { lightColors } from '../../../styles/colors';
import { styles } from './LoginScreen.styles';

export const LoginHeader: React.FC = () => {
	return (
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
	);
};
