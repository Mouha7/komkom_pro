import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Button, HomeAppBar, Icon, Text } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { lightColors } from '../../styles/colors';
import { styles } from './HomeScreen.styles';
import type { MainTabParamList } from '../../navigation/BottomTabNavigator';

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const getDisplayNameFromEmail = (email?: string): string => {
	if (!email) {
		return 'Amira';
	}

	const [localPart] = email.split('@');
	if (!localPart || localPart.trim().length === 0) {
		return 'Amira';
	}

	const cleaned = localPart.replace(/[._-]+/g, ' ').trim();
	if (cleaned.length === 0) {
		return 'Amira';
	}

	return cleaned
		.split(' ')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
	const { roles, user } = useAuth();
	const isEmployee = roles.includes('employee');
	const userName = getDisplayNameFromEmail(user?.email);
	const storeName = isEmployee
		? 'Magasin Partenaire KomKom'
		: 'Quincaillerie Centrale';

	return (
		<SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
			<HomeAppBar
				userName={userName}
				storeName={storeName}
				notificationCount={2}
				cartCount={5}
				onPressProfile={() => navigation.navigate('Profile')}
				onPressNotifications={() => navigation.navigate('Orders')}
				onPressCart={() => navigation.navigate('Catalog')}
			/>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
				<View style={styles.heroCard}>
					<View style={styles.heroIconWrap}>
						<Icon name='hammer' size={28} color={lightColors.primary} strokeWidth={2.5} />
					</View>
					<Text variant='h2' textColorOverride={lightColors.text.primary}>
						Bienvenue sur KomKom
					</Text>
					<Text variant='body' textColorOverride={lightColors.text.secondary}>
						Votre espace de travail buyer/employee est pret pour le developpement.
					</Text>
				</View>

				<View style={styles.sectionCard}>
					<Text variant='h3' textColorOverride={lightColors.text.primary}>
						Raccourcis rapides
					</Text>
					<Button
						title='Aller au catalogue'
						variant='secondary'
						onPress={() => navigation.navigate('Catalog')}
						containerStyle={styles.actionButton}
					/>
					<Button
						title='Voir les commandes'
						variant='secondary'
						onPress={() => navigation.navigate('Orders')}
						containerStyle={styles.actionButton}
					/>
					<Button
						title='Mon profil'
						variant='secondary'
						onPress={() => navigation.navigate('Profile')}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;
