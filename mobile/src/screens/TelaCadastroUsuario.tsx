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
  | "nome"
  | "cpf"
  | "email"
  | "senha"
  | "confirmarSenha"
  | "cep"
  | "estado"
  | "cidade"
  | "endereco",
  string
>>;

const somenteDigitos = (valor: string) => valor.replace(/\D/g, "");

export function TelaCadastroUsuario() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [erros, setErros] = useState<Erros>({});

  function validar(): boolean {
    const novosErros: Erros = {};

    if (nome.trim().split(" ").length < 2) novosErros.nome = "Informe nome e sobrenome.";
    if (cpf.length !== 11) novosErros.cpf = "O CPF deve ter 11 dígitos.";
    if (!/^\S+@\S+\.\S+$/.test(email)) novosErros.email = "E-mail inválido.";
    if (senha.length < 6) novosErros.senha = "A senha deve ter ao menos 6 caracteres.";
    if (confirmarSenha !== senha) novosErros.confirmarSenha = "As senhas não coincidem.";
    if (cep.length !== 8) novosErros.cep = "O CEP deve ter 8 dígitos.";
    if (estado.length !== 2) novosErros.estado = "Use a sigla do estado (ex: SP).";
    if (!cidade.trim()) novosErros.cidade = "Informe a cidade.";
    if (!endereco.trim()) novosErros.endereco = "Informe o endereço.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleCadastrar() {
    if (!validar()) {
      Alert.alert("Atenção", "Corrija os campos destacados.");
      return;
    }

    Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
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
        <Text style={styles.title}>Cadastro de Usuário</Text>
        <Text style={styles.subtitle}>Preencha seus dados para criar a conta</Text>

        <Input
          label="Nome completo"
          placeholder="Ex: Maria da Silva"
          value={nome}
          onChangeText={setNome}
          errorMessage={erros.nome}
        />
        <Input
          label="CPF"
          placeholder="Somente números"
          keyboardType="numeric"
          maxLength={11}
          value={cpf}
          onChangeText={(t) => setCpf(somenteDigitos(t))}
          errorMessage={erros.cpf}
        />
        <Input
          label="E-mail"
          placeholder="seuemail@exemplo.com"
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
        <Input
          label="Confirmar senha"
          placeholder="Repita a senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          errorMessage={erros.confirmarSenha}
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

        <Button title="Cadastrar Usuário" variant="primary" onPress={handleCadastrar} />
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