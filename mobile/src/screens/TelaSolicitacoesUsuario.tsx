import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import {
  SolicitacoesBase,
  Solicitacao,
} from "@/screens/SolicitacoesBase";

import { getSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import { listarSolicitacoesPorUsuario } from "@/database/SolicitacaoDAO";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "SolicitacoesUsuario"
>;

function mostrarAviso(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${titulo}\n\n${mensagem}`);
    }
  } else {
    Alert.alert(titulo, mensagem);
  }
}

function descricaoPorStatus(status: string): string {
  switch (status) {
    case "Aprovada":
      return "Sua solicitação foi aprovada pela ONG!";
    case "Recusada":
      return "A ONG informou que não foi possível aprovar a solicitação.";
    default:
      return "Sua solicitação está aguardando avaliação da ONG.";
  }
}

export function TelaSolicitacoesUsuario({ navigation }: Props) {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  const abas = [
    {
      titulo: "Favoritos",
      icone: "heart-outline" as const,
      onPress: () => navigation.navigate("Favoritos"),
    },
    {
      titulo: "Solicitações",
      icone: "document-text" as const, // preenchido: é a tela atual
      onPress: () => {},
    },
    {
      titulo: "Configurações",
      icone: "settings-outline" as const,
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        try {
          const session = await getSession();

          if (!session?.user?.id) {
            console.error("SOLICITAÇÕES: sessão sem usuário.");
            return;
          }

          const db = await getDatabase();
          const linhas = await listarSolicitacoesPorUsuario(
            db,
            Number(session.user.id)
          );

          const lista: Solicitacao[] = linhas.map(
            (s) =>
              ({
                id: String(s.id),
                animal: s.nome_animal || "Animal",
                pessoa: s.nome_ong || "ONG não informada",
                data: s.data || "",
                status: s.status || "Em análise",
                descricao: descricaoPorStatus(s.status || "Em análise"),
              } as Solicitacao)
          );

          if (ativo) setSolicitacoes(lista);
        } catch (e) {
          console.error("ERRO AO CARREGAR SOLICITAÇÕES:", e);
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, [])
  );

  function verDetalhes(item: Solicitacao) {
    mostrarAviso(
      `Solicitação de ${item.animal}`,
      `ONG: ${item.pessoa}\nData: ${item.data}\n\nInformações: ${
        item.descricao || "Nenhuma informação adicional."
      }\n\nStatus: ${item.status}`
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.conteudo}>
        <SolicitacoesBase
          perfil="usuario"
          solicitacoes={solicitacoes}
          onVerDetalhes={verDetalhes}
          onVoltar={() => navigation.goBack()}
        />
      </View>

      {/* Barra de navegação inferior */}
      <View style={styles.barra}>
        {abas.map((aba) => (
          <TouchableOpacity
            key={aba.titulo}
            style={styles.aba}
            onPress={aba.onPress}
          >
            <Ionicons name={aba.icone} size={24} color="#0F766E" />
            <Text style={styles.abaTexto}>{aba.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  conteudo: {
    flex: 1,
  },
  barra: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  aba: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  abaTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F766E",
  },
});

export default TelaSolicitacoesUsuario;