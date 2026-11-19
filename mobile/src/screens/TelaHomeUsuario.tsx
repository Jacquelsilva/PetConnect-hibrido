import React, { useCallback, useMemo, useState } from "react";
import {Text,View,Image,FlatList,TextInput,TouchableOpacity,StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import { getSession } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getDatabase } from "@/database/Database";
import { listarAnimais } from "@/database/AnimalDAO";
import { listarIdsFavoritos, alternarFavorito } from "@/database/FavoritosDAO";
 import type { Animal } from "@/models/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "HomeUsuario">;

const FILTROS = [
  { nome: "Todos", valor: "todos" },
  { nome: "Cães", valor: "caes" },
  { nome: "Gatos", valor: "gatos" },
  { nome: "Outros", valor: "outros" },
];

function textoIdade(idade: number): string {
  if (idade === 0) return "Menos de 1 ano";
  return idade === 1 ? "1 ano" : `${idade} anos`;
}

export function TelaHomeUsuario({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      (async () => {
        try {
          const db = await getDatabase();
          const lista = await listarAnimais(db);
          if (ativo) setAnimais(lista);

          const session = await getSession();
          if (session?.user?.id) {
            const id = Number(session.user.id);
            const ids = await listarIdsFavoritos(db, id);
            if (ativo) {
              setIdUsuario(id);
              setFavoritos(ids.map(String));
            }
          }
        } catch (e) {
          console.error("ERRO AO CARREGAR ANIMAIS:", e);
        } finally {
          if (ativo) setCarregando(false);
        }
      })();

      return () => {
        ativo = false;
      };
    }, [])
  );

  const animaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return animais
      .filter((animal) => {
        if (filtro === "caes") return animal.especie === "Cachorro";
        if (filtro === "gatos") return animal.especie === "Gato";
        if (filtro === "outros") {
          return animal.especie !== "Cachorro" && animal.especie !== "Gato";
        }
        return true;
      })
      .filter((animal) => animal.nome.toLowerCase().includes(termo));
  }, [animais, busca, filtro]);

  function verSobre(animal: Animal) {
    if (!animal.id) return;
    navigation.navigate("PetDetails", { id: animal.id });
  }

  async function favoritar(animal: Animal) {
    if (!animal.id || idUsuario === null) return;

    const idTexto = String(animal.id);

    try {
      const db = await getDatabase();
      const ficouFavorito = await alternarFavorito(db, idUsuario, animal.id);

      setFavoritos((atuais) =>
        ficouFavorito
          ? [...atuais, idTexto]
          : atuais.filter((id) => id !== idTexto)
      );
    } catch (e) {
      console.error("ERRO AO FAVORITAR ANIMAL:", e);
    }
  }

  function renderAnimal({ item }: { item: Animal }) {
    const favorito =
      item.id !== undefined && favoritos.includes(String(item.id));

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
            onPress={() => favoritar(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={favorito ? "heart" : "heart-outline"}
              size={26}
              color={favorito ? "#D32F2F" : "#999999"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botaoVer} onPress={() => verSobre(item)}>
          <Ionicons name="paw" size={16} color="#FFFFFF" />
          <Text style={styles.botaoVerTexto}>Ver sobre o animal</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cabecalho = (
    <View>
      <View style={styles.boasVindas}>
        <Text style={styles.saudacao}>Olá, {user?.name || "Usuário"}!</Text>
        <Text style={styles.titulo}>Encontre seu novo amigo</Text>
        <Text style={styles.subtitulo}>
          Um novo companheiro pode estar esperando por você.
        </Text>
      </View>

      <View style={styles.busca}>
        <Ionicons name="search" size={20} color="#999999" />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar por nome do animal..."
          placeholderTextColor="#999999"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <View style={styles.filtros}>
        {FILTROS.map((f) => {
          const selecionado = filtro === f.valor;
          return (
            <TouchableOpacity
              key={f.valor}
              style={[styles.chip, selecionado && styles.chipSelecionado]}
              onPress={() => setFiltro(f.valor)}
            >
              <Text
                style={[
                  styles.chipTexto,
                  selecionado && styles.chipTextoSelecionado,
                ]}
              >
                {f.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.secao}>Animais Disponíveis</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={styles.topBarConteudo}>
          <Text style={styles.topBarTitulo}>Início</Text>
        </View>
      </View>

      <FlatList
        style={styles.flat}
        data={animaisFiltrados}
        extraData={favoritos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAnimal}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {carregando ? "Carregando..." : "Nenhum animal encontrado."}
          </Text>
        }
      />

      <BottomNavBar ativa="inicio" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  topBar: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  topBarConteudo: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  flat: {
    flex: 1,
  },
  lista: {
    padding: 20,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
    flexGrow: 1,
  },
  boasVindas: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  saudacao: {
    fontSize: 14,
    color: "#666666",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
    lineHeight: 20,
  },
  busca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buscaInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333333",
  },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  chipSelecionado: {
    backgroundColor: "#0F766E",
    borderColor: "#0F766E",
  },
  chipTexto: {
    fontSize: 14,
    color: "#333333",
  },
  chipTextoSelecionado: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secao: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
    backgroundColor: "#E8F5E9",
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
    fontWeight: "700",
    color: "#2C3E50",
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
    borderRadius: 8,
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
    paddingTop: 24,
  },
});