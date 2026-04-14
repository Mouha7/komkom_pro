import React, { useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	CartAppBar,
	SupportActionBar,
	SupportContactCard,
	SupportContextCard,
	SupportFaqItem,
	SupportHoursCard,
	SUPPORT_ACTION_BAR_HEIGHT,
	Text,
} from '../../components';
import { useToast } from '../../hooks/useToast';
import { getCustomerSupportData } from '../../mocks';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { lightColors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

type CustomerSupportScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'CustomerSupport'
>;

const BOTTOM_BAR_EXTRA_PADDING = spacing.s2;

export const CustomerSupportScreen: React.FC<CustomerSupportScreenProps> = ({
	navigation,
	route,
}) => {
	const insets = useSafeAreaInsets();
	const { showToast } = useToast();
	const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
	const orderId = route.params?.orderId;
	const data = useMemo(() => getCustomerSupportData(orderId), [orderId]);

	const handleOpenLink = async (url: string, label: string): Promise<void> => {
		try {
			const isSupported = await Linking.canOpenURL(url);

			if (!isSupported) {
				showToast({
					tone: 'warning',
					title: 'Action indisponible',
					message: 'Impossible d\'ouvrir ' + label + ' sur cet appareil.',
				});
				return;
			}

			await Linking.openURL(url);
		} catch {
			showToast({
				tone: 'danger',
				title: 'Ouverture impossible',
				message: 'Le lien ' + label + ' n\'a pas pu etre ouvert.',
			});
		}
	};

	return (
		<View style={styles.screen}>
			<CartAppBar
				title={data.screenTitle}
				onPressBack={() => navigation.goBack()}
				hideRightButton
			/>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.contentContainer,
					{
						paddingBottom:
							SUPPORT_ACTION_BAR_HEIGHT +
							Math.max(insets.bottom, spacing.s2) +
							BOTTOM_BAR_EXTRA_PADDING +
							spacing.s4,
					},
				]}
				showsVerticalScrollIndicator={false}
			>
				<SupportContextCard
					title={data.context.title}
					subtitle={data.context.subtitle}
					iconName={data.context.iconName}
				/>

				<View style={styles.sectionBlock}>
					<Text variant='h3' style={styles.sectionTitle}>
						{data.faqSectionTitle}
					</Text>
					<View style={styles.faqList}>
						{data.faqItems.map((item) => (
							<SupportFaqItem
								key={item.id}
								title={item.title}
								description={item.description}
								iconName={item.iconName}
								isExpanded={expandedFaqId === item.id}
								onPress={() => {
									setExpandedFaqId((current) =>
										current === item.id ? null : item.id,
									);
								}}
							/>
						))}
					</View>
				</View>

				<View style={styles.sectionBlock}>
					<Text variant='h3' style={styles.sectionTitle}>
						{data.contactSectionTitle}
					</Text>
					<View style={styles.contactGrid}>
						{data.contactChannels.map((channel) => (
							<SupportContactCard
								key={channel.id}
								label={channel.label}
								value={channel.value}
								iconName={channel.iconName}
								onPress={() => {
									void handleOpenLink(channel.href, channel.label.toLowerCase());
								}}
								containerStyle={styles.contactCard}
							/>
						))}
					</View>
				</View>

				<SupportHoursCard
					label={data.supportHoursLabel}
					description={data.supportHoursText}
				/>
			</ScrollView>

			<SupportActionBar
				onPressCall={() => {
					void handleOpenLink(data.callCtaHref, 'l\'appel');
				}}
				onPressChat={() => {
					void handleOpenLink(data.chatCtaHref, 'le chat');
				}}
				callLabel={data.callCtaLabel}
				chatLabel={data.chatCtaLabel}
				containerStyle={{
					paddingBottom: Math.max(insets.bottom, spacing.s2) + BOTTOM_BAR_EXTRA_PADDING,
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: lightColors.background.default,
	},
	scrollView: {
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: spacing.s3 + spacing.s0,
		paddingTop: spacing.s4,
		gap: spacing.s4,
	},
	sectionBlock: {
		gap: spacing.s2,
	},
	sectionTitle: {
		fontWeight: '700',
	},
	faqList: {
		gap: spacing.s1,
	},
	contactGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		rowGap: spacing.s1,
	},
	contactCard: {
		width: '48.5%',
	},
});

export default CustomerSupportScreen;