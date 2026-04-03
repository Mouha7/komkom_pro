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
import { useResponsive } from "../../../hooks/useResponsive";
import { lightColors } from "../../../styles/colors";
import { clamp } from "../../../styles/responsive";
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

export const HomePromoCarousel: React.FC<HomePromoCarouselProps> = ({
	items,
	autoPlayIntervalMs = 6000,
	onPressItem,
}) => {
	const { isExpanded } = useResponsive();
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

	const bannerHeight = useMemo(() => {
		if (bannerWidth === 0) {
			return 0;
		}

		return isExpanded ? clamp(bannerWidth * 0.28, 96, 138) : clamp(bannerWidth * 0.26, 88, 120);
	}, [bannerWidth, isExpanded]);

	const ctaWidth = useMemo(() => {
		if (bannerWidth === 0) {
			return 132;
		}

		return isExpanded ? clamp(bannerWidth * 0.24, 136, 168) : clamp(bannerWidth * 0.3, 104, 144);
	}, [bannerWidth, isExpanded]);

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
							bannerHeight > 0 ? { height: bannerHeight } : null,
							item.backgroundColor
								? { backgroundColor: item.backgroundColor }
								: null,
						]}
						accessibilityRole="button"
						accessibilityLabel={`Ouvrir la promotion ${item.title}`}
					>
						{!item.backgroundColor ? (
							<View style={styles.gradientLayer} pointerEvents="none">
								<Svg
									style={StyleSheet.absoluteFillObject}
									width={bannerWidth || "100%"}
									height={bannerHeight || "100%"}
									viewBox={`0 0 ${bannerWidth || 1} ${bannerHeight || 1}`}
								>
									<Defs>
										<SvgLinearGradient
											id={`promoGradient-${item.id}`}
											gradientUnits="userSpaceOnUse"
											x1={0}
											y1={0}
											x2={bannerWidth || 1}
											y2={bannerHeight || 1}
										>
											<Stop offset="0" stopColor={BANNER_GRADIENT_START} />
											<Stop offset="1" stopColor={BANNER_GRADIENT_END} />
										</SvgLinearGradient>
									</Defs>
									<Rect
										x={0}
										y={0}
										width={bannerWidth || 1}
										height={bannerHeight || 1}
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
                                        maxLines={2}
									>
										{item.description}
									</Text>
								) : null}
							</View>
							{item.ctaLabel ? (
								<View style={[styles.ctaPill, { width: ctaWidth }]}>
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
		height: 95,
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
		justifyContent: "space-between",
		columnGap: spacing.s2,
	},
	textBlock: {
		flex: 1,
		minWidth: 0,
		flexShrink: 1,
	},
	ctaPill: {
		backgroundColor: lightColors.surface.default,
		paddingHorizontal: spacing.s2,
		paddingVertical: spacing.s1,
		borderRadius: 6,
		width: 132,
		flexShrink: 0,
		alignItems: "center",
		justifyContent: "center",
	},
});
