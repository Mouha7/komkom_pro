import React from 'react';
import { View } from 'react-native';

import { styles } from './Skeleton.styles';
import type { SkeletonListItemProps } from './Skeleton.types';

const defaultLineWidths = [0.95, 0.62, 0.38];

export const SkeletonListItem: React.FC<SkeletonListItemProps> = ({
	lineWidths = defaultLineWidths,
	showAvatar = true,
	containerStyle,
	testID,
}) => {
	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			{showAvatar ? <View style={styles.avatar} /> : null}
			<View style={styles.linesWrap}>
				{lineWidths.map((lineWidth, index) => (
					<View
						key={'skeleton-line-' + String(index)}
						style={[styles.line, { width: String(Math.min(1, Math.max(0.2, lineWidth)) * 100) + '%' }]}
					/>
				))}
			</View>
		</View>
	);
};
