import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { LoginScreenProps } from "../types/navigation";

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Tentativa de Login:", { email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo(a) ao PetConnect!</Text>

      <Input
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Entrar" onPress={handleLogin} />

      <Button
        variant="outline"
        title="Não tem uma conta? Cadastre-se"
        onPress={() => navigation.navigate("Register")}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
});
