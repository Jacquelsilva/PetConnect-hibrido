
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

import { getDatabase } from "@/database/Database";
import { inserirOng } from "@/database/OngDAO";

import type { Ong } from "@/models/types";
import type { CadastroOngProps } from "@/types/navigation";

type Erros = Partial<
  Record<
    | "nome"
    | "cnpj"
    | "email"
    | "senha"
    | "cep"
    | "estado"
    | "cidade"
    | "endereco",
    string
  >
>;

export default function TelaCadastroOng({
  navigation,
}: CadastroOngProps) {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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

    if (!nome.trim()) {
      novosErros.nome = "Informe o nome da ONG.";
    }

    if (somenteDigitos(cnpj).length !== 14) {
      novosErros.cnpj = "O CNPJ deve conter 14 números.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      novosErros.email = "Informe um e-mail válido.";
    }

    if (senha.length < 6) {
      novosErros.senha =
        "A senha deve ter pelo menos 6 caracteres.";
    }

    if (somenteDigitos(cep).length !== 8) {
      novosErros.cep = "O CEP deve conter 8 números.";
    }

    if (estado.trim().length !== 2) {
      novosErros.estado = "Informe a sigla do estado.";
    }

    if (!cidade.trim()) {
      novosErros.cidade = "Informe a cidade da ONG.";
    }

    if (!endereco.trim()) {
      novosErros.endereco = "Informe o endereço da ONG.";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  const handleCadastrarOng = async () => {
    if (carregando) {
      return;
    }

    if (!validar()) {
      return;
    }

    setCarregando(true);

    try {
      console.log("1 - BOTÃO CLICADO");

      const novaOng: Ong = {
        nome: nome.trim(),
        cnpj: somenteDigitos(cnpj),
        email: email.trim().toLowerCase(),
        senha: senha,
        cep: somenteDigitos(cep),
        estado: estado.trim().toUpperCase(),
        cidade: cidade.trim(),
        endereco: endereco.trim(),
      };

      console.log("2 - DADOS DA ONG:", novaOng);

      const db = await getDatabase();

      console.log("3 - BANCO ABERTO");

      const resultado = await inserirOng(db, novaOng);

      console.log("4 - RESULTADO DA INSERÇÃO:", resultado);

      if (!resultado) {
        Alert.alert(
          "Erro no cadastro",
          "Não foi possível cadastrar a ONG. Verifique se o e-mail já está cadastrado."
        );
        return;
      }

      console.log("5 - CADASTRO REALIZADO COM SUCESSO");

      navigation.replace("HomeOngs");

    } catch (error) {
      console.error("ERRO NO CADASTRO DA ONG:", error);

      Alert.alert(
        "Erro",
        "Ocorreu um problema ao cadastrar a ONG."
      );

    } finally {
      setCarregando(false);
    }
  };

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

        <Text style={styles.subtitle}>
          Cadastre sua organização para divulgar animais disponíveis para adoção.
        </Text>

        <Text style={styles.section}>
          Dados da organização
        </Text>

        <Input
          label="Nome da ONG"
          placeholder="Digite o nome da organização"
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && (
          <Text style={styles.error}>{erros.nome}</Text>
        )}

        <Input
          label="CNPJ"
          placeholder="Digite o CNPJ"
          value={cnpj}
          onChangeText={setCnpj}
          keyboardType="numeric"
          maxLength={18}
        />
        {erros.cnpj && (
          <Text style={styles.error}>{erros.cnpj}</Text>
        )}

        <Input
          label="E-mail"
          placeholder="Digite o e-mail da ONG"
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
          placeholder="Crie uma senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {erros.senha && (
          <Text style={styles.error}>{erros.senha}</Text>
        )}

        <Text style={styles.section}>Endereço</Text>

        <Input
          label="CEP"
          placeholder="Digite o CEP"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
          maxLength={9}
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
          placeholder="Digite a cidade"
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
          title={carregando ? "Cadastrando..." : "Cadastrar ONG"}
          variant="primary"
          onPress={handleCadastrarOng}
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
