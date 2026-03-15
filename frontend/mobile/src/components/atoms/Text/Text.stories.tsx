import React from 'react';
import { View } from 'react-native';

import { spacing } from '../../../styles/spacing';
import { Text } from './Text';

const meta = {
	title: 'Atoms/Text',
	component: Text,
};

export default meta;

export const Variants = {
	render: () => (
		<View style={{ rowGap: spacing.s2 }}>
			<Text variant="h1">Titre principal</Text>
			<Text variant="h2">Titre secondaire</Text>
			<Text variant="body">Texte standard</Text>
			<Text variant="small" color="secondary">
				Texte secondaire
			</Text>
		</View>
	),
};
