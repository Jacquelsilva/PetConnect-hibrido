import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import type { RootStackParamList } from "@/types/navigation";

type Aba = "favoritos" | "solicitacoes" | "settings";

type Props = {
  ativa?: Aba;
};

export function BottomNavBar({ ativa }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const abas = [
    {
      chave: "favoritos" as Aba,
      titulo: "Favoritos",
      icone: "heart-outline" as const,
      iconeAtivo: "heart" as const,
      onPress: () => navigation.navigate("Favoritos"),
    },
    {
      chave: "solicitacoes" as Aba,
      titulo: "Solicitações",
      icone: "document-text-outline" as const,
      iconeAtivo: "document-text" as const,
      onPress: () => navigation.navigate("SolicitacoesUsuario"),
    },
    {
      chave: "settings" as Aba,
      titulo: "Configurações",
      icone: "settings-outline" as const,
      iconeAtivo: "settings" as const,
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  return (
    <View style={styles.barra}>
      {abas.map((aba) => {
        const selecionada = aba.chave === ativa;
        return (
          <TouchableOpacity
            key={aba.titulo}
            style={styles.aba}
            onPress={selecionada ? undefined : aba.onPress}
          >
            <Ionicons
              name={selecionada ? aba.iconeAtivo : aba.icone}
              size={24}
              color="#0F766E"
            />
            <Text style={styles.abaTexto}>{aba.titulo}</Text>
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