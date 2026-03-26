import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	FlatList,
	Pressable,
	StyleSheet,
	View,
	type LayoutChangeEvent,
} from "react-native";
import Svg, {
	Defs,
	LinearGradient as SvgLinearGradient,
	Rect,
	Stop,
} from "react-native-svg";

import { Text } from "../../../components";
import { lightColors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import type { HomePromoItem } from "./HomeSections.types";

type HomePromoCarouselProps = {
	items: HomePromoItem[];
	autoPlayIntervalMs?: number;
	onPressItem?: (item: HomePromoItem) => void;
};

const BANNER_GAP = spacing.s3;

// Gradient settings: edit these two colors if you want a different look.
const BANNER_GRADIENT_START = "#ED762F";
const BANNER_GRADIENT_END = "#C55A1F";
const INTERACTION_RESUME_DELAY_MS = 2500;

// Angle control (45deg): top-left -> bottom-right.
// To tweak direction, edit x1/y1/x2/y2 values.
const GRADIENT_VECTOR = {
	x1: "0%",
	y1: "0%",
	x2: "100%",
	y2: "100%",
};

export const HomePromoCarousel: React.FC<HomePromoCarouselProps> = ({
	items,
	autoPlayIntervalMs = 6000,
	onPressItem,
}) => {
	const listRef = useRef<FlatList<HomePromoItem>>(null);
	const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [containerWidth, setContainerWidth] = useState(0);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isInteracting, setIsInteracting] = useState(false);

	const scheduleAutoPlayResume = useCallback((): void => {
		if (resumeTimerRef.current) {
			clearTimeout(resumeTimerRef.current);
		}

		resumeTimerRef.current = setTimeout(() => {
			setIsInteracting(false);
		}, INTERACTION_RESUME_DELAY_MS);
	}, []);

	const markInteracting = useCallback((): void => {
		setIsInteracting(true);
		scheduleAutoPlayResume();
	}, [scheduleAutoPlayResume]);

	const canAutoPlay = useMemo(
		() => items.length > 1 && containerWidth > 0 && !isInteracting,
		[containerWidth, isInteracting, items.length],
	);

	const bannerWidth = useMemo(() => {
		if (containerWidth === 0) {
			return 0;
		}

		if (items.length <= 1) {
			return containerWidth;
		}

		return containerWidth - BANNER_GAP;
	}, [containerWidth, items.length]);

	const itemSpan = useMemo(() => {
		if (bannerWidth === 0) {
			return 0;
		}

		return items.length > 1 ? bannerWidth + BANNER_GAP : bannerWidth;
	}, [bannerWidth, items.length]);

	useEffect(() => {
		if (!canAutoPlay || itemSpan === 0) {
			return undefined;
		}

		const timer = setInterval(() => {
			setActiveIndex((prevIndex) => {
				const nextIndex =
					prevIndex + 1 >= items.length ? 0 : prevIndex + 1;
				listRef.current?.scrollToOffset({
					offset: nextIndex * itemSpan,
					animated: true,
				});
				return nextIndex;
			});
		}, autoPlayIntervalMs);

		return () => clearInterval(timer);
	}, [autoPlayIntervalMs, canAutoPlay, itemSpan, items.length]);

	useEffect(() => {
		return () => {
			if (resumeTimerRef.current) {
				clearTimeout(resumeTimerRef.current);
			}
		};
	}, []);

	if (items.length === 0) {
		return null;
	}

	const handleLayout = (event: LayoutChangeEvent): void => {
		const nextWidth = event.nativeEvent.layout.width;
		if (nextWidth !== containerWidth) {
			setContainerWidth(nextWidth);
		}
	};

	return (
		<View style={styles.wrapper} onLayout={handleLayout}>
			<FlatList
				ref={listRef}
				horizontal
				pagingEnabled
				data={items}
				keyExtractor={(item) => item.id}
				showsHorizontalScrollIndicator={false}
				snapToAlignment="start"
				snapToInterval={items.length > 1 ? itemSpan : undefined}
				decelerationRate="fast"
				disableIntervalMomentum
				contentContainerStyle={styles.listContent}
				ItemSeparatorComponent={
					items.length > 1
						? () => <View style={styles.separator} />
						: undefined
				}
				onTouchStart={markInteracting}
				onScrollBeginDrag={markInteracting}
				onScrollEndDrag={scheduleAutoPlayResume}
				onMomentumScrollEnd={(event) => {
					if (itemSpan === 0) {
						return;
					}

					const nextIndex = Math.round(
						event.nativeEvent.contentOffset.x / itemSpan,
					);
					setActiveIndex(nextIndex);
					scheduleAutoPlayResume();
				}}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => onPressItem?.(item)}
						style={[
							styles.banner,
							{ width: bannerWidth || undefined },
							item.backgroundColor
								? { backgroundColor: item.backgroundColor }
								: null,
						]}
						accessibilityRole="button"
						accessibilityLabel={`Ouvrir la promotion ${item.title}`}
					>
						{!item.backgroundColor ? (
							<View style={styles.gradientLayer} pointerEvents="none">
								<Svg width="100%" height="100%">
									<Defs>
										<SvgLinearGradient
											id={`promoGradient-${item.id}`}
											x1={GRADIENT_VECTOR.x1}
											y1={GRADIENT_VECTOR.y1}
											x2={GRADIENT_VECTOR.x2}
											y2={GRADIENT_VECTOR.y2}
										>
											<Stop offset="0%" stopColor={BANNER_GRADIENT_START} />
											<Stop offset="100%" stopColor={BANNER_GRADIENT_END} />
										</SvgLinearGradient>
									</Defs>
									<Rect
										x="0"
										y="0"
										width="100%"
										height="100%"
										fill={`url(#promoGradient-${item.id})`}
									/>
								</Svg>
							</View>
						) : null}
						<View style={styles.bannerRow}>
							<View style={styles.textBlock}>
								<Text
									variant="h2"
									style={{ fontSize: 18, fontWeight: "bold" }}
									textColorOverride={
										lightColors.text.onPrimary
									}
                                    maxLines={1}
								>
									{item.title}
								</Text>
								{item.description ? (
									<Text
										variant="body"
										style={{ fontSize: 13 }}
										textColorOverride={
											lightColors.text.onPrimary
										}
                                        maxLines={1}
									>
										{item.description}
									</Text>
								) : null}
							</View>
							{item.ctaLabel ? (
								<View style={styles.ctaPill}>
									<Text
										variant="body"
                                        style={{ fontSize: 13, fontWeight: "bold" }}
										textColorOverride={lightColors.primary}
									>
										{item.ctaLabel}
									</Text>
								</View>
							) : null}
						</View>
					</Pressable>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		rowGap: spacing.s2,
	},
	listContent: {
		paddingRight: spacing.s1,
	},
	separator: {
		width: BANNER_GAP,
	},
	banner: {
		backgroundColor: lightColors.primary,
		borderRadius: 8,
		height: 85,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s2,
		justifyContent: "center",
		overflow: "hidden",
		position: "relative",
	},
	gradientLayer: {
		...StyleSheet.absoluteFillObject,
	},
	bannerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
	},
	textBlock: {
		flex: 1,
		rowGap: spacing.s1,
	},
	ctaPill: {
		backgroundColor: lightColors.surface.default,
		paddingHorizontal: spacing.s3,
		paddingVertical: spacing.s1,
		borderRadius: 6,
		minWidth: 132,
		alignItems: "center",
		justifyContent: "center",
	},
});
