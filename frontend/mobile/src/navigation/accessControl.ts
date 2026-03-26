import type { CommonIconName } from '../components';
import { appFeatureFlags } from '../config';
import type { AppRole } from '../context/AuthContext';

export type MainTabRouteName = 'Home' | 'Catalog' | 'Orders' | 'Profile';

export type MainTabDefinition = {
	id: MainTabRouteName;
	label: string;
	iconName: CommonIconName;
	allowedRoles: AppRole[];
};

export const MAIN_TABS: ReadonlyArray<MainTabDefinition> = [
	{
		id: 'Home',
		label: 'Accueil',
		iconName: 'home',
		allowedRoles: ['buyer', 'employee'],
	},
	{
		id: 'Catalog',
		label: 'Catalogue',
		iconName: 'grid',
		allowedRoles: ['buyer', 'employee'],
	},
	{
		id: 'Orders',
		label: 'Commandes',
		iconName: 'package',
		allowedRoles: ['buyer', 'employee'],
	},
	{
		id: 'Profile',
		label: 'Profil',
		iconName: 'user',
		allowedRoles: ['buyer', 'employee'],
	},
];

export const isTabAllowedForRoles = (tabId: MainTabRouteName, roles: AppRole[]): boolean => {
	if (!appFeatureFlags.enableRoleGuards) {
		return true;
	}

	const definition = MAIN_TABS.find((tab) => tab.id === tabId);

	if (!definition) {
		return false;
	}

	return roles.some((role) => definition.allowedRoles.includes(role));
};

export const getVisibleTabsForRoles = (roles: AppRole[]): MainTabDefinition[] => {
	if (!appFeatureFlags.enableRoleGuards) {
		return [...MAIN_TABS];
	}

	return MAIN_TABS.filter((tab) => roles.some((role) => tab.allowedRoles.includes(role)));
};
