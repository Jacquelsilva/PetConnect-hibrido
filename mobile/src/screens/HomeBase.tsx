import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

type Filtro = {
  nome: string;
  valor: string;
};

type Indicador = {
  titulo: string;
  valor: string | number;
  icone: IconName;
};

type Acao = {
  titulo: string;
  icone: IconName;
  onPress: () => void;
};

type Cartao = {
  id: string;
  titulo: string;
  descricao: string;
  icone: IconName;
  etiqueta?: string;
  onPress?: () => void;
};

type Props = {
  saudacao?: string;
  titulo: string;
  subtitulo: string;

  busca?: string;
  placeholderBusca?: string;
  onChangeBusca?: (texto: string) => void;

  filtros?: Filtro[];
  filtroSelecionado?: string;
  onSelecionarFiltro?: (valor: string) => void;

  indicadores?: Indicador[];
  acoes?: Acao[];
  cartoes?: Cartao[];

  textoLista?: string;
  textoVazio?: string;
};

export function HomeBase({
  saudacao = "Olá!",
  titulo,
  subtitulo,
  busca = "",
  placeholderBusca = "Buscar...",
  onChangeBusca,
  filtros = [],
  filtroSelecionado = "",
  onSelecionarFiltro,
  indicadores = [],
  acoes = [],
  cartoes = [],
  textoLista = "Confira as informações",
  textoVazio = "Nenhum resultado encontrado.",
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 16 }}
      >
        <View style={styles.conteudo}>
          <View style={styles.topo}>
            <View style={styles.logo}>
              <Ionicons name="paw" size={28} color="#4CAF50" />
            </View>

            <Text style={styles.saudacao}>{saudacao}</Text>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.subtitulo}>{subtitulo}</Text>
          </View>

          {indicadores.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>RESUMO</Text>

              <View style={styles.indicadores}>
                {indicadores.map((item, index) => (
                  <View key={index} style={styles.cardIndicador}>
                    <Ionicons name={item.icone} size={28} color="#4CAF50" />
                    <Text style={styles.valorIndicador}>{item.valor}</Text>
                    <Text style={styles.nomeIndicador}>{item.titulo}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {acoes.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>AÇÕES</Text>

              {acoes.map((acao, index) => (
                <Pressable
                  key={index}
                  style={styles.botaoAcao}
                  onPress={acao.onPress}
                >
                  <Ionicons name={acao.icone} size={21} color="#FFFFFF" />
                  <Text style={styles.textoAcao}>{acao.titulo}</Text>
                </Pressable>
              ))}
            </>
          )}

          {onChangeBusca && (
            <View style={styles.busca}>
              <Ionicons name="search" size={20} color="#999999" />
              <TextInput
                style={styles.input}
                placeholder={placeholderBusca}
                placeholderTextColor="#999999"
                value={busca}
                onChangeText={onChangeBusca}
              />
            </View>
          )}

          {filtros.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.listaFiltros}
            >
              {filtros.map((filtro) => {
                const ativo = filtroSelecionado === filtro.valor;

                return (
                  <Pressable
                    key={filtro.valor}
                    style={[styles.filtro, ativo && styles.filtroAtivo]}
                    onPress={() => onSelecionarFiltro?.(filtro.valor)}
                  >
                    <Text
                      style={[
                        styles.textoFiltro,
                        ativo && styles.textoFiltroAtivo,
                      ]}
                    >
                      {filtro.nome}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {cartoes.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>{textoLista}</Text>

              {cartoes.map((cartao) => (
                <Pressable
                  key={cartao.id}
                  style={styles.card}
                  onPress={cartao.onPress}
                  disabled={!cartao.onPress}
                >
                  <View style={styles.iconeCard}>
                    <Ionicons name={cartao.icone} size={26} color="#4CAF50" />
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.tituloCard}>{cartao.titulo}</Text>
                    <Text style={styles.descricaoCard}>{cartao.descricao}</Text>

                    {cartao.etiqueta && (
                      <Text style={styles.etiqueta}>{cartao.etiqueta}</Text>
                    )}
                  </View>

                  <Ionicons name="chevron-forward" size={20} color="#999999" />
                </Pressable>
              ))}
            </>
          )}

          {cartoes.length === 0 && (onChangeBusca || filtros.length > 0) && (
            <Text style={styles.vazio}>{textoVazio}</Text>
          )}
        </View>
      </ScrollView>
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
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  topo: {
    alignItems: "flex-start",
    marginBottom: 8,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  saudacao: {
    color: "#666666",
    fontSize: 14,
  },
  titulo: {
    color: "#2C3E50",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },
  subtitulo: {
    color: "#666666",
    fontSize: 15,
    marginTop: 4,
    lineHeight: 22,
  },
  tituloSecao: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
  },
  indicadores: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cardIndicador: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  valorIndicador: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 6,
  },
  nomeIndicador: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
    marginTop: 3,
  },
  botaoAcao: {
    backgroundColor: "#0F766E",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  textoAcao: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  busca: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 4,
    gap: 10,
    marginTop: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333333",
    paddingVertical: 10,
  },
  listaFiltros: {
    marginTop: 14,
    flexGrow: 0,
  },
  filtro: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  filtroAtivo: {
    backgroundColor: "#0F766E",
    borderColor: "#0F766E",
  },
  textoFiltro: {
    color: "#333333",
    fontSize: 14,
  },
  textoFiltroAtivo: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeCard: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    flex: 1,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
  },
  descricaoCard: {
    color: "#666666",
    fontSize: 13,
    marginTop: 4,
  },
  etiqueta: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  vazio: {
    textAlign: "center",
    color: "#666666",
    marginTop: 25,
  },
});