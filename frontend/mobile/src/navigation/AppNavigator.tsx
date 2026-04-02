import React from "react";
import { NavigationContainer, type NavigatorScreenParams } from "@react-navigation/native";
import {
	createNativeStackNavigator,
	type NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import { LoginScreen } from "../screens/Auth/LoginScreen";
import { SplashScreen } from "../screens/Auth/SplashScreen";
import { UIStateLibraryScreen } from "../screens/Showcase/UIStateLibraryScreen";
import { SignupScreen } from "../screens/Auth/SignupScreen";
import { TermsOfUseScreen } from "../screens/Legal/TermsOfUseScreen";
import { PrivacyPolicyScreen } from "../screens/Legal/PrivacyPolicyScreen";
import { ProductDetailScreen } from "../screens/Catalog/ProductDetailScreen";
import { CartScreen } from "../screens/Cart/CartScreen";
import { CheckoutScreen } from "../screens/Cart/CheckoutScreen";
import { OrderConfirmationScreen } from "../screens/Cart/OrderConfirmation";
import type { MainTabParamList } from "./BottomTabNavigator";
import { OrderDetailScreen } from "../screens/Orders/OrderDetailScreen";
import { NotificationsScreen } from "../screens/Notifications/NotificationsScreen";
import { useAuth } from "../hooks/useAuth";
import { BottomTabNavigator } from "./BottomTabNavigator";

export type RootStackParamList = {
	Splash: undefined;
	Login: undefined;
	Signup: undefined;
	TermsOfUse: undefined;
	PrivacyPolicy: undefined;
	MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
	ProductDetail: {
		productId: string;
	};
	Cart: undefined;
	Checkout: undefined;
	Notifications: undefined;
	OrderConfirmation: {
		orderId: string;
	};
	OrderDetail: {
		orderId: string;
	};
	UIStateLibrary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const defaultScreenOptions: NativeStackNavigationOptions = {
	headerShown: false,
	animation: "fade",
	contentStyle: { backgroundColor: "#FFFFFF" },
};

export const AppNavigator: React.FC = () => {
	const { isAuthenticated, signIn } = useAuth();

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Splash"
				screenOptions={defaultScreenOptions}
			>
				{!isAuthenticated ? (
					<>
						<Stack.Screen name="Splash">
							{({ navigation }) => (
								<SplashScreen
									onLoginPress={() => navigation.navigate("Login")}
									onSignupPress={() => navigation.navigate("Signup")}
									onDevBypassPress={() => signIn({ email: "dev@komkom.local", role: "buyer" })}
								/>
							)}
						</Stack.Screen>
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Signup" component={SignupScreen} />
						<Stack.Screen
							name="TermsOfUse"
							component={TermsOfUseScreen}
						/>
						<Stack.Screen
							name="PrivacyPolicy"
							component={PrivacyPolicyScreen}
						/>
					</>
				) : (
					<>
						<Stack.Screen name="MainTabs" component={BottomTabNavigator} />
						<Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
						<Stack.Screen name="Cart" component={CartScreen} />
						<Stack.Screen name="Checkout" component={CheckoutScreen} />
						<Stack.Screen name="Notifications" component={NotificationsScreen} />
						<Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
						<Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
					</>
				)}
				<Stack.Screen
					name="UIStateLibrary"
					component={UIStateLibraryScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
