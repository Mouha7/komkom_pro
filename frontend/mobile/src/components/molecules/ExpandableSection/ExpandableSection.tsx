import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Icon, Text } from '../../atoms';
import { styles } from './ExpandableSection.styles';
import type { ExpandableSectionProps } from './ExpandableSection.types';

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
	title,
	children,
	defaultExpanded = true,
	testID,
	containerStyle,
	headerStyle,
	bodyStyle,
	titleStyle,
}) => {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<Pressable
				onPress={() => setIsExpanded((current) => !current)}
				style={[styles.header, headerStyle]}
				accessibilityRole='button'
				accessibilityLabel={isExpanded ? `Replier ${title}` : `Deplier ${title}`}
			>
				<Text variant='h3' style={titleStyle}>
					{title}
				</Text>
				<Icon name={isExpanded ? 'chevronUp' : 'chevronDown'} size={20} color='#374151' />
			</Pressable>
			{isExpanded ? <View style={[styles.body, bodyStyle]}>{children}</View> : null}
		</View>
	);
};
