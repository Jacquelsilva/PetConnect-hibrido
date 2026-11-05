import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  Pressable,
} from "react-native";
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
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0F766E"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.hero}>
          <View style={styles.topo}>
            <View style={styles.logo}>
              <Ionicons
                name="paw"
                size={30}
                color="#0F766E"
              />
            </View>

            <Text style={styles.saudacao}>{saudacao}</Text>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.subtitulo}>{subtitulo}</Text>
          </View>
        </View>

        <View style={styles.conteudo}>
          {/* Indicadores */}
          {indicadores.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>RESUMO</Text>

              <View style={styles.indicadores}>
                {indicadores.map((item, index) => (
                  <View key={index} style={styles.cardIndicador}>
                    <Ionicons
                      name={item.icone}
                      size={30}
                      color="#0F766E"
                    />

                    <Text style={styles.valorIndicador}>
                      {item.valor}
                    </Text>

                    <Text style={styles.nomeIndicador}>
                      {item.titulo}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Ações */}
          {acoes.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>AÇÕES</Text>

              {acoes.map((acao, index) => (
                <Pressable
                  key={index}
                  style={styles.botaoAcao}
                  onPress={acao.onPress}
                >
                  <Ionicons
                    name={acao.icone}
                    size={21}
                    color="#FFFFFF"
                  />

                  <Text style={styles.textoAcao}>
                    {acao.titulo}
                  </Text>
                </Pressable>
              ))}
            </>
          )}

          {/* Pesquisa */}
          {onChangeBusca && (
            <View style={styles.busca}>
              <Ionicons
                name="search"
                size={21}
                color="#0F766E"
              />

              <TextInput
                style={styles.input}
                placeholder={placeholderBusca}
                placeholderTextColor="#9CA3AF"
                value={busca}
                onChangeText={onChangeBusca}
              />
            </View>
          )}

          {/* Filtros */}
          {filtros.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.listaFiltros}
            >
              {filtros.map((filtro) => {
                const ativo =
                  filtroSelecionado === filtro.valor;

                return (
                  <Pressable
                    key={filtro.valor}
                    style={[
                      styles.filtro,
                      ativo && styles.filtroAtivo,
                    ]}
                    onPress={() =>
                      onSelecionarFiltro?.(filtro.valor)
                    }
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

          {/* Lista de cartões */}
          {cartoes.length > 0 && (
            <>
              <Text style={styles.tituloSecao}>
                {textoLista}
              </Text>

              {cartoes.map((cartao) => (
                <Pressable
                  key={cartao.id}
                  style={styles.card}
                  onPress={cartao.onPress}
                  disabled={!cartao.onPress}
                >
                  <View style={styles.iconeCard}>
                    <Ionicons
                      name={cartao.icone}
                      size={28}
                      color="#0F766E"
                    />
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.tituloCard}>
                      {cartao.titulo}
                    </Text>

                    <Text style={styles.descricaoCard}>
                      {cartao.descricao}
                    </Text>

                    {cartao.etiqueta && (
                      <Text style={styles.etiqueta}>
                        {cartao.etiqueta}
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color="#0F766E"
                  />
                </Pressable>
              ))}
            </>
          )}

          {cartoes.length === 0 &&
            (onChangeBusca || filtros.length > 0) && (
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
    backgroundColor: "#F9F9F9",
  },
  hero: {
    backgroundColor: "#0F766E",
    paddingTop: 60,
    paddingBottom: 38,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topo: {
    alignItems: "flex-start",
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  saudacao: {
    color: "#CCFBF1",
    fontSize: 14,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 3,
  },
  subtitulo: {
    color: "#CCFBF1",
    fontSize: 15,
    marginTop: 7,
  },
  conteudo: {
    padding: 22,
    paddingBottom: 40,
  },
  tituloSecao: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 15,
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
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    elevation: 2,
  },
  valorIndicador: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#16803C",
    marginTop: 7,
  },
  nomeIndicador: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 3,
  },
  botaoAcao: {
    backgroundColor: "#16803C",
    borderRadius: 30,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 13,
  },
  textoAcao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  busca: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
    marginTop: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  listaFiltros: {
    marginTop: 15,
    flexGrow: 0,
  },
  filtro: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 9,
  },
  filtroAtivo: {
    backgroundColor: "#0F766E",
    borderColor: "#0F766E",
  },
  textoFiltro: {
    color: "#374151",
    fontSize: 13,
  },
  textoFiltroAtivo: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 2,
  },
  iconeCard: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    flex: 1,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F766E",
  },
  descricaoCard: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 4,
  },
  etiqueta: {
    color: "#16803C",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 7,
  },
  vazio: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 25,
  },
});
