import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Aba = "inicio" | "animais" | "solicitacoes" | "settings";

type Props = {
  ativa: Aba;
};

export function BottomNavBarOng({ ativa }: Props) {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const abas: {
    chave: Aba;
    titulo: string;
    icone: keyof typeof Ionicons.glyphMap;
    iconeAtivo: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  }[] = [
    {
      chave: "inicio",
      titulo: "Início",
      icone: "home-outline",
      iconeAtivo: "home",
      onPress: () =>
        navigation.reset({ index: 0, routes: [{ name: "HomeOngs" }] }),
    },
    {
      chave: "animais",
      titulo: "Animais",
      icone: "paw-outline",
      iconeAtivo: "paw",
      onPress: () => navigation.navigate("manageanimals"),
    },
    {
      chave: "solicitacoes",
      titulo: "Solicitações",
      icone: "document-text-outline",
      iconeAtivo: "document-text",
      onPress: () =>
        navigation.reset({ index: 0, routes: [{ name: "SolicitacoesOngs" }] }),
    },
    {
      chave: "settings",
      titulo: "Configurações",
      icone: "settings-outline",
      iconeAtivo: "settings",
      onPress: () =>
        navigation.reset({ index: 0, routes: [{ name: "Settings" }] }),
    },
  ];

  return (
    <View style={[styles.barra, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      {abas.map((aba) => {
        const selecionada = aba.chave === ativa;
        return (
          <TouchableOpacity
            key={aba.chave}
            style={styles.aba}
            activeOpacity={0.7}
            onPress={selecionada ? undefined : aba.onPress}
          >
            <Ionicons
              name={selecionada ? aba.iconeAtivo : aba.icone}
              size={24}
              color={selecionada ? "#0F766E" : "#9CA3AF"}
            />
            <Text
              style={[styles.abaTexto, selecionada && styles.abaTextoAtiva]}
            >
              {aba.titulo}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
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
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  abaTextoAtiva: {
    color: "#0F766E",
  },
});