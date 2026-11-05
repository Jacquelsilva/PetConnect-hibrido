import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

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
  const isOng = perfil === "ong";

  const pendentes = solicitacoes.filter(
    (item) => item.status === "Em análise"
  ).length;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        {onVoltar && (
          <Pressable
            style={styles.botaoVoltar}
            onPress={onVoltar}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#0F766E"
            />
          </Pressable>
        )}

        <View style={styles.infoCabecalho}>
          <Text style={styles.titulo}>
            {titulo ||
              (isOng
                ? "Solicitações Recebidas"
                : "Minhas Solicitações")}
          </Text>

          <Text style={styles.subtitulo}>
            {subtitulo ||
              (isOng
                ? "Gerencie os pedidos de adoção dos seus animais."
                : "Acompanhe o andamento dos seus pedidos de adoção.")}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Resumo */}
        <View style={styles.resumo}>
          <View style={styles.iconeResumo}>
            <Ionicons
              name={isOng ? "clipboard" : "heart"}
              size={27}
              color="#0F766E"
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

        {/* Lista */}
        <Text style={styles.tituloLista}>
          {isOng
            ? "Pedidos recebidos"
            : "Acompanhe seus pedidos"}
        </Text>

        {solicitacoes.length === 0 ? (
          <View style={styles.vazio}>
            <Ionicons
              name="document-text-outline"
              size={48}
              color="#9CA3AF"
            />

            <Text style={styles.textoVazio}>
              {isOng
                ? "Nenhuma solicitação recebida ainda."
                : "Você ainda não realizou solicitações de adoção."}
            </Text>
          </View>
        ) : (
          solicitacoes.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Identificação */}
              <View style={styles.cardTopo}>
                <View style={styles.patinha}>
                  <Ionicons
                    name="paw"
                    size={26}
                    color="#0F766E"
                  />
                </View>

                <View style={styles.infoAnimal}>
                  <Text style={styles.nomeAnimal}>
                    {item.animal}
                  </Text>

                  <Text style={styles.identificacao}>
                    {isOng
                      ? "Pedido de adoção"
                      : "Solicitação enviada"}
                  </Text>
                </View>
              </View>

              {/* Informações */}
              <View style={styles.dados}>
                <View style={styles.linha}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color="#6B7280"
                  />

                  <Text style={styles.textoDado}>
                    {isOng
                      ? `Interessado: ${item.pessoa}`
                      : `ONG: ${item.pessoa}`}
                  </Text>
                </View>

                <View style={styles.linha}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color="#6B7280"
                  />

                  <Text style={styles.textoDado}>
                    Data: {item.data}
                  </Text>
                </View>

                {item.descricao && (
                  <View style={styles.linha}>
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#6B7280"
                    />

                    <Text style={styles.textoDado}>
                      {item.descricao}
                    </Text>
                  </View>
                )}
              </View>

              {/* Status */}
              <View
                style={[
                  styles.status,
                  item.status === "Em análise" &&
                    styles.statusAnalise,
                  item.status === "Aprovada" &&
                    styles.statusAprovada,
                  item.status === "Recusada" &&
                    styles.statusRecusada,
                ]}
              >
                <Text style={styles.textoStatus}>
                  {item.status}
                </Text>
              </View>

              {/* Detalhes */}
              {onVerDetalhes && (
                <Pressable
                  style={styles.botaoDetalhes}
                  onPress={() => onVerDetalhes(item)}
                >
                  <Text style={styles.textoDetalhes}>
                    VER DETALHES
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color="#FFFFFF"
                  />
                </Pressable>
              )}

              {/* Ações exclusivas da ONG */}
              {isOng && item.status === "Em análise" && (
                <View style={styles.acoes}>
                  {onAprovar && (
                    <Pressable
                      style={styles.botaoAprovar}
                      onPress={() => onAprovar(item)}
                    >
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text style={styles.textoAcao}>
                        APROVAR
                      </Text>
                    </Pressable>
                  )}

                  {onRecusar && (
                    <Pressable
                      style={styles.botaoRecusar}
                      onPress={() => onRecusar(item)}
                    >
                      <Ionicons
                        name="close"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text style={styles.textoAcao}>
                        RECUSAR
                      </Text>
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
    backgroundColor: "#F9F9F9",
  },
  cabecalho: {
    backgroundColor: "#FFFFFF",
    paddingTop: 55,
    paddingHorizontal: 22,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  botaoVoltar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
  },
  infoCabecalho: {
    flex: 1,
  },
  titulo: {
    color: "#1F2937",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitulo: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  conteudo: {
    padding: 22,
    paddingBottom: 40,
  },
  resumo: {
    backgroundColor: "#CCFBF1",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  iconeResumo: {
    width: 49,
    height: 49,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  infoResumo: {
    flex: 1,
  },
  numeroResumo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F766E",
  },
  textoResumo: {
    color: "#374151",
    fontSize: 13,
  },
  tituloLista: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    paddingBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 3,
  },
  cardTopo: {
    backgroundColor: "#ECFDF5",
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
    color: "#0F766E",
    fontSize: 19,
    fontWeight: "bold",
  },
  identificacao: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },
  dados: {
    paddingHorizontal: 17,
    paddingVertical: 17,
    gap: 13,
  },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  textoDado: {
    color: "#6B7280",
    fontSize: 13,
    flex: 1,
  },
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    marginHorizontal: 17,
    marginBottom: 15,
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
    fontWeight: "bold",
    fontSize: 12,
  },
  botaoDetalhes: {
    backgroundColor: "#0F766E",
    marginHorizontal: 17,
    padding: 13,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },
  textoDetalhes: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  acoes: {
    flexDirection: "row",
    paddingHorizontal: 17,
    paddingTop: 14,
    gap: 10,
  },
  botaoAprovar: {
    flex: 1,
    backgroundColor: "#16803C",
    borderRadius: 6,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  botaoRecusar: {
    flex: 1,
    backgroundColor: "#DC2626",
    borderRadius: 6,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  textoAcao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  vazio: {
    alignItems: "center",
    padding: 35,
  },
  textoVazio: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 21,
  },
});
