export type NotificationTone = "success" | "info" | "warning" | "error";

export type NotificationActionTone = "default" | "primary" | "danger";

export type NotificationIconName =
	| "checkCircle"
	| "package"
	| "alert"
	| "close"
	| "fileText"
	| "smartphone";

export type NotificationDestination =
	| {
			kind: "order-detail";
			orderId: string;
	  }
	| {
			kind: "catalog";
			categoryId?: string;
			categoryLabel?: string;
	  }
	| {
			kind: "checkout";
	  }
	| {
			kind: "invoice";
			orderId: string;
	  }
	| {
			kind: "toast";
			title: string;
			message: string;
			tone?: "success" | "warning" | "danger" | "info";
	  };

export interface NotificationModel {
	id: string;
	title: string;
	message: string;
	timeLabel: string;
	tone: NotificationTone;
	iconName: NotificationIconName;
	isRead: boolean;
	actionLabel?: string;
	actionTone?: NotificationActionTone;
	destination?: NotificationDestination;
}

export const NOTIFICATIONS: NotificationModel[] = [
	{
		id: "notif-1",
		title: "Commande livree",
		message:
			"Votre commande #KK-84920 a ete livree avec succes. Confirmez la reception pour finaliser la transaction.",
		timeLabel: "10:45",
		tone: "success",
		iconName: "checkCircle",
		isRead: false,
		actionLabel: "Voir commande",
		actionTone: "primary",
		destination: {
			kind: "order-detail",
			orderId: "cmd-1029",
		},
	},
	{
		id: "notif-2",
		title: "Nouveau catalogue disponible",
		message:
			"Decouvrez notre nouvelle selection d'outillage electroportatif avec des remises exclusives pour les grossistes.",
		timeLabel: "Hier",
		tone: "info",
		iconName: "package",
		isRead: false,
		actionLabel: "Voir les produits",
		actionTone: "default",
		destination: {
			kind: "catalog",
			categoryId: "outillage",
			categoryLabel: "Outillage",
		},
	},
	{
		id: "notif-3",
		title: "Alerte stock limite",
		message:
			"Attention, le Ciment Portland CEM II 50kg est bientot en rupture de stock. Anticipez vos futures commandes.",
		timeLabel: "12 Oct",
		tone: "warning",
		iconName: "alert",
		isRead: true,
		actionLabel: "Commander maintenant",
		actionTone: "default",
		destination: {
			kind: "catalog",
			categoryId: "gros-oeuvre",
			categoryLabel: "Gros oeuvre",
		},
	},
	{
		id: "notif-4",
		title: "Echec du paiement",
		message:
			"Le paiement de 132 500 FCFA pour la commande #KK-84918 a echoue. Veuillez verifier votre solde ou changer de methode.",
		timeLabel: "11 Oct",
		tone: "error",
		iconName: "close",
		isRead: true,
		actionLabel: "Reessayer le paiement",
		actionTone: "danger",
		destination: {
			kind: "checkout",
		},
	},
	{
		id: "notif-5",
		title: "Paiement recu",
		message:
			"Votre reglement par Mobile Money (Wave) a bien ete traite. La facture est desormais disponible au telechargement.",
		timeLabel: "10 Oct",
		tone: "success",
		iconName: "fileText",
		isRead: true,
		actionLabel: "Voir la facture",
		actionTone: "default",
		destination: {
			kind: "invoice",
			orderId: "cmd-1029",
		},
	},
];
