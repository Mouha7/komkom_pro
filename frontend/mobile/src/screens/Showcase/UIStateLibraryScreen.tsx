import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import {
	AppBar,
	BottomBar,
	CartList,
	ConfirmDialog,
	EmptyState,
	ErrorState,
	Icon,
	NotificationToast,
	OrderList,
	ProductCard,
	ProductCardSkeleton,
	SkeletonListItem,
	Text,
} from '../../components';
import type {
	BottomBarAction,
	CartItemData,
	CommonIconName,
	NotificationTone,
	OrderSummaryItem,
} from '../../components';
import { styles } from './UIStateLibraryScreen.styles';

type ToastItem = {
	id: string;
	tone: NotificationTone;
	title: string;
	message: string;
};

const initialToasts: ToastItem[] = [
	{
		id: 'success-order',
		tone: 'success',
		title: 'Commande confirmee',
		message: 'Votre commande #CMD-1029 a ete enregistree avec succes.',
	},
	{
		id: 'warning-stock',
		tone: 'warning',
		title: 'Stock limite',
		message: 'Il ne reste que 2 articles pour le Ciment SOCOCIM en stock.',
	},
	{
		id: 'danger-permission',
		tone: 'danger',
		title: 'Action impossible',
		message: "Vous n'avez pas les droits necessaires pour modifier ce magasin.",
	},
	{
		id: 'info-catalog',
		tone: 'info',
		title: 'Nouveau catalogue disponible',
		message: 'Les prix ont ete mis a jour pour la categorie Electricite.',
	},
];

const commonIcons: CommonIconName[] = [
	'home',
	'cart',
	'package',
	'user',
	'settings',
	'search',
	'plus',
	'minus',
	'close',
	'check',
	'alert',
	'info',
	'wifiOff',
	'arrowLeft',
	'trash',
];

const buildBottomActions = (): BottomBarAction[] => [
	{
		id: 'home',
		label: 'Accueil',
		iconName: 'home',
		onPress: () => Alert.alert('Navigation', 'Ouverture de la page Accueil (MVP).'),
	},
	{
		id: 'cart',
		label: 'Panier',
		iconName: 'cart',
		badge: 2,
		onPress: () => Alert.alert('Navigation', 'Ouverture du Panier (MVP).'),
	},
	{
		id: 'orders',
		label: 'Commandes',
		iconName: 'package',
		onPress: () => Alert.alert('Navigation', 'Ouverture des Commandes (MVP).'),
	},
	{
		id: 'profile',
		label: 'Profil',
		iconName: 'user',
		onPress: () => Alert.alert('Navigation', 'Ouverture du Profil (MVP).'),
	},
];

const cartItemsPreview: CartItemData[] = [
	{
		productId: 'prod-perceuse',
		brand: 'PROTOOL',
		name: 'Perceuse Visseuse sans fil 18V avec 2 batteries',
		price: 35000,
		currency: 'FCFA',
		quantity: 1,
		description: 'Unite',
		stockStatus: 'in_stock',
		imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
	},
	{
		productId: 'prod-ciment',
		brand: 'BUILDMAT',
		name: 'Ciment Portland CPJ 45 - Sac de 50kg',
		price: 4500,
		currency: 'FCFA',
		quantity: 20,
		description: '4 500 / Sac',
		stockStatus: 'low_stock',
		imageUrl: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=400&q=80',
	},
];

const ordersPreview: OrderSummaryItem[] = [
	{
		id: 'cmd-1029',
		reference: 'CMD-1029',
		total: 34950,
		currency: 'FCFA',
		status: 'pending',
		createdAt: '2026-03-12T10:00:00.000Z',
	},
	{
		id: 'cmd-1030',
		reference: 'CMD-1030',
		total: 87200,
		currency: 'FCFA',
		status: 'confirmed',
		createdAt: '2026-03-13T15:30:00.000Z',
	},
	{
		id: 'cmd-1031',
		reference: 'CMD-1031',
		total: 19100,
		currency: 'FCFA',
		status: 'delivered',
		createdAt: '2026-03-15T09:45:00.000Z',
	},
];

const portraitProductsPreview = [
	{
		productId: 'prod-ciment',
		name: 'Ciment Portland CPJ 35',
		price: 4500,
		currency: 'FCFA',
		description: 'Sac de 50 kg',
		imageUrl: 'https://via.placeholder.com/300x400?text=Ciment',
		stockStatus: 'in_stock' as const,
	},
	{
		productId: 'prod-peinture',
		name: 'Peinture Blanche Mat 20L',
		price: 18900,
		currency: 'FCFA',
		description: 'Seau interieur',
		imageUrl: 'https://via.placeholder.com/300x400?text=Peinture',
		stockStatus: 'low_stock' as const,
	},
];

const landscapeProductsPreview = [
	{
		productId: 'prod-perceuse',
		name: 'Perceuse Visseuse sans fil 18V',
		price: 35000,
		currency: 'FCFA',
		description: 'Unité',
		imageUrl: 'https://via.placeholder.com/400x300?text=Perceuse',
		stockStatus: 'in_stock' as const,
	},
	{
		productId: 'prod-meuleuse',
		name: 'Meuleuse 2200W',
		price: 27900,
		currency: 'FCFA',
		description: 'Disque 230 mm',
		imageUrl: 'https://via.placeholder.com/400x300?text=Meuleuse',
		stockStatus: 'out_of_stock' as const,
	},
];

