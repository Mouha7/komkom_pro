export interface LegalSection {
	title: string;
	paragraphs: string[];
}

export interface LegalDocumentContent {
	title: string;
	lastUpdated: string;
	intro: string[];
	sections: LegalSection[];
}

export const TERMS_OF_USE_CONTENT: LegalDocumentContent = {
	title: "Conditions d'utilisation",
	lastUpdated: "24 mars 2026",
	intro: [
		"Ces conditions d'utilisation encadrent l'acces et l'usage de KomKom, application de commande professionnelle de quincaillerie.",
		"En creant un compte ou en utilisant l'application, vous confirmez avoir lu et accepte ces conditions.",
	],
	sections: [
		{
			title: "1. Identite de l'editeur",
			paragraphs: [
				"Raison sociale: [A COMPLETER - Raison sociale de l'entite].",
				"Adresse du siege: [A COMPLETER - Adresse complete].",
				"Contact: [A COMPLETER - Email de contact legal].",
			],
		},
		{
			title: "2. Objet du service",
			paragraphs: [
				"KomKom permet aux professionnels de creer un compte, renseigner leur magasin, consulter des produits et passer des commandes selon les fonctionnalites disponibles.",
				"Le service peut evoluer pour des raisons techniques, de securite ou de conformite.",
			],
		},
		{
			title: "3. Creation de compte et exactitude des informations",
			paragraphs: [
				"Vous devez fournir des informations exactes, completes et a jour lors de l'inscription.",
				"Vous etes responsable de la confidentialite de vos identifiants et de toute activite effectuee depuis votre compte.",
			],
		},
		{
			title: "4. Regles d'usage",
			paragraphs: [
				"Vous vous engagez a utiliser KomKom conformement a la loi et a ne pas porter atteinte aux droits de tiers.",
				"Sont notamment interdits: tentative d'acces non autorise, usage frauduleux, usurpation d'identite, extraction massive de donnees, diffusion de contenus illicites.",
			],
		},
		{
			title: "5. Commandes, prix et disponibilite",
			paragraphs: [
				"Les prix, frais et disponibilites affiches dans l'application peuvent etre modifies et doivent etre confirms au moment de la commande.",
				"Les conditions commerciales detaillees (livraison, retours, annulations) sont precisees dans les politiques commerciales applicables.",
			],
		},
		{
			title: "6. Propriete intellectuelle",
			paragraphs: [
				"Les elements de l'application (marques, logos, textes, interfaces, contenus) sont proteges et restent la propriete de leurs titulaires respectifs.",
				"Toute reproduction ou exploitation non autorisee est interdite.",
			],
		},
		{
			title: "7. Disponibilite du service et responsabilite",
			paragraphs: [
				"KomKom est fourni en l'etat, sous reserve des limites legales applicables.",
				"Nous mettons en oeuvre des moyens raisonnables pour assurer la disponibilite et la securite du service, sans garantie d'absence totale d'interruption ou d'erreur.",
			],
		},
		{
			title: "8. Suspension et suppression de compte",
			paragraphs: [
				"En cas de non-respect des presentes conditions ou de risque de securite, nous pouvons suspendre ou supprimer un compte, temporairement ou definitivement.",
				"Vous pouvez demander la fermeture de votre compte via: [A COMPLETER - canal de demande].",
			],
		},
		{
			title: "9. Modifications des conditions",
			paragraphs: [
				"Ces conditions peuvent etre mises a jour pour refleter les evolutions du service, du droit ou des obligations de conformite.",
				"La date de derniere mise a jour figure en tete du document.",
			],
		},
		{
			title: "10. Droit applicable et litiges",
			paragraphs: [
				"Droit applicable: [A COMPLETER - droit national applicable].",
				"En cas de litige, les parties rechercheront une solution amiable avant toute action judiciaire.",
				"Juridiction competente: [A COMPLETER - tribunal competent].",
			],
		},
		{
			title: "11. Contact",
			paragraphs: [
				"Pour toute question sur ces conditions: [A COMPLETER - email/legal contact].",
			],
		},
	],
};

