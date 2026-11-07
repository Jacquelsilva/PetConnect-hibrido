import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";

import { getSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import { listarAnimaisDaOng, excluirAnimal } from "@/database/AnimalDAO";

import type { Animal } from "@/models/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "manageanimals">;

function mostrarAviso(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${titulo}\n\n${mensagem}`);
    }
  } else {
    Alert.alert(titulo, mensagem);
  }
}

function confirmarExclusao(nome: string, aoConfirmar: () => void) {
  const mensagem = `Deseja excluir ${nome}? Essa ação não pode ser desfeita.`;

  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.confirm(`Excluir animal\n\n${mensagem}`)) {
      aoConfirmar();
    }
  } else {
    Alert.alert("Excluir animal", mensagem, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: aoConfirmar },
    ]);
  }
}

function textoIdade(idade: number): string {
  if (idade === 0) return "Menos de 1 ano";
  return idade === 1 ? "1 ano" : `${idade} anos`;
}

export function ManageAnimalsScreen({ navigation }: Props) {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const session = await getSession();

      if (!session?.user?.id) {
        console.error("GERENCIAR ANIMAIS: sessão sem usuário.");
        return;
      }

      const db = await getDatabase();
      const lista = await listarAnimaisDaOng(db, Number(session.user.id));

      setAnimais(lista);
    } catch (e) {
      console.error("ERRO AO CARREGAR ANIMAIS DA ONG:", e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function excluir(animal: Animal) {
    if (!animal.id) return;

    try {
      const db = await getDatabase();
      const ok = await excluirAnimal(db, animal.id);

      if (!ok) {
        mostrarAviso("Erro", "Não foi possível excluir o animal.");
        return;
      }

      setAnimais((anteriores) =>
        anteriores.filter((item) => item.id !== animal.id)
      );
    } catch (e) {
      console.error("ERRO AO EXCLUIR ANIMAL:", e);
      mostrarAviso("Erro", "Ocorreu um erro ao excluir o animal.");
    }
  }

  function editar(animal: Animal) {
    if (!animal.id) return;
    navigation.navigate("editanimal", { id: animal.id });
  }

  function renderItem({ item }: { item: Animal }) {
    return (
      <View style={styles.card}>
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
          {item.descricao ? (
            <Text style={styles.descricao} numberOfLines={2}>
              {item.descricao}
            </Text>
          ) : null}
        </View>

        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => editar(item)}
          >
            <Text style={styles.botaoEditarTexto}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => confirmarExclusao(item.nome, () => excluir(item))}
          >
            <Text style={styles.botaoExcluirTexto}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Gerenciar Animais" onBackPress={() => navigation.goBack()} />

      <FlatList
        data={animais}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          carregando ? (
            <Text style={styles.vazio}>Carregando...</Text>
          ) : (
            <View style={styles.vazioContainer}>
              <Text style={styles.vazio}>Nenhum animal cadastrado ainda.</Text>
              <Button
                title="Cadastrar animal"
                variant="primary"
                onPress={() => navigation.navigate("animalregistration")}
              />
            </View>
          )
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
    flexDirection: "row",
    alignItems: "center",
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
  descricao: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },
  acoes: {
    gap: 8,
  },
  botaoEditar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#E6F4F1",
    alignItems: "center",
  },
  botaoEditarTexto: {
    color: "#0F766E",
    fontSize: 13,
    fontWeight: "600",
  },
  botaoExcluir: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FDECEC",
    alignItems: "center",
  },
  botaoExcluirTexto: {
    color: "#D32F2F",
    fontSize: 13,
    fontWeight: "600",
  },
  vazioContainer: {
    paddingTop: 40,
    gap: 16,
  },
  vazio: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
  },
});