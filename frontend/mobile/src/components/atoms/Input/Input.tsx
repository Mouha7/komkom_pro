import React from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '../Text/Text';
import { styles } from './Input.styles';
import type { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = ({
	label,
	labelVariant = 'small',
	labelStyle,
	errorMessage,
	leftElement,
	rightElement,
	containerStyle,
	inputStyle,
	inputRef,
	testID,
	editable = true,
	accessibilityLabel,
	...textInputProps
}) => {
	const hasError = Boolean(errorMessage);

	return (
		<View style={styles.wrapper}>
			{label ? (
				<Text variant={labelVariant} style={labelStyle}>
					{label}
				</Text>
			) : null}
			<View
				style={[
					styles.field,
					containerStyle,
					hasError && styles.fieldError,
					!editable && styles.fieldDisabled,
				]}
			>
				{leftElement ? <View>{leftElement}</View> : null}
				<TextInput
					ref={inputRef}
					style={[styles.input, inputStyle]}
					placeholderTextColor="#374151"
					editable={editable}
					accessibilityLabel={accessibilityLabel ?? label}
					testID={testID}
					{...textInputProps}
				/>
				{rightElement ? <View>{rightElement}</View> : null}
			</View>
			{hasError ? <Text variant="small" color="danger">{errorMessage}</Text> : null}
		</View>
	);
};
