import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { Header } from "@/components/ui/Header";
import { getSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import { listarIdsFavoritos } from "@/database/FavoritosDAO";
import { listarAnimais } from "@/database/AnimalDAO";
import type { Animal } from "@/models/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Favoritos">;

export function TelaFavoritos({ navigation }: Props) {
  const [animaisFavoritos, setAnimaisFavoritos] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarFavoritos() {
      try {
        const session = await getSession();
        if (!session || !session.user?.id) {
          setLoading(false);
          return;
        }
        const db = await getDatabase();
        const idsFavoritos = await listarIdsFavoritos(db, Number(session.user.id));
        const todosAnimais = await listarAnimais(db);
        const favoritos = todosAnimais.filter((animal) =>
          idsFavoritos.includes(String(animal.id))
        );
        setAnimaisFavoritos(favoritos);
      } catch (e) {
        console.error("Erro ao carregar favoritos:", e);
      } finally {
        setLoading(false);
      }
    }
    carregarFavoritos();
  }, []);

  const renderItem = ({ item }: { item: Animal }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("PetDetails", { pet: item })}
    >
      <Image
        source={{
          uri: item.foto_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.details}>{item.especie} • {item.idade} anos • {item.porte}</Text>
        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate("PetDetails", { pet: item })}
        >
          <Text style={styles.profileButtonText}>Ver perfil</Text>
          <Ionicons name="chevron-forward" size={16} color="#0F766E" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Header title="Meus Favoritos" onBackPress={() => navigation.goBack()} />
      <View style={styles.content}>
        {animaisFavoritos.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyText}>Você ainda não favoritou nenhum pet.</Text>
          </View>
        ) : (
          <FlatList
            data={animaisFavoritos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "#E0E0E0",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F766E",
  },
  details: {
    fontSize: 13,
    color: "#6B7280",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F766E",
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
});
