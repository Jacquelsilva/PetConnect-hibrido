import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";

export type Solicitacao = {
  id: string;
  animal: string;
  pessoa: string;
  data: string;
  status: "Em análise" | "Aprovada" | "Recusada";
  descricao?: string;
};

type Props = {
  perfil: "ong" | "usuario";
  titulo?: string;
  subtitulo?: string;
  solicitacoes: Solicitacao[];

  onVerDetalhes?: (item: Solicitacao) => void;
  onAprovar?: (item: Solicitacao) => void;
  onRecusar?: (item: Solicitacao) => void;
  onVoltar?: () => void;
};

export function SolicitacoesBase({
  perfil,
  titulo,
  subtitulo,
  solicitacoes,
  onVerDetalhes,
  onAprovar,
  onRecusar,
  onVoltar,
}: Props) {
  const insets = useSafeAreaInsets();
  const isOng = perfil === "ong";

  const pendentes = solicitacoes.filter(
    (item) => item.status === "Em análise"
  ).length;

  const tituloTela =
    titulo || (isOng ? "Solicitações Recebidas" : "Minhas Solicitações");

  const subtituloTela =
    subtitulo ||
    (isOng
      ? "Gerencie os pedidos de adoção dos seus animais."
      : "Acompanhe o andamento dos seus pedidos de adoção.");

  return (
    <View style={styles.container}>
      {onVoltar ? (
        <View style={{ paddingTop: insets.top, backgroundColor: "#FFFFFF" }}>
          <Header title={tituloTela} onBackPress={onVoltar} />
        </View>
      ) : (
        <View style={[styles.topBar, { paddingTop: insets.top }]}>
          <View style={styles.topBarConteudo}>
            <Text style={styles.topBarTitulo}>{tituloTela}</Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <Text style={styles.subtitulo}>{subtituloTela}</Text>

        <View style={styles.resumo}>
          <View style={styles.iconeResumo}>
            <Ionicons
              name={isOng ? "clipboard-outline" : "heart-outline"}
              size={26}
              color="#4CAF50"
            />
          </View>

          <View style={styles.infoResumo}>
            <Text style={styles.numeroResumo}>
              {isOng ? pendentes : solicitacoes.length}
            </Text>
            <Text style={styles.textoResumo}>
              {isOng
                ? "Solicitações aguardando análise"
                : "Solicitações realizadas"}
            </Text>
          </View>
        </View>

        <Text style={styles.tituloLista}>
          {isOng ? "Pedidos recebidos" : "Acompanhe seus pedidos"}
        </Text>

        {solicitacoes.length === 0 ? (
          <View style={styles.vazio}>
            <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
            <Text style={styles.textoVazio}>
              {isOng
                ? "Nenhuma solicitação recebida ainda."
                : "Você ainda não realizou solicitações de adoção."}
            </Text>
          </View>
        ) : (
          solicitacoes.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTopo}>
                <View style={styles.patinha}>
                  <Ionicons name="paw" size={24} color="#4CAF50" />
                </View>

                <View style={styles.infoAnimal}>
                  <Text style={styles.nomeAnimal}>{item.animal}</Text>
                  <Text style={styles.identificacao}>
                    {isOng ? "Pedido de adoção" : "Solicitação enviada"}
                  </Text>
                </View>
              </View>

              <View style={styles.dados}>
                <View style={styles.linha}>
                  <Ionicons name="person-outline" size={18} color="#555" />
                  <Text style={styles.textoDado}>
                    {isOng
                      ? `Interessado: ${item.pessoa}`
                      : `ONG: ${item.pessoa}`}
                  </Text>
                </View>

                <View style={styles.linha}>
                  <Ionicons name="calendar-outline" size={18} color="#555" />
                  <Text style={styles.textoDado}>Data: {item.data}</Text>
                </View>

                {item.descricao && (
                  <View style={styles.linha}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#555"
                    />
                    <Text style={styles.textoDado}>{item.descricao}</Text>
                  </View>
                )}
              </View>

              <View
                style={[
                  styles.status,
                  item.status === "Em análise" && styles.statusAnalise,
                  item.status === "Aprovada" && styles.statusAprovada,
                  item.status === "Recusada" && styles.statusRecusada,
                ]}
              >
                <Text style={styles.textoStatus}>{item.status}</Text>
              </View>

              {onVerDetalhes && (
                <Pressable
                  style={styles.botaoDetalhes}
                  onPress={() => onVerDetalhes(item)}
                >
                  <Text style={styles.textoDetalhes}>VER DETALHES</Text>
                  <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
                </Pressable>
              )}

              {isOng && item.status === "Em análise" && (
                <View style={styles.acoes}>
                  {onAprovar && (
                    <Pressable
                      style={styles.botaoAprovar}
                      onPress={() => onAprovar(item)}
                    >
                      <Ionicons name="checkmark" size={19} color="#FFFFFF" />
                      <Text style={styles.textoAcao}>APROVAR</Text>
                    </Pressable>
                  )}

                  {onRecusar && (
                    <Pressable
                      style={styles.botaoRecusar}
                      onPress={() => onRecusar(item)}
                    >
                      <Ionicons name="close" size={19} color="#FFFFFF" />
                      <Text style={styles.textoAcao}>RECUSAR</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
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
  scroll: {
    flex: 1,
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  subtitulo: {
    color: "#666",
    fontSize: 14,
    marginBottom: 16,
  },
  resumo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeResumo: {
    width: 49,
    height: 49,
    backgroundColor: "#E8F5E9",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  infoResumo: {
    flex: 1,
  },
  numeroResumo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
  },
  textoResumo: {
    color: "#666",
    fontSize: 13,
  },
  tituloLista: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    paddingBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopo: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  patinha: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoAnimal: {
    flex: 1,
  },
  nomeAnimal: {
    color: "#2C3E50",
    fontSize: 18,
    fontWeight: "700",
  },
  identificacao: {
    color: "#666",
    fontSize: 12,
    marginTop: 3,
  },
  dados: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textoDado: {
    color: "#333",
    fontSize: 14,
    flex: 1,
  },
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  statusAnalise: {
    backgroundColor: "#F59E0B",
  },
  statusAprovada: {
    backgroundColor: "#16803C",
  },
  statusRecusada: {
    backgroundColor: "#DC2626",
  },
  textoStatus: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  botaoDetalhes: {
    backgroundColor: "#0F766E",
    marginHorizontal: 20,
    padding: 13,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },
  textoDetalhes: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  acoes: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  botaoAprovar: {
    flex: 1,
    backgroundColor: "#16803C",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  botaoRecusar: {
    flex: 1,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  textoAcao: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  vazio: {
    alignItems: "center",
    padding: 35,
  },
  textoVazio: {
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },
});