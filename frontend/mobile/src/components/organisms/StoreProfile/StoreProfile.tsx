import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import styles from "./StoreProfile.styles";
import { StoreProfileProps, StoreInfo } from "./StoreProfile.types";
import { Icon } from "../..";

// Exemple de fetch par défaut pour Storybook ou tests
const defaultFetchStore = async (storeId: string): Promise<StoreInfo> => {
  return {
    id: storeId,
    name: "Quincaillerie Sow & Frères",
    owner: "Amadou Sow",
    ninea: "004218942 2B3",
    phone: "+221 77 123 45 67",
    address: "Marché Sandaga, Allée 3, Dakar",
    categories: ["Quincaillerie", "Bricolage"],
    verified: true,
    rating: 4.5,
    reviewCount: 12,
    createdAt: new Date().toISOString(),
  };
};

const StoreProfile: React.FC<StoreProfileProps> = ({ storeId, onClose }) => {
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await defaultFetchStore(storeId);
        setStore(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!store) return <Text style={{ padding: 16 }}>Aucune donnée disponible</Text>;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Profil Magasin</Text>
        <Icon name="bell" size={22} />
      </View>

      <ScrollView>
        {/* PROFIL */}
        <View style={styles.profile}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{store.name}</Text>
          <Text style={styles.owner}>Propriétaire : {store.owner}</Text>

          {store.verified && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Compte Vérifié</Text>
            </View>
          )}
        </View>

        {/* INFOS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations de l'entreprise</Text>

          <Text style={styles.label}>Raison sociale</Text>
          <Text>{store.name}</Text>

          <Text style={styles.label}>NINEA / RC</Text>
          <Text>{store.ninea}</Text>

          <Text style={styles.label}>Numéro WhatsApp</Text>
          <Text>{store.phone}</Text>

          <Text style={styles.label}>Adresse</Text>
          <Text>{store.address}</Text>
        </View>

        {/* PARAMÈTRES */}
        <View style={styles.card}>
          {[
            "Gestion des employés",
            "Préférences de notification",
            "Sécurité & Mot de passe",
            "Aide et support technique",
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text>{item}</Text>
              <Icon name="arrowRight" size={18} />
            </TouchableOpacity>
          ))}
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default StoreProfile;