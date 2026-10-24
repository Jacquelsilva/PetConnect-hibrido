import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function AlterarSenhaScreen() {
  const navigation = useNavigation();

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSalvar = () => {
    setErro("");
    setSucesso(false);

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("A confirmação não confere com a nova senha.");
      return;
    }
    if (novaSenha === senhaAtual) {
      setErro("A nova senha deve ser diferente da atual.");
      return;
    }

    console.log("Senha alterada com sucesso");
    setSucesso(true);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar senha</Text>

      <Input
        placeholder="Senha atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
      />
      <Input
        placeholder="Nova senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />
      <Input
        placeholder="Confirmar nova senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
      {sucesso && (
        <Text style={styles.sucesso}>Senha alterada com sucesso!</Text>
      )}

      <Button title="Salvar nova senha" onPress={handleSalvar} />
      <Button
        variant="outline"
        title="Cancelar"
        onPress={() => navigation.goBack()}
      />
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
  erro: {
    color: "#c62828",
    textAlign: "center",
  },
  sucesso: {
    color: "#2e7d32",
    textAlign: "center",
  },
});