export const PRIVACY_POLICY_CONTENT: LegalDocumentContent = {
	title: "Politique de confidentialite",
	lastUpdated: "24 mars 2026",
	intro: [
		"Cette politique explique comment KomKom collecte, utilise, partage et protege vos donnees personnelles.",
		"Elle est redigee selon les principes de transparence et de clarte, dans l'esprit des exigences RGPD/CNIL, a adapter au cadre legal local applicable.",
	],
	sections: [
		{
			title: "1. Responsable de traitement",
			paragraphs: [
				"Responsable de traitement: [A COMPLETER - raison sociale].",
				"Adresse: [A COMPLETER - adresse complete].",
				"Contact protection des donnees: [A COMPLETER - email dedie ou DPO].",
			],
		},
		{
			title: "2. Donnees collectees",
			paragraphs: [
				"Donnees d'identification et de contact: nom du magasin, nom du responsable, telephone professionnel, email.",
				"Donnees de localisation: adresse et coordonnees GPS du magasin.",
				"Donnees techniques: journaux applicatifs, informations de securite, donnees de session et de diagnostic.",
			],
		},
		{
			title: "3. Finalites et bases legales",
			paragraphs: [
				"Creation et gestion de compte professionnel: execution du contrat ou mesures precontractuelles.",
				"Gestion des commandes, livraisons et support: execution du contrat.",
				"Securisation de la plateforme et prevention de la fraude: interet legitime et obligations legales le cas echeant.",
				"Prospection commerciale (si activee): consentement ou interet legitime selon le cadre applicable.",
			],
		},
		{
			title: "4. Destinataires des donnees",
			paragraphs: [
				"Equipes internes habilitees (operation, support, securite).",
				"Sous-traitants techniques (hebergement, services d'authentification, messagerie, analytics) strictement limites a leurs missions.",
				"Partenaires logistiques et commerciaux, uniquement pour executer les services demandes.",
			],
		},
		{
			title: "5. Durees de conservation",
			paragraphs: [
				"Les donnees sont conservees pendant la duree necessaire aux finalites decrites, puis archivees ou supprimees selon les obligations legales.",
				"Exemples de durees a formaliser: [A COMPLETER - grille de retention par categorie de donnees].",
			],
		},
		{
			title: "6. Transferts internationaux",
			paragraphs: [
				"Si des traitements impliquent un transfert hors du pays de reference, des garanties appropriees sont mises en place selon la reglementation applicable.",
				"Informations detaillees sur demande a: [A COMPLETER - contact].",
			],
		},
		{
			title: "7. Vos droits",
			paragraphs: [
				"Selon la loi applicable, vous disposez de droits d'acces, rectification, effacement, limitation, opposition, portabilite et retrait du consentement quand le traitement repose sur celui-ci.",
				"Vous pouvez exercer vos droits via: [A COMPLETER - email/formulaire].",
				"Un justificatif d'identite peut etre demande en cas de doute raisonnable.",
			],
		},
		{
			title: "8. Securite des donnees",
			paragraphs: [
				"Des mesures techniques et organisationnelles proportionnees sont appliquees pour proteger les donnees contre l'acces non autorise, l'alteration, la perte ou la divulgation.",
				"Aucune methode de transmission ou de stockage n'etant totalement infaillible, nous renforcons en continu nos dispositifs de securite.",
			],
		},
		{
			title: "9. Cookies et technologies similaires",
			paragraphs: [
				"Selon les plateformes (mobile/web), des traceurs peuvent etre utilises pour la session, la mesure d'audience et l'amelioration du service.",
				"Les informations detaillees et vos choix seront presentes dans une politique cookies dediee si necessaire.",
			],
		},
		{
			title: "10. Mises a jour de la politique",
			paragraphs: [
				"Cette politique peut etre modifiee pour refleter les evolutions de nos pratiques ou de la reglementation.",
				"La date de derniere mise a jour figure en tete du document.",
			],
		},
		{
			title: "11. Reclamations et autorite de controle",
			paragraphs: [
				"Si vous estimez que vos droits ne sont pas respectes, vous pouvez introduire une reclamation aupres de l'autorite de controle competente.",
				"Autorite competente: [A COMPLETER - autorite locale de protection des donnees].",
			],
		},
	],
};
