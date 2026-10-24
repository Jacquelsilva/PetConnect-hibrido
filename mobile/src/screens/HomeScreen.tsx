import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList, TabParamList } from "../types/navigation";
import { PetResumo, listarPets } from "../services/petService";

const VERDE = "#2E8B34";
const VERDE_CLARO = "#E8F5E9";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Inicio">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const [pets, setPets] = useState<PetResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setPets(await listarPets());
    } catch (e) {
      console.log("Erro ao listar pets:", e);
      setErro("Não foi possível carregar os pets. Verifique o .env do Supabase.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.titulo}>Pets para adoção</Text>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={VERDE} />
        </View>
      ) : erro ? (
        <View style={styles.centro}>
          <Text style={styles.vazio}>{erro}</Text>
          <TouchableOpacity style={styles.botao} onPress={carregar}>
            <Text style={styles.botaoTexto}>Tentar de novo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.lista}
          refreshing={carregando}
          onRefresh={carregar}
          ListEmptyComponent={
            <Text style={[styles.vazio, { marginTop: 40 }]}>
              Nenhum pet cadastrado ainda.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("PetDetail", { petId: item.id })}
            >
              {item.foto ? (
                <Image source={{ uri: item.foto }} style={styles.foto} />
              ) : (
                <View style={[styles.foto, styles.semFoto]}>
                  <Ionicons name="paw" size={28} color="#9CCB9F" />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.sub}>
                  {item.especie} · {item.idade}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1B1B",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  lista: { padding: 20, gap: 12 },
  vazio: { color: "#777", textAlign: "center", fontSize: 15 },
  botao: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: { color: "#FFF", fontWeight: "700" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  foto: { width: 72, height: 72, borderRadius: 14 },
  semFoto: {
    backgroundColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
  },
  nome: { fontSize: 17, fontWeight: "600", color: "#1B1B1B" },
  sub: { fontSize: 13, color: "#777", marginTop: 2 },
});