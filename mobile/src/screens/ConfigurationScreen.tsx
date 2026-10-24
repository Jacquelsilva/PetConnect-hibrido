import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions, CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";

type ConfigurationTabParamList = {
  Configuracoes: undefined;
};

const VERDE = "#2E8B34";
const VERMELHO = "#F44336";

type Props = CompositeScreenProps<
  BottomTabScreenProps<ConfigurationTabParamList, "Configuracoes">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ConfigurationScreen({ navigation }: Props) {
  const [notificacoes, setNotificacoes] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(true);

  const tema = modoEscuro
    ? { fundo: "#121212", texto: "#FFFFFF" }
    : { fundo: "#FFFFFF", texto: "#111111" };

  const irParaLogin = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
    );
  };

  const sair = () => {
    // Na web, Alert.alert com botões não funciona: usa window.confirm
    if (Platform.OS === "web") {
      if (window.confirm("Deseja realmente sair?")) {
        irParaLogin();
      }
      return;
    }

    Alert.alert("Sair da conta", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: irParaLogin },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: tema.fundo }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.titulo}>
          <Text style={[styles.tituloTexto, { color: tema.texto }]}>
            Configurações
          </Text>
        </View>

        <LinhaSwitch
          label="Receber notificações"
          value={notificacoes}
          onValueChange={setNotificacoes}
          cor={tema.texto}
        />
        <LinhaSwitch
          label="Modo escuro"
          value={modoEscuro}
          onValueChange={setModoEscuro}
          cor={tema.texto}
        />

        <View style={styles.grupoBotoes}>
          <Botao
            texto="Alterar Senha"
            onPress={() => navigation.navigate("AlterarSenha")}
          />
          <Botao
            texto="Termos de Uso"
            onPress={() => navigation.navigate("TermosDeUso")}
          />
          <Botao
            texto="Política de Privacidade"
            onPress={() => navigation.navigate("PoliticaDePrivacidade")}
          />
        </View>

        <Botao texto="Sair da Conta" cor={VERMELHO} onPress={sair} />
      </ScrollView>
    </SafeAreaView>
  );
}

type LinhaSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  cor: string;
};

function LinhaSwitch({ label, value, onValueChange, cor }: LinhaSwitchProps) {
  return (
    <View style={styles.linha}>
      <Text style={[styles.linhaTexto, { color: cor }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#3A3A44", true: VERDE }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

type BotaoProps = {
  texto: string;
  onPress: () => void;
  cor?: string;
};

function Botao({ texto, onPress, cor = VERDE }: BotaoProps) {
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: cor }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Text style={styles.botaoTexto}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 32 },
  titulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 28,
  },
  tituloTexto: { fontSize: 24, fontWeight: "500" },
  linha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  linhaTexto: { fontSize: 15 },
  grupoBotoes: { marginTop: 18, marginBottom: 36, gap: 14 },
  botao: {
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoTexto: { color: "#FFFFFF", fontSize: 14, fontWeight: "500" },
});