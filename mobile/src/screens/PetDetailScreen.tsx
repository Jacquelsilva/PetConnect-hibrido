import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootStackParamList } from "../types/navigation";
import {
  Pet,
  buscarPet,
  jaSolicitou,
  solicitarAdocao,
  cancelarSolicitacao,
} from "../services/petService";

const VERDE = "#2E8B34";
const VERDE_CLARO = "#E8F5E9";

type Props = NativeStackScreenProps<RootStackParamList, "PetDetail">;

export default function PetDetailScreen({ navigation, route }: Props) {
  const { petId } = route.params;
  const insets = useSafeAreaInsets();

  const [pet, setPet] = useState<Pet | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [solicitado, setSolicitado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroAcao, setErroAcao] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [dadosPet, ja] = await Promise.all([
        buscarPet(petId),
        jaSolicitou(petId),
      ]);
      setPet(dadosPet);
      setSolicitado(ja);
    } catch (e: any) {
      console.log("Erro ao carregar pet:", e);
      setErro("Não foi possível carregar este pet.");
    } finally {
      setCarregando(false);
    }
  }, [petId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const alternarSolicitacao = async () => {
    if (enviando) return;
    setEnviando(true);
    setErroAcao("");
    try {
      if (solicitado) {
        await cancelarSolicitacao(petId);
        setSolicitado(false);
      } else {
        await solicitarAdocao(petId);
        setSolicitado(true);
      }
    } catch (e: any) {
      console.log("Erro na solicitação:", e);
      setErroAcao(e?.message ?? "Não foi possível concluir. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={VERDE} />
      </View>
    );
  }

  if (erro || !pet) {
    return (
      <View style={styles.centro}>
        <Ionicons name="alert-circle-outline" size={48} color="#999" />
        <Text style={styles.erroTexto}>{erro || "Pet não encontrado."}</Text>
        <TouchableOpacity style={styles.botaoTentar} onPress={carregar}>
          <Text style={styles.botaoTexto}>Tentar de novo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 + insets.bottom }}
      >
        <View style={styles.hero}>
          {pet.foto ? (
            <Image source={{ uri: pet.foto }} style={styles.foto} />
          ) : (
            <View style={[styles.foto, styles.semFoto]}>
              <Ionicons name="paw" size={64} color="#9CCB9F" />
            </View>
          )}
          <View style={styles.escurecer} />

          <TouchableOpacity
            style={[styles.voltar, { top: insets.top + 8 }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.heroTexto}>
            <Text style={styles.nome}>{pet.nome}</Text>
            <View style={styles.especieTag}>
              <Ionicons name="paw" size={12} color="#FFFFFF" />
              <Text style={styles.especieTexto}>{pet.especie}</Text>
            </View>
          </View>
        </View>

        <View style={styles.conteudo}>
          <View style={styles.infoLinha}>
            <InfoCard icone="gift-outline" rotulo="Idade" valor={pet.idade} />
            <InfoCard icone="resize-outline" rotulo="Porte" valor={pet.porte} />
            <InfoCard
              icone="male-female-outline"
              rotulo="Sexo"
              valor={pet.sexo}
            />
          </View>

          <Text style={styles.secaoTitulo}>Sobre</Text>
          <Text style={styles.sobre}>{pet.sobre}</Text>

          <Text style={styles.secaoTitulo}>Responsável</Text>
          <View style={styles.responsavel}>
            <View style={styles.avatar}>
              <Ionicons name="home" size={22} color={VERDE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.responsavelNome}>{pet.responsavel}</Text>
              {pet.responsavelTipo !== "" && (
                <Text style={styles.responsavelSub}>{pet.responsavelTipo}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.botao, solicitado && styles.botaoEnviado]}
          onPress={alternarSolicitacao}
          disabled={enviando}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          {enviando ? (
            <ActivityIndicator color={solicitado ? VERDE : "#FFFFFF"} />
          ) : (
            <>
              <Ionicons
                name={solicitado ? "checkmark-circle" : "heart"}
                size={20}
                color={solicitado ? VERDE : "#FFFFFF"}
              />
              <Text style={[styles.botaoTexto, solicitado && { color: VERDE }]}>
                {solicitado ? "Solicitação enviada" : "Quero adotar"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {erroAcao !== "" ? (
          <Text style={[styles.dica, { color: "#C62828" }]}>{erroAcao}</Text>
        ) : (
          solicitado && (
            <Text style={styles.dica}>Toque novamente para cancelar</Text>
          )
        )}
      </View>
    </View>
  );
}

type InfoCardProps = {
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  valor: string;
};

function InfoCard({ icone, rotulo, valor }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icone} size={22} color={VERDE} />
      <Text style={styles.infoRotulo}>{rotulo}</Text>
      <Text style={styles.infoValor} numberOfLines={1}>
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  erroTexto: { fontSize: 15, color: "#555", textAlign: "center" },
  botaoTentar: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
    backgroundColor: VERDE,
    alignItems: "center",
    justifyContent: "center",
  },
  linkVoltar: { color: VERDE, fontWeight: "600", marginTop: 4 },

  hero: { height: 360 },
  foto: { width: "100%", height: "100%", resizeMode: "cover" },
  semFoto: {
    backgroundColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
  },
  escurecer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  voltar: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTexto: { position: "absolute", left: 20, right: 20, bottom: 48 },
  nome: { fontSize: 32, fontWeight: "700", color: "#FFFFFF" },
  especieTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: VERDE,
  },
  especieTexto: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },

  conteudo: {
    marginTop: -28,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  infoLinha: { flexDirection: "row", gap: 12, marginBottom: 8 },
  infoCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: VERDE_CLARO,
    gap: 2,
  },
  infoRotulo: { fontSize: 11, color: "#6B7B6C", marginTop: 4 },
  infoValor: { fontSize: 15, fontWeight: "600", color: "#1B1B1B" },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1B1B",
    marginTop: 24,
    marginBottom: 8,
  },
  sobre: { fontSize: 15, lineHeight: 22, color: "#555" },

  responsavel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3E8E3",
    backgroundColor: "#FAFAFA",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: VERDE_CLARO,
    alignItems: "center",
    justifyContent: "center",
  },
  responsavelNome: { fontSize: 16, fontWeight: "600", color: "#1B1B1B" },
  responsavelSub: { fontSize: 12, color: "#888", marginTop: 2 },

  rodape: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  botao: {
    height: 52,
    borderRadius: 26,
    backgroundColor: VERDE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  botaoEnviado: {
    backgroundColor: VERDE_CLARO,
    borderWidth: 1.5,
    borderColor: VERDE,
  },
  botaoTexto: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  dica: { textAlign: "center", fontSize: 11, color: "#999", marginTop: 6 },
});