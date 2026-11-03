import React from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OptionCard } from "@/components/ui/OptionCard";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "EscolhaCadastro">;

export function TelaEscolhaCadastro({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />

      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="paw" size={36} color="#0F766E" />
        </View>
        <Text style={styles.heroTitulo}>Bem-vindo!</Text>
        <Text style={styles.heroSubtitulo}>
          Escolha como você quer participar para criar a sua conta.
        </Text>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.pergunta}>Como você quer se cadastrar?</Text>

        <OptionCard
          icone="person"
          titulo="Sou usuário"
          descricao="Quero encontrar ONGs e animais perto de mim."
          cor="#0F766E"
          corFundo="#CCFBF1"
          onPress={() => navigation.navigate("CadastroUsuario")}
        />

        <OptionCard
          icone="heart"
          titulo="Sou uma ONG"
          descricao="Represento uma organização e quero divulgar o meu trabalho."
          cor="#B45309"
          corFundo="#FEF3C7"
          onPress={() => navigation.navigate("CadastroOng")}
        />
      </View>
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
    paddingTop: 72,
    paddingBottom: 56,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitulo: {
    fontSize: 15,
    lineHeight: 22,
    color: "#CCFBF1",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },
  conteudo: {
    flex: 1,
    padding: 24,
    marginTop: -24,
  },
  pergunta: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 40,
    marginBottom: 16,
  },
});