export const UIStateLibraryScreen: React.FC = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [toasts, setToasts] = useState<ToastItem[]>(initialToasts);

	const visibleToasts = useMemo(() => toasts, [toasts]);
	const bottomActions = useMemo(() => buildBottomActions(), []);

	const removeToast = (toastId: string): void => {
		setToasts((current) => current.filter((toast) => toast.id !== toastId));
	};

	const onConfirmDelete = (): void => {
		setDialogOpen(false);
		Alert.alert('Suppression confirmee', "L'employe a ete supprime dans cette simulation UI.");
	};

	return (
		<View style={styles.safeArea}>
			<AppBar
				title="Composants & Etats UI"
				leftIconName="arrowLeft"
				onPressLeft={() => Alert.alert('Navigation', 'Retour (MVP).')}
				rightActions={[
					{
						id: 'open-settings',
						iconName: 'settings',
						onPress: () => Alert.alert('Action', 'Ouverture des parametres (MVP).'),
						accessibilityLabel: 'Ouvrir les parametres',
					},
				]}
			/>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						ICONES COMMUNES
					</Text>
					<View style={styles.iconGrid}>
						{commonIcons.map((name) => (
							<View key={name} style={styles.iconCard}>
								<Icon name={name} size={24} color="#0F1724" accessibilityLabel={name} />
								<Text variant="small" color="secondary">
									{name}
								</Text>
							</View>
						))}
					</View>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						ETAT VIDE (EMPTY STATE)
					</Text>
					<EmptyState
						title="Votre panier est vide"
						description="Decouvrez notre catalogue pour ajouter des articles a votre panier."
						actionLabel="Explorer le catalogue"
						onActionPress={() => Alert.alert('Action', 'Ouverture du catalogue (simulation).')}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						ETAT D'ERREUR (ERROR STATE)
					</Text>
					<ErrorState
						title="Erreur reseau"
						description="Impossible de joindre le serveur. Veuillez verifier votre connexion internet et reessayer."
						actionLabel="Reessayer"
						onActionPress={() => Alert.alert('Retry', 'Nouvelle tentative (simulation).')}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						NOTIFICATIONS & TOASTS
					</Text>
					<View style={styles.toastsWrap}>
						{visibleToasts.map((toast) => (
							<NotificationToast
								key={toast.id}
								tone={toast.tone}
								title={toast.title}
								message={toast.message}
								onClose={() => removeToast(toast.id)}
							/>
						))}
					</View>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						FENETRE DE DIALOGUE (CONFIRM MODAL)
					</Text>
					<EmptyState
						title="Action sensible"
						description="Ouvrez la fenetre de confirmation pour visualiser le composant de dialogue."
						actionLabel="Ouvrir la confirmation"
						onActionPress={() => setDialogOpen(true)}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						SKELETON LOADERS (LISTES)
					</Text>
					<View style={styles.skeletonWrap}>
						<SkeletonListItem />
						<SkeletonListItem lineWidths={[0.9, 0.62, 0.42]} />
					</View>
					<Text variant="overline" color="secondary">
						SKELETON LOADERS (PRODUCT CARD)
					</Text>
					<View style={styles.skeletonWrap}>
						<View style={styles.skeletonRow}>
							<ProductCardSkeleton variant="portrait" containerStyle={styles.productCardPortrait} />
							<ProductCardSkeleton variant="portrait" containerStyle={styles.productCardPortrait} />
						</View>
						<ProductCardSkeleton variant="landscape" containerStyle={styles.productCardLandscape} />
					</View>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						LISTE PRODUITS - PORTRAIT
					</Text>
					<View style={styles.skeletonRow}>
						{portraitProductsPreview.map((product) => (
							<ProductCard
								key={product.productId}
								{...product}
								containerStyle={styles.productCardPortrait}
								onPress={(id) => Alert.alert('Navigation', `Ouvrir detail produit: ${id}`)}
								onAddToCart={(id) => Alert.alert('Panier', `Ajouter au panier: ${id}`)}
							/>
						))}
					</View>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						LISTE PRODUITS - LANDSCAPE
					</Text>
					<View style={styles.skeletonWrap}>
						{landscapeProductsPreview.map((product) => (
							<ProductCard
								key={product.productId}
								{...product}
								variant="landscape"
								containerStyle={styles.productCardLandscape}
								onPress={(id) => Alert.alert('Navigation', `Ouvrir detail produit: ${id}`)}
								onAddToCart={(id) => Alert.alert('Panier', `Ajouter au panier: ${id}`)}
							/>
						))}
					</View>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						CART LIST (ORGANISM)
					</Text>
					<CartList
						items={cartItemsPreview}
						containerStyle={styles.listPreview}
						onIncreaseQty={(productId) =>
							Alert.alert('Panier', `Augmenter quantite: ${productId}`)
						}
						onDecreaseQty={(productId) =>
							Alert.alert('Panier', `Diminuer quantite: ${productId}`)
						}
						onRemoveItem={(productId) =>
							Alert.alert('Panier', `Supprimer produit: ${productId}`)
						}
						onCheckout={() => Alert.alert('Panier', 'Passer la commande (MVP).')}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						ORDER LIST (ORGANISM)
					</Text>
					<OrderList
						orders={ordersPreview}
						containerStyle={styles.listPreview}
						onPressOrder={(orderId) => Alert.alert('Commande', `Ouvrir detail: ${orderId}`)}
					/>
				</View>
			</ScrollView>

			<BottomBar actions={bottomActions} activeActionId="home" />

			<ConfirmDialog
				visible={dialogOpen}
				tone="danger"
				icon={<Icon name="trash" size={24} color="#B91C1C" />}
				title="Supprimer l'employe ?"
				description="Etes-vous sur de vouloir revoquer l'acces de Moussa Diop ? Cette action est irreversible."
				cancelLabel="Annuler"
				confirmLabel="Supprimer"
				onCancel={() => setDialogOpen(false)}
				onConfirm={onConfirmDelete}
			/>
		</View>
	);
};
