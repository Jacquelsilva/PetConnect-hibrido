import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { RegisterScreenProps } from "../types/navigation";

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      console.log("Senhas não coincidem");
      return;
    }
    console.log("Tentativa de Registrar:", { name, email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta</Text>

      <Input placeholder="Nome completo" value={name} onChangeText={setName} />

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

      <Input
        placeholder="Confirmar senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Cadastrar" onPress={handleRegister} />

      <Button
        title="Já tem uma conta? Entrar"
        variant="outline"
        onPress={() => navigation.goBack()}
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
