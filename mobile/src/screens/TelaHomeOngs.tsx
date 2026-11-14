import React, { useCallback, useMemo, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BottomNavBarOng } from "@/components/ui/BottomNavBarOng";
import { getSession } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getDatabase } from "@/database/Database";
import { listarAnimaisDaOng } from "@/database/AnimalDAO";
import { contarSolicitacoesDaOng } from "@/database/SolicitacaoDAO";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "HomeOngs">;

type Cartao = {
  id: string;
  titulo: string;
  descricao: string;
  icone: keyof typeof Ionicons.glyphMap;
  etiqueta: string;
  onPress: () => void;
};

export function TelaHomeOngs({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [busca, setBusca] = useState("");

  const [totalAnimais, setTotalAnimais] = useState(0);
  const [totalSolicitacoes, setTotalSolicitacoes] = useState(0);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      (async () => {
        try {
          const session = await getSession();

          if (!session?.user?.id) {
            console.error("HOME ONG: sessão sem usuário.");
            return;
          }

          const idOng = Number(session.user.id);
          const db = await getDatabase();

          const animais = await listarAnimaisDaOng(db, idOng);
          const solicitacoes = await contarSolicitacoesDaOng(db, idOng);

          if (ativo) {
            setTotalAnimais(animais.length);
            setTotalSolicitacoes(solicitacoes.total);
            setSolicitacoesPendentes(solicitacoes.pendentes);
          }
        } catch (e) {
          console.error("ERRO AO CARREGAR HOME DA ONG:", e);
        } finally {
          if (ativo) setCarregando(false);
        }
      })();

      return () => {
        ativo = false;
      };
    }, [])
  );

  const cartoes: Cartao[] = useMemo(
    () => [
      {
        id: "1",
        titulo: "Cadastrar animal",
        descricao: "Adicione um novo animal para adoção.",
        icone: "add-circle",
        etiqueta: "Novo cadastro",
        onPress: () => navigation.navigate("animalregistration"),
      },
      {
        id: "2",
        titulo: "Gerenciar animais",
        descricao: "Visualize e atualize os animais cadastrados.",
        icone: "paw",
        etiqueta:
          totalAnimais === 1
            ? "1 animal cadastrado"
            : `${totalAnimais} animais cadastrados`,
        onPress: () => navigation.navigate("manageanimals"),
      },
      {
        id: "3",
        titulo: "Solicitações de adoção",
        descricao: "Acompanhe as pessoas interessadas em adotar.",
        icone: "people",
        etiqueta:
          solicitacoesPendentes === 1
            ? "1 solicitação pendente"
            : `${solicitacoesPendentes} solicitações pendentes`,
        onPress: () => navigation.navigate("SolicitacoesOngs"),
      },
      {
        id: "4",
        titulo: "Configurações",
        descricao: "Gerencie dados da ONG e preferências.",
        icone: "settings",
        etiqueta: "Configurações da conta",
        onPress: () => navigation.navigate("Settings"),
      },
    ],
    [navigation, totalAnimais, solicitacoesPendentes]
  );

  const cartoesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return cartoes.filter((c) => c.titulo.toLowerCase().includes(termo));
  }, [cartoes, busca]);

  function renderCartao({ item }: { item: Cartao }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardTopo}>
          <View style={styles.iconeBox}>
            <Ionicons name={item.icone} size={30} color="#0F766E" />
          </View>

          <View style={styles.info}>
            <Text style={styles.nome}>{item.titulo}</Text>
            <Text style={styles.detalhe}>{item.descricao}</Text>
            <Text style={styles.etiqueta}>{item.etiqueta}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.botaoVer} onPress={item.onPress}>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          <Text style={styles.botaoVerTexto}>Acessar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cabecalho = (
    <View>
      <View style={styles.boasVindas}>
        <Text style={styles.saudacao}>Olá, {user?.name || "ONG"}!</Text>
        <Text style={styles.titulo}>Área da ONG</Text>
        <Text style={styles.subtitulo}>
          Gerencie seus animais e acompanhe as adoções.
        </Text>
      </View>

      <View style={styles.indicadores}>
        <View style={styles.indicador}>
          <Ionicons name="paw" size={22} color="#0F766E" />
          <Text style={styles.indicadorValor}>{totalAnimais}</Text>
          <Text style={styles.indicadorTitulo}>Animais cadastrados</Text>
        </View>
        <View style={styles.indicador}>
          <Ionicons name="mail" size={22} color="#0F766E" />
          <Text style={styles.indicadorValor}>{totalSolicitacoes}</Text>
          <Text style={styles.indicadorTitulo}>Solicitações recebidas</Text>
        </View>
      </View>

      <View style={styles.busca}>
        <Ionicons name="search" size={20} color="#999999" />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar..."
          placeholderTextColor="#999999"
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <Text style={styles.secao}>Gerenciamento</Text>
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
        data={cartoesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderCartao}
        ListHeaderComponent={cabecalho}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {carregando ? "Carregando..." : "Nenhum resultado encontrado."}
          </Text>
        }
      />

      <BottomNavBarOng ativa="inicio" />
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
  indicadores: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  indicador: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  indicadorValor: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
  },
  indicadorTitulo: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  busca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
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
  iconeBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
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
  etiqueta: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F766E",
    marginTop: 4,
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