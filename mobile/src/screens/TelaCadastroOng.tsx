import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Erros = Partial<Record<
  "nome" | "cnpj" | "email" | "senha" | "cep" | "estado" | "cidade" | "endereco",
  string
>>;

const somenteDigitos = (valor: string) => valor.replace(/\D/g, "");

export function TelaCadastroOng() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [erros, setErros] = useState<Erros>({});

  function validar(): boolean {
    const novosErros: Erros = {};

    if (!nome.trim()) novosErros.nome = "Informe o nome da ONG.";
    if (cnpj.length !== 14) novosErros.cnpj = "O CNPJ deve ter 14 dígitos.";
    if (!/^\S+@\S+\.\S+$/.test(email)) novosErros.email = "E-mail inválido.";
    if (senha.length < 6) novosErros.senha = "A senha deve ter ao menos 6 caracteres.";
    if (cep.length !== 8) novosErros.cep = "O CEP deve ter 8 dígitos.";
    if (estado.length !== 2) novosErros.estado = "Use a sigla do estado (ex: SP).";
    if (!cidade.trim()) novosErros.cidade = "Informe a cidade.";
    if (!endereco.trim()) novosErros.endereco = "Informe o endereço.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleCadastrarOng() {
    if (!validar()) {
      Alert.alert("Atenção", "Corrija os campos destacados.");
      return;
    }

    Alert.alert("Sucesso", "ONG cadastrada com sucesso!");
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Cadastro de ONG</Text>
        <Text style={styles.subtitle}>Preencha os dados da sua organização</Text>

        <Input
          label="Nome da ONG"
          placeholder="Ex: Amigos do Bem"
          value={nome}
          onChangeText={setNome}
          errorMessage={erros.nome}
        />
        <Input
          label="CNPJ"
          placeholder="Somente números"
          keyboardType="numeric"
          maxLength={14}
          value={cnpj}
          onChangeText={(t) => setCnpj(somenteDigitos(t))}
          errorMessage={erros.cnpj}
        />
        <Input
          label="E-mail"
          placeholder="contato@ong.org"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          errorMessage={erros.email}
        />
        <Input
          label="Senha"
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          errorMessage={erros.senha}
        />

        <Text style={styles.section}>Endereço</Text>

        <Input
          label="CEP"
          placeholder="Somente números"
          keyboardType="numeric"
          maxLength={8}
          value={cep}
          onChangeText={(t) => setCep(somenteDigitos(t))}
          errorMessage={erros.cep}
        />
        <Input
          label="Estado"
          placeholder="UF"
          autoCapitalize="characters"
          maxLength={2}
          value={estado}
          onChangeText={setEstado}
          errorMessage={erros.estado}
        />
        <Input
          label="Cidade"
          placeholder="Cidade"
          value={cidade}
          onChangeText={setCidade}
          errorMessage={erros.cidade}
        />
        <Input
          label="Endereço"
          placeholder="Rua, número e bairro"
          value={endereco}
          onChangeText={setEndereco}
          errorMessage={erros.endereco}
        />

        <Button title="Cadastrar ONG" variant="primary" onPress={handleCadastrarOng} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  section: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginBottom: 12,
  },
});