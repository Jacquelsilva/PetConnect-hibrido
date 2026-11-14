import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Aba = "inicio" | "favoritos" | "solicitacoes" | "settings";

type Props = {
  ativa?: Aba;
};

export function BottomNavBar({ ativa }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const ir = (rota: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: rota }],
      })
    );
  };

  const abas = [
    {
      chave: "inicio" as Aba,
      titulo: "Início",
      icone: "home-outline" as const,
      iconeAtivo: "home" as const,
      rota: "HomeUsuario",
    },
    {
      chave: "favoritos" as Aba,
      titulo: "Favoritos",
      icone: "heart-outline" as const,
      iconeAtivo: "heart" as const,
      rota: "Favoritos",
    },
    {
      chave: "solicitacoes" as Aba,
      titulo: "Solicitações",
      icone: "document-text-outline" as const,
      iconeAtivo: "document-text" as const,
      rota: "SolicitacoesUsuario",
    },
    {
      chave: "settings" as Aba,
      titulo: "Configurações",
      icone: "settings-outline" as const,
      iconeAtivo: "settings" as const,
      rota: "Settings",
    },
  ];

  return (
    <View
      style={[styles.barra, { paddingBottom: Math.max(insets.bottom, 14) }]}
    >
      {abas.map((aba) => {
        const selecionada = aba.chave === ativa;
        return (
          <TouchableOpacity
            key={aba.chave}
            style={styles.aba}
            activeOpacity={0.7}
            onPress={selecionada ? undefined : () => ir(aba.rota)}
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