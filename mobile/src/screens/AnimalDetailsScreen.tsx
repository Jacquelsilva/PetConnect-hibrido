import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";

import { getSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import { buscarAnimal } from "@/database/AnimalDAO";
import { listarIdsFavoritos, alternarFavorito } from "@/database/FavoritosDAO";

import type { Animal } from "@/models/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "animaldetails">;

function textoIdade(idade: number): string {
  if (idade === 0) return "Menos de 1 ano";
  return idade === 1 ? "1 ano" : `${idade} anos`;
}

function formatarData(iso?: string | null): string | null {
  if (!iso) return null;
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) return null;
  return `${dia}/${mes}/${ano}`;
}

export function AnimalDetailsScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [favorito, setFavorito] = useState(false);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  useEffect(() => {
    let ativo = true;

    (async () => {
      try {
        const db = await getDatabase();
        const resultado = await buscarAnimal(db, id);
        if (ativo) setAnimal(resultado);

        const session = await getSession();
        if (session?.user?.id) {
          const idUser = Number(session.user.id);
          const ids = await listarIdsFavoritos(db, idUser);
          if (ativo) {
            setIdUsuario(idUser);
            setFavorito(ids.map(String).includes(String(id)));
          }
        }
      } catch (e) {
        console.error("ERRO AO CARREGAR DETALHES DO ANIMAL:", e);
      } finally {
        if (ativo) setCarregando(false);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [id]);

  async function favoritar() {
    if (idUsuario === null) return;

    try {
      const db = await getDatabase();
      const ficouFavorito = await alternarFavorito(db, idUsuario, id);
      setFavorito(ficouFavorito);
    } catch (e) {
      console.error("ERRO AO FAVORITAR ANIMAL:", e);
    }
  }

  const nascimento = formatarData(animal?.data_nascimento);

  return (
    <View style={styles.container}>
      <Header title="Sobre o animal" onBackPress={() => navigation.goBack()} />

      {carregando ? (
        <Text style={styles.mensagem}>Carregando...</Text>
      ) : !animal ? (
        <Text style={styles.mensagem}>Animal não encontrado.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.conteudo}>
          {animal.foto_url ? (
            <Image source={{ uri: animal.foto_url }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.fotoVazia]}>
              <Text style={styles.fotoVaziaTexto}>🐾</Text>
            </View>
          )}

          <Text style={styles.nome}>{animal.nome}</Text>

          <View style={styles.linhaChips}>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{animal.especie}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{animal.sexo}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>{animal.porte}</Text>
            </View>
          </View>

          <View style={styles.bloco}>
            <Text style={styles.rotulo}>Idade</Text>
            <Text style={styles.valor}>{textoIdade(animal.idade)}</Text>
          </View>

          {nascimento && (
            <View style={styles.bloco}>
              <Text style={styles.rotulo}>Data de nascimento</Text>
              <Text style={styles.valor}>{nascimento}</Text>
            </View>
          )}

          <View style={styles.bloco}>
            <Text style={styles.rotulo}>Sobre</Text>
            <Text style={styles.valor}>
              {animal.descricao?.trim()
                ? animal.descricao
                : "A ONG ainda não adicionou uma descrição."}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoAdotar}
            onPress={() => navigation.navigate("solicitaradocao", { id })}
          >
            <Ionicons name="paw" size={18} color="#FFFFFF" />
            <Text style={styles.botaoAdotarTexto}>Solicitar adoção</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoFavoritar, favorito && styles.botaoFavoritado]}
            onPress={favoritar}
          >
            <Ionicons
              name={favorito ? "heart" : "heart-outline"}
              size={20}
              color={favorito ? "#FFFFFF" : "#D32F2F"}
            />
            <Text
              style={[
                styles.botaoFavoritarTexto,
                favorito && styles.botaoFavoritadoTexto,
              ]}
            >
              {favorito ? "Remover dos favoritos" : "Favoritar animal"}
            </Text>
          </TouchableOpacity>

          <Button
            title="Voltar"
            variant="primary"
            onPress={() => navigation.goBack()}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    gap: 16,
  },
  mensagem: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    paddingTop: 40,
  },
  foto: {
    width: "100%",
    height: 260,
    borderRadius: 16,
  },
  fotoVazia: {
    backgroundColor: "#E6F4F1",
    alignItems: "center",
    justifyContent: "center",
  },
  fotoVaziaTexto: {
    fontSize: 64,
  },
  nome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  linhaChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E6F4F1",
  },
  chipTexto: {
    color: "#0F766E",
    fontSize: 13,
    fontWeight: "600",
  },
  bloco: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666666",
    letterSpacing: 0.5,
  },
  valor: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 22,
  },
  botaoAdotar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#0F766E",
  },
  botaoAdotarTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  botaoFavoritar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D32F2F",
    backgroundColor: "#FFFFFF",
  },
  botaoFavoritado: {
    backgroundColor: "#D32F2F",
  },
  botaoFavoritarTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#D32F2F",
  },
  botaoFavoritadoTexto: {
    color: "#FFFFFF",
  },
});