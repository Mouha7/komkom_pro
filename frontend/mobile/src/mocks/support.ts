import type { CommonIconName } from '../components';

import { getOrderTrackingDataById } from './orders';

export type SupportFaqItemMock = {
	id: string;
	title: string;
	description: string;
	iconName: CommonIconName;
};

export type SupportContactChannelMock = {
	id: string;
	label: string;
	value: string;
	iconName: CommonIconName;
	href: string;
};

export type SupportContextMock = {
	title: string;
	subtitle: string;
	iconName: CommonIconName;
};

export type CustomerSupportDataMock = {
	screenTitle: string;
	context: SupportContextMock;
	faqSectionTitle: string;
	faqItems: SupportFaqItemMock[];
	contactSectionTitle: string;
	contactChannels: SupportContactChannelMock[];
	supportHoursLabel: string;
	supportHoursText: string;
	callCtaLabel: string;
	callCtaHref: string;
	chatCtaLabel: string;
	chatCtaHref: string;
};

const SUPPORT_PHONE_NUMBER = '+221 33 800 00 00';
const SUPPORT_PHONE_HREF = 'tel:+221338000000';
const SUPPORT_EMAIL = 'support@komkom.sn';
const SUPPORT_EMAIL_HREF = 'mailto:support@komkom.sn';
const SUPPORT_HOURS_LABEL = 'Disponibilite du support';
const SUPPORT_HOURS_TEXT = 'Lundi au Samedi de 08:00 a 18:00';

const buildWhatsAppHref = (message: string): string => {
	return 'https://wa.me/221338000000?text=' + encodeURIComponent(message);
};

const buildOrderAwareFaqItems = (orderId?: string): SupportFaqItemMock[] => {
	if (!orderId) {
		return [
			{
				id: 'where-order',
				title: 'Ou est ma commande ? ',
				description:
					'Consulte le suivi de commande pour voir les etapes de preparation et de livraison. Si une etape semble bloquee, contacte notre equipe pour une verification manuelle.',
				iconName: 'truck',
			},
			{
				id: 'damaged-item',
				title: 'Article endommage',
				description:
					'Prepare une photo de l\'article et du colis recu. Notre equipe pourra accelerer le remplacement ou l\'ouverture d\'un retour.',
				iconName: 'packageOpen',
			},
			{
				id: 'billing',
				title: 'Probleme de facturation',
				description:
					'Pour toute anomalie sur le montant, le moyen de paiement ou la facture, notre equipe support peut verifier la transaction et te guider.',
				iconName: 'receipt',
			},
			{
				id: 'return',
				title: 'Demander un retour',
				description:
					'Le support peut confirmer l\'eligibilite du retour, rappeler les conditions et t\'indiquer les prochaines etapes selon ton dossier.',
				iconName: 'undo2',
			},
		];
	}

	const trackingData = getOrderTrackingDataById(orderId);

	return [
		{
			id: 'where-order',
			title: 'Ou est ma commande ? ',
			description:
				'La commande ' +
				trackingData.orderReference +
				' est actuellement en statut "' +
				trackingData.statusLabel +
				'". Depuis le suivi, tu peux verifier chaque etape et demander a notre equipe de confirmer toute anomalie.',
			iconName: 'truck',
		},
		{
			id: 'damaged-item',
			title: 'Article endommage',
			description:
				'Si un article de ' +
				trackingData.orderReference +
				' est endommage, prends des photos du colis et de l\'article. Le support pourra verifier le dossier et proposer un remplacement ou un retour.',
			iconName: 'packageOpen',
		},
		{
			id: 'billing',
			title: 'Probleme de facturation',
			description:
				'Notre equipe peut verifier la facture de ' +
				trackingData.orderReference +
				', confirmer le montant total et t\'aider si tu observes une incoherence de paiement.',
			iconName: 'receipt',
		},
		{
			id: 'return',
			title: 'Demander un retour',
			description:
				'Pour un retour sur ' +
				trackingData.orderReference +
				', le support verifiera l\'eligibilite du produit, la fenetre de retour et les instructions logistiques associees.',
			iconName: 'undo2',
		},
	];
};

const buildSupportContext = (orderId?: string): SupportContextMock => {
	if (!orderId) {
		return {
			title: 'Support general',
			subtitle: 'Choisis un sujet ou contacte directement notre equipe.',
			iconName: 'headphones',
		};
	}

	const trackingData = getOrderTrackingDataById(orderId);

	return {
		title: trackingData.orderReference,
		subtitle: trackingData.createdAtLabel,
		iconName: 'package',
	};
};

const buildChatHref = (context: SupportContextMock): string => {
	const message =
		context.title === 'Support general'
			? 'Bonjour KomKom, j\'ai besoin d\'assistance.'
			: 'Bonjour KomKom, j\'ai besoin d\'assistance pour la commande ' + context.title + '.';

	return buildWhatsAppHref(message);
};

const SUPPORT_CONTACT_CHANNELS: SupportContactChannelMock[] = [
	{
		id: 'phone',
		label: 'Telephone',
		value: SUPPORT_PHONE_NUMBER,
		iconName: 'phone',
		href: SUPPORT_PHONE_HREF,
	},
	{
		id: 'email',
		label: 'Email',
		value: SUPPORT_EMAIL,
		iconName: 'mail',
		href: SUPPORT_EMAIL_HREF,
	},
];

export const getCustomerSupportData = (orderId?: string): CustomerSupportDataMock => {
	const context = buildSupportContext(orderId);

	return {
		screenTitle: 'Support Client',
		context,
		faqSectionTitle: 'Besoin d\'aide ? ',
		faqItems: buildOrderAwareFaqItems(orderId),
		contactSectionTitle: 'Nous contacter',
		contactChannels: SUPPORT_CONTACT_CHANNELS,
		supportHoursLabel: SUPPORT_HOURS_LABEL,
		supportHoursText: SUPPORT_HOURS_TEXT,
		callCtaLabel: 'Appeler',
		callCtaHref: SUPPORT_PHONE_HREF,
		chatCtaLabel: 'Chat',
		chatCtaHref: buildChatHref(context),
	};
};