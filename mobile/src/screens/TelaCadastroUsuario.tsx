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
import { Header } from "@/components/ui/Header";

import { getDatabase } from "@/database/Database";
import { inserirUsuario } from "@/database/UsuarioDAO";
import { saveSession } from "@/services/auth";

import type { Usuario } from "@/models/types";
import type { CadastroUsuarioProps } from "@/types/navigation";

type Erros = Partial<
  Record<
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
  >
>;

export default function TelaCadastroUsuario({
  navigation,
}: CadastroUsuarioProps) {
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
  const [carregando, setCarregando] = useState(false);

  const somenteDigitos = (valor: string): string => {
    return valor.replace(/\D/g, "");
  };

  function validar(): boolean {
    const novosErros: Erros = {};

    if (nome.trim().split(/\s+/).filter(Boolean).length < 2) {
      novosErros.nome = "Informe seu nome completo.";
    }

    if (somenteDigitos(cpf).length !== 11) {
      novosErros.cpf = "O CPF deve conter 11 números.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      novosErros.email = "Informe um e-mail válido.";
    }

    if (senha.length < 6) {
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!confirmarSenha || confirmarSenha !== senha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    if (somenteDigitos(cep).length !== 8) {
      novosErros.cep = "O CEP deve conter 8 números.";
    }

    if (estado.trim().length !== 2) {
      novosErros.estado = "Informe a sigla do estado.";
    }

    if (!cidade.trim()) {
      novosErros.cidade = "Informe sua cidade.";
    }

    if (!endereco.trim()) {
      novosErros.endereco = "Informe seu endereço.";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function handleCadastrar() {
    if (carregando) return;

    if (!validar()) return;

    setCarregando(true);

    try {
      console.log("1 - BOTÃO CLICADO");

      const novoUsuario: Usuario = {
        nome: nome.trim(),
        cpf: somenteDigitos(cpf),
        email: email.trim().toLowerCase(),
        senha,
        cep: somenteDigitos(cep),
        estado: estado.trim().toUpperCase(),
        cidade: cidade.trim(),
        endereco: endereco.trim(),
      };

      console.log("2 - DADOS DO USUÁRIO:", novoUsuario);

      const db = await getDatabase();

      console.log("3 - BANCO ABERTO");

      const resultado = await inserirUsuario(db, novoUsuario);

      console.log("4 - RESULTADO DA INSERÇÃO:", resultado);

      if (!resultado) {
        Alert.alert(
          "Erro no cadastro",
          "Não foi possível realizar o cadastro. Verifique se o e-mail já está cadastrado."
        );
        return;
      }

      console.log("5 - CADASTRO REALIZADO COM SUCESSO");

      const usuarioCriado = await db.getFirstAsync<Usuario>(
        "SELECT * FROM usuarios WHERE email = ?",
        [novoUsuario.email]
      );

      await saveSession({
        token: "registered-user-token-" + Date.now(),
        user: {
          id: String(usuarioCriado?.id || "1"),
          name: novoUsuario.nome,
          document: novoUsuario.cpf,
          email: novoUsuario.email,
          type: "user",
        },
      });

      navigation.replace("HomeUsuario");

    } catch (error) {
      console.error("ERRO AO CADASTRAR USUÁRIO:", error);

      Alert.alert(
        "Erro",
        "Ocorreu um problema ao cadastrar o usuário."
      );

    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Criar Conta" onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Cadastre-se</Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo para começar a adotar.
        </Text>

        <Input
          label="Nome completo"
          placeholder="Digite seu nome completo"
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && (
          <Text style={styles.error}>{erros.nome}</Text>
        )}

        <Input
          label="CPF"
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={14}
          mask="cpf"
        />
        {erros.cpf && (
          <Text style={styles.error}>{erros.cpf}</Text>
        )}

        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erros.email && (
          <Text style={styles.error}>{erros.email}</Text>
        )}

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {erros.senha && (
          <Text style={styles.error}>{erros.senha}</Text>
        )}

        <Input
          label="Confirmar senha"
          placeholder="Digite sua senha novamente"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
        />
        {erros.confirmarSenha && (
          <Text style={styles.error}>{erros.confirmarSenha}</Text>
        )}

        <Text style={styles.section}>Endereço</Text>

        <Input
          label="CEP"
          placeholder="00000-000"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
          maxLength={9}
          mask="cep"
        />
        {erros.cep && (
          <Text style={styles.error}>{erros.cep}</Text>
        )}

        <Input
          label="Estado"
          placeholder="Ex.: SP"
          value={estado}
          onChangeText={setEstado}
          autoCapitalize="characters"
          maxLength={2}
        />
        {erros.estado && (
          <Text style={styles.error}>{erros.estado}</Text>
        )}

        <Input
          label="Cidade"
          placeholder="Digite sua cidade"
          value={cidade}
          onChangeText={setCidade}
        />
        {erros.cidade && (
          <Text style={styles.error}>{erros.cidade}</Text>
        )}

        <Input
          label="Endereço"
          placeholder="Rua, número e bairro"
          value={endereco}
          onChangeText={setEndereco}
        />
        {erros.endereco && (
          <Text style={styles.error}>{erros.endereco}</Text>
        )}

        <Button
          title={carregando ? "Cadastrando..." : "Cadastrar Usuário"}
          variant="primary"
          onPress={handleCadastrar}
          disabled={carregando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 28,
    lineHeight: 22,
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginTop: 16,
    marginBottom: 16,
  },

  error: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
});
