import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import {
	AppBar,
	BottomBar,
	CartList,
	ConfirmDialog,
	EmptyState,
	ErrorState,
	Icon,
	IconOnlyButton,
	NotificationToast,
	OrderList,
	ProductCardList,
	SkeletonListItem,
	Text,
} from "../../components";
import type {
	BottomBarAction,
	CartItemData,
	CommonIconName,
	NotificationTone,
	OrderSummaryItem,
} from "../../components";
import { styles } from "./UIStateLibraryScreen.styles";
import type { ProductListItemData } from "../../components";
import { listProducts } from "../../api/products";
import { useCart } from "../../hooks/useCart";
import { useOrders } from "../../hooks/useOrders";

type ToastItem = {
	id: string;
	tone: NotificationTone;
	title: string;
	message: string;
};

const initialToasts: ToastItem[] = [
	{
		id: "success-order",
		tone: "success",
		title: "Commande confirmee",
		message: "Votre commande #CMD-1029 a ete enregistree avec succes.",
	},
	{
		id: "warning-stock",
		tone: "warning",
		title: "Stock limite",
		message: "Il ne reste que 2 articles pour le Ciment SOCOCIM en stock.",
	},
	{
		id: "danger-permission",
		tone: "danger",
		title: "Action impossible",
		message: "Vous n'avez pas les droits necessaires pour modifier ce magasin.",
	},
	{
		id: "info-catalog",
		tone: "info",
		title: "Nouveau catalogue disponible",
		message: "Les prix ont ete mis a jour pour la categorie Electricite.",
	},
];

const commonIcons: CommonIconName[] = [
	"home",
	"cart",
	"package",
	"user",
	"settings",
	"search",
	"plus",
	"minus",
	"close",
	"check",
	"alert",
	"info",
	"wifiOff",
	"arrowLeft",
	"trash",
];

const buildBottomActions = (): BottomBarAction[] => [
	{
		id: "home",
		label: "Accueil",
		iconName: "home",
		onPress: () =>
			Alert.alert("Navigation", "Ouverture de la page Accueil (MVP)."),
	},
	{
		id: "cart",
		label: "Panier",
		iconName: "cart",
		badge: 2,
		onPress: () => Alert.alert("Navigation", "Ouverture du Panier (MVP)."),
	},
	{
		id: "orders",
		label: "Commandes",
		iconName: "package",
		onPress: () =>
			Alert.alert("Navigation", "Ouverture des Commandes (MVP)."),
	},
	{
		id: "profile",
		label: "Profil",
		iconName: "user",
		onPress: () => Alert.alert("Navigation", "Ouverture du Profil (MVP)."),
	},
];

export const UIStateLibraryScreen: React.FC = () => {
	const { items: cartItems } = useCart();
	const { orders } = useOrders();
	const [products, setProducts] = useState<ProductListItemData[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [toasts, setToasts] = useState<ToastItem[]>(initialToasts);

	useEffect(() => {
		let isMounted = true;
		void listProducts({ perPage: 12 })
			.then((nextProducts) => {
				if (isMounted) {
					setProducts(nextProducts);
				}
			})
			.catch(() => {
				if (isMounted) {
					setProducts([]);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const visibleToasts = useMemo(() => toasts, [toasts]);
	const bottomActions = useMemo(() => buildBottomActions(), []);
	const cartItemsPreview: CartItemData[] = cartItems;
	const ordersPreview: OrderSummaryItem[] = orders;
	const portraitProductsPreview = products.slice(0, 2);
	const landscapeProductsPreview = products.slice(2, 4);

	const removeToast = (toastId: string): void => {
		setToasts((current) => current.filter((toast) => toast.id !== toastId));
	};

	const onConfirmDelete = (): void => {
		setDialogOpen(false);
		Alert.alert(
			"Suppression confirmee",
			"L'employe a ete supprime dans cette simulation UI.",
		);
	};

	return (
		<View style={styles.safeArea}>
			<AppBar
				title="Composants & Etats UI"
				leftIconName="arrowLeft"
				onPressLeft={() => Alert.alert("Navigation", "Retour (MVP).")}
				rightActions={[
					{
						id: "open-settings",
						iconName: "settings",
						onPress: () =>
							Alert.alert(
								"Action",
								"Ouverture des parametres (MVP).",
							),
						accessibilityLabel: "Ouvrir les parametres",
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
								<Icon
									name={name}
									size={24}
									color="#0F1724"
									accessibilityLabel={name}
								/>
								<Text variant="small" color="secondary">
									{name}
								</Text>
							</View>
						))}
						<IconOnlyButton
							iconName="arrowLeft"
							onPress={() => null}
							//   onPress={() => navigation.goBack()}
							accessibilityLabel="Retour"
						/>
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
						onActionPress={() =>
							Alert.alert(
								"Action",
								"Ouverture du catalogue (simulation).",
							)
						}
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
						onActionPress={() =>
							Alert.alert(
								"Retry",
								"Nouvelle tentative (simulation).",
							)
						}
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
						<ProductCardList
							items={[]}
							isLoadingInitial
							skeletonCount={2}
						/>
						<ProductCardList
							items={[]}
							variant="landscape"
							isLoadingInitial
							skeletonCount={1}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						LISTE PRODUITS - PORTRAIT
					</Text>
					<ProductCardList
						items={portraitProductsPreview}
						isLoadingInitial={portraitProductsPreview.length === 0}
						onPressProduct={(id: string) =>
							Alert.alert("Navigation", `Ouvrir detail produit: ${id}`)
						}
						onAddToCart={(id: string) =>
							Alert.alert("Panier", `Ajouter au panier: ${id}`)
						}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						LISTE PRODUITS - LANDSCAPE
					</Text>
					<ProductCardList
						items={landscapeProductsPreview}
						variant="landscape"
						isLoadingInitial={landscapeProductsPreview.length === 0}
						onPressProduct={(id: string) =>
							Alert.alert("Navigation", `Ouvrir detail produit: ${id}`)
						}
						onAddToCart={(id: string) =>
							Alert.alert("Panier", `Ajouter au panier: ${id}`)
						}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						CART LIST (ORGANISM)
					</Text>
					<CartList
						items={cartItemsPreview}
						containerStyle={styles.listPreview}
						onRemoveItem={(productId) =>
							Alert.alert(
								"Panier",
								`Supprimer produit: ${productId}`,
							)
						}
						onCheckout={() =>
							Alert.alert("Panier", "Passer la commande (MVP).")
						}
					/>
				</View>

				<View style={styles.section}>
					<Text variant="overline" color="secondary">
						ORDER LIST (ORGANISM)
					</Text>
					<OrderList
						orders={ordersPreview}
						containerStyle={styles.listPreview}
						onPressOrder={(orderId) =>
							Alert.alert("Commande", `Ouvrir detail: ${orderId}`)
						}
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
