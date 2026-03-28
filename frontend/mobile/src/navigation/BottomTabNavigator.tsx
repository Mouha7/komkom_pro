import React, { useMemo } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { BottomBar, Text } from '../components';
import { useAuth } from '../hooks/useAuth';
import { lightColors } from '../styles/colors';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { CatalogScreen } from '../screens/Catalog/CatalogScreen';
import { OrdersScreen } from '../screens/Orders/OrdersScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { getVisibleTabsForRoles, isTabAllowedForRoles, MAIN_TABS, type MainTabRouteName } from './accessControl';

export type MainTabParamList = {
	Home: undefined;
	Catalog: {
		categoryId?: string;
		categoryLabel?: string;
	} | undefined;
	Orders: undefined;
	Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomBottomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
	const actions = state.routes.map((route) => {
		const routeName = route.name as MainTabRouteName;
		const definition = MAIN_TABS.find((tab) => tab.id === routeName);

		if (!definition) {
			return null;
		}

		return {
			id: routeName,
			label: definition.label,
			iconName: definition.iconName,
			onPress: () => navigation.navigate(route.name),
		};
	}).filter((action) => action !== null);

	return <BottomBar actions={actions} activeActionId={state.routes[state.index]?.name} />;
};

export const BottomTabNavigator: React.FC = () => {
	const { roles } = useAuth();

	const visibleTabs = useMemo(() => getVisibleTabsForRoles(roles), [roles]);

	if (visibleTabs.length === 0) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
				<Text variant='h3' textColorOverride={lightColors.text.primary}>
					Aucun onglet disponible pour votre role.
				</Text>
			</View>
		);
	}

	const initialRouteName = visibleTabs[0].id;

	return (
		<Tab.Navigator
			initialRouteName={initialRouteName}
			tabBar={(props) => <CustomBottomTabBar {...props} />}
			screenOptions={{
				headerShown: false,
			}}
		>
			{isTabAllowedForRoles('Home', roles) ? <Tab.Screen name='Home' component={HomeScreen} /> : null}
			{isTabAllowedForRoles('Catalog', roles) ? <Tab.Screen name='Catalog' component={CatalogScreen} /> : null}
			{isTabAllowedForRoles('Orders', roles) ? <Tab.Screen name='Orders' component={OrdersScreen} /> : null}
			{isTabAllowedForRoles('Profile', roles) ? <Tab.Screen name='Profile' component={ProfileScreen} /> : null}
		</Tab.Navigator>
	);
};

export default BottomTabNavigator;

