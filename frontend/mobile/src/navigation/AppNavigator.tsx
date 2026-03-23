import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/Auth/LoginScreen';
import { SignupScreen } from '../screens/Auth/SignupScreen';
import { SplashScreen } from '../screens/Auth/SplashScreen';
import { UIStateLibraryScreen } from '../screens/Showcase/UIStateLibraryScreen';

export type RootStackParamList = {
	Splash: undefined;
	Login: undefined;
	Signup: undefined;
	UIStateLibrary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const defaultScreenOptions: NativeStackNavigationOptions = {
	headerShown: false,
	animation: 'fade',
	contentStyle: { backgroundColor: '#FFFFFF' },
};

export const AppNavigator: React.FC = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Splash" screenOptions={defaultScreenOptions}>
				<Stack.Screen name="Splash">
					{({ navigation }) => (
						<SplashScreen
							onLoginPress={() => navigation.navigate('Login')}
							onSignupPress={() => navigation.navigate('Signup')}
						/>
					)}
				</Stack.Screen>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="UIStateLibrary" component={UIStateLibraryScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
