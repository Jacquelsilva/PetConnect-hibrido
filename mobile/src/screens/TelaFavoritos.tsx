import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Header } from "@/components/ui/Header";

import { getSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import { listarIdsFavoritos, alternarFavorito, listarAnimaisFavoritos } from "@/database/FavoritosDAO";

import type { Animal } from "@/models/types";
import type { FavoritosScreenProps } from "@/types/navigation";

function textoIdade(idade: number): string {
  if (idade === 0) return "Menos de 1 ano";
  return idade === 1 ? "1 ano" : `${idade} anos`;
}

export function TelaFavoritos({ navigation }: FavoritosScreenProps) {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      (async () => {
        try {
          const session = await getSession();
          if (!session?.user?.id) return;

          const id = Number(session.user.id);
          const db = await getDatabase();
          const lista = await listarAnimaisFavoritos(db, id);

          if (ativo) {
            setIdUsuario(id);
            setAnimais(lista);
          }
        } catch (e) {
          console.error("ERRO AO CARREGAR FAVORITOS:", e);
        } finally {
          if (ativo) setCarregando(false);
        }
      })();

      return () => {
        ativo = false;
      };
    }, [])
  );

  async function desfavoritar(animal: Animal) {
    if (!animal.id || idUsuario === null) return;

    try {
      const db = await getDatabase();
      await alternarFavorito(db, idUsuario, animal.id);
      setAnimais((atuais) => atuais.filter((item) => item.id !== animal.id));
    } catch (e) {
      console.error("ERRO AO REMOVER FAVORITO:", e);
    }
  }

  function verSobre(animal: Animal) {
    if (!animal.id) return;
    navigation.navigate("animaldetails", { id: animal.id });
  }

  function renderItem({ item }: { item: Animal }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardTopo}>
          {item.foto_url ? (
            <Image source={{ uri: item.foto_url }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.fotoVazia]}>
              <Text style={styles.fotoVaziaTexto}>🐾</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhe}>
              {item.especie} • {item.sexo} • {item.porte}
            </Text>
            <Text style={styles.detalhe}>{textoIdade(item.idade)}</Text>
          </View>

          <TouchableOpacity
            style={styles.botaoCoracao}
            onPress={() => desfavoritar(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="heart" size={26} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoVer} onPress={() => verSobre(item)}>
          <Ionicons name="paw" size={16} color="#FFFFFF" />
          <Text style={styles.botaoVerTexto}>Ver sobre o animal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Meus Favoritos" onBackPress={() => navigation.goBack()} />

      <FlatList
        data={animais}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {carregando
              ? "Carregando..."
              : "Você ainda não favoritou nenhum animal.\nToque no coração de um animal para salvá-lo aqui."}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  lista: {
    padding: 16,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  foto: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  fotoVazia: {
    backgroundColor: "#E6F4F1",
    alignItems: "center",
    justifyContent: "center",
  },
  fotoVaziaTexto: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 2,
  },
  detalhe: {
    fontSize: 13,
    color: "#666666",
  },
  botaoCoracao: {
    alignSelf: "flex-start",
    padding: 2,
  },
  botaoVer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F766E",
    borderRadius: 10,
    paddingVertical: 11,
  },
  botaoVerTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  vazio: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    paddingTop: 40,
    lineHeight: 22,
  },
});