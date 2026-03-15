import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { StatusBadge, StatusChip } from './StatusChip';

const meta = {
	title: 'Atoms/StatusChip',
	component: StatusChip,
};

export default meta;

export const Tones = {
	render: () => (
		<View style={{ rowGap: spacing.s2 }}>
			<StatusChip label="En stock" tone="success" />
			<StatusChip label="Rupture" tone="danger" />
			<StatusChip label="En cours" tone="warning" />
			<StatusChip label="Livree" tone="info" />
			<StatusChip label="Brouillon" tone="neutral" />
		</View>
	),
};

export const DomainBadge = {
	render: () => (
		<View style={{ rowGap: spacing.s2 }}>
			<StatusBadge stockStatus="in_stock" />
			<StatusBadge stockStatus="low_stock" />
			<StatusBadge orderStatus="delivered" />
		</View>
	),
};
