import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

import { styles } from "./ProductCardSkeleton.styles";
import type { ProductCardSkeletonProps } from "./ProductCardSkeleton.types";

type SkeletonBlockProps = {
	shimmerOffset: Animated.AnimatedInterpolation<string | number>;
	style: ProductCardSkeletonProps["containerStyle"];
};

const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
	shimmerOffset,
	style,
}) => {
	return (
		<View style={[styles.placeholderBase, style]}>
			<Animated.View
				pointerEvents="none"
				style={[
					styles.placeholderShimmer,
					{ transform: [{ translateX: shimmerOffset }] },
				]}
			/>
		</View>
	);
};

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
	variant = "portrait",
	containerStyle,
	testID,
}) => {
	const isLandscape = variant === "landscape";
	const shimmerProgress = useRef(new Animated.Value(-1)).current;

	useEffect(() => {
		const loopAnimation = Animated.loop(
			Animated.timing(shimmerProgress, {
				toValue: 1,
				duration: 1200,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		);

		loopAnimation.start();

		return () => {
			loopAnimation.stop();
		};
	}, [shimmerProgress]);

	const shimmerOffset = shimmerProgress.interpolate({
		inputRange: [-1, 1],
		outputRange: [-220, 220],
	});

	if (isLandscape) {
		return (
			<View style={[styles.container, containerStyle]} testID={testID}>
				<View style={styles.landscapeWrap}>
					<SkeletonBlock
						shimmerOffset={shimmerOffset}
						style={styles.landscapeImage}
					/>
					<View style={styles.landscapeContent}>
						<View style={styles.landscapeHeader}>
							<SkeletonBlock
								shimmerOffset={shimmerOffset}
								style={styles.landscapeTitle}
							/>
							<SkeletonBlock
								shimmerOffset={shimmerOffset}
								style={styles.landscapeSubtitle}
							/>
						</View>
						<View style={styles.landscapeBottom}>
							<SkeletonBlock
								shimmerOffset={shimmerOffset}
								style={styles.landscapePrice}
							/>
							<SkeletonBlock
								shimmerOffset={shimmerOffset}
								style={styles.landscapeButton}
							/>
						</View>
					</View>
				</View>
			</View>
		);
	}

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<SkeletonBlock
				shimmerOffset={shimmerOffset}
				style={styles.portraitImage}
			/>
			<View style={styles.portraitWrap}>
				<View style={styles.portraitContent}>
					<SkeletonBlock
						shimmerOffset={shimmerOffset}
						style={styles.portraitTitle}
					/>
					<SkeletonBlock
						shimmerOffset={shimmerOffset}
						style={styles.portraitSubtitle}
					/>
				</View>
				<View style={styles.portraitPriceRow}>
					<SkeletonBlock
						shimmerOffset={shimmerOffset}
						style={styles.portraitPrice}
					/>
					<SkeletonBlock
						shimmerOffset={shimmerOffset}
						style={styles.portraitButton}
					/>
				</View>
			</View>
		</View>
	);
};
