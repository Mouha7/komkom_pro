import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon, Input } from '../../../components';
import { lightColors } from '../../../styles/colors';

type HomeSearchSectionProps = {
	value: string;
	onChangeText: (value: string) => void;
};

export const HomeSearchSection: React.FC<HomeSearchSectionProps> = ({
	value,
	onChangeText,
}) => {
	return (
		<Input
			value={value}
			onChangeText={onChangeText}
			placeholder='Rechercher un produit, reference...'
			returnKeyType='search'
			autoCorrect={false}
			autoCapitalize='none'
			containerStyle={styles.wrapper}
			leftElement={<Icon name='search' size={20} color={lightColors.text.secondary} />}
			rightElement={
				value.length > 0 ? (
					<Pressable onPress={() => onChangeText('')} accessibilityRole='button' accessibilityLabel='Effacer la recherche'>
						<Icon name='close' size={18} color={lightColors.text.secondary} />
					</Pressable>
				) : null
			}
		/>
	);
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 0,
    },
});
