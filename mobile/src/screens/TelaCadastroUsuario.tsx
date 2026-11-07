import React, { useRef, useState } from "react";

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

type RespostaViaCep = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
};

// Alert.alert não funciona na web, então usamos window.alert nesse caso
function mostrarAviso(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${titulo}\n\n${mensagem}`);
    }
  } else {
    Alert.alert(titulo, mensagem);
  }
}

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
  const [buscandoCep, setBuscandoCep] = useState(false);

  // guarda o último CEP consultado para não repetir a busca
  const ultimoCepBuscado = useRef<string>("");

  const somenteDigitos = (valor: string): string => {
    return valor.replace(/\D/g, "");
  };

  // Busca o endereço no ViaCEP
  async function buscarEnderecoPorCep(cepDigitos: string) {
    if (cepDigitos.length !== 8) return;
    if (cepDigitos === ultimoCepBuscado.current) return;

    ultimoCepBuscado.current = cepDigitos;
    setBuscandoCep(true);

    try {
      console.log("BUSCANDO CEP:", cepDigitos);

      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepDigitos}/json/`
      );

      if (!resposta.ok) {
        throw new Error(`Status ${resposta.status}`);
      }

      const dados: RespostaViaCep = await resposta.json();
      console.log("RESPOSTA VIACEP:", JSON.stringify(dados));

      if (dados.erro) {
        ultimoCepBuscado.current = "";
        setErros((anterior) => ({
          ...anterior,
          cep: "CEP não encontrado. Confira o número digitado.",
        }));
        return;
      }

      setEstado(dados.uf || "");
      setCidade(dados.localidade || "");

      const partesEndereco = [dados.logradouro, dados.bairro].filter(
        (parte): parte is string => !!parte && parte.trim() !== ""
      );

      // CEPs gerais de cidade pequena não têm rua: mantém o que já estava digitado
      if (partesEndereco.length > 0) {
        setEndereco(partesEndereco.join(", "));
      }

      // limpa os erros dos campos que acabaram de ser preenchidos
      setErros((anterior) => ({
        ...anterior,
        cep: undefined,
        estado: undefined,
        cidade: undefined,
        endereco: partesEndereco.length > 0 ? undefined : anterior.endereco,
      }));
    } catch (error) {
      console.error("ERRO AO BUSCAR CEP:", error);
      ultimoCepBuscado.current = "";
      mostrarAviso(
        "Erro",
        "Não foi possível buscar o CEP. Verifique sua internet ou preencha o endereço manualmente."
      );
    } finally {
      setBuscandoCep(false);
    }
  }

  function handleMudarCep(valor: string) {
    setCep(valor);

    const digitos = somenteDigitos(valor);

    // se o usuário apagou/editou o CEP, libera uma nova busca
    if (digitos.length < 8) {
      ultimoCepBuscado.current = "";
      return;
    }

    buscarEnderecoPorCep(digitos);
  }

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
    if (carregando || buscandoCep) return;

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
        mostrarAviso(
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

      if (!usuarioCriado?.id) {
        console.error("ERRO: usuário criado mas não encontrado no banco.");
        mostrarAviso(
          "Erro",
          "Cadastro realizado, mas não foi possível iniciar a sessão. Faça login."
        );
        return;
      }

      await saveSession({
        token: "registered-user-token-" + Date.now(),
        user: {
          id: String(usuarioCriado.id),
          name: novoUsuario.nome,
          document: novoUsuario.cpf,
          email: novoUsuario.email,
          type: "user",
        },
      });

      navigation.replace("HomeUsuario");
    } catch (error) {
      console.error("ERRO AO CADASTRAR USUÁRIO:", error);

      mostrarAviso("Erro", "Ocorreu um problema ao cadastrar o usuário.");
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
        {erros.nome && <Text style={styles.error}>{erros.nome}</Text>}

        <Input
          label="CPF"
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={14}
          mask="cpf"
        />
        {erros.cpf && <Text style={styles.error}>{erros.cpf}</Text>}

        <Input
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erros.email && <Text style={styles.error}>{erros.email}</Text>}

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {erros.senha && <Text style={styles.error}>{erros.senha}</Text>}

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
          label={buscandoCep ? "CEP (buscando endereço...)" : "CEP"}
          placeholder="00000-000"
          value={cep}
          onChangeText={handleMudarCep}
          keyboardType="numeric"
          maxLength={9}
          mask="cep"
        />
        {erros.cep && <Text style={styles.error}>{erros.cep}</Text>}

        <Input
          label="Estado"
          placeholder="Ex.: SP"
          value={estado}
          onChangeText={setEstado}
          autoCapitalize="characters"
          maxLength={2}
        />
        {erros.estado && <Text style={styles.error}>{erros.estado}</Text>}

        <Input
          label="Cidade"
          placeholder="Digite sua cidade"
          value={cidade}
          onChangeText={setCidade}
        />
        {erros.cidade && <Text style={styles.error}>{erros.cidade}</Text>}

        <Input
          label="Endereço"
          placeholder="Rua, número e bairro"
          value={endereco}
          onChangeText={setEndereco}
        />
        {erros.endereco && <Text style={styles.error}>{erros.endereco}</Text>}

        <Button
          title={carregando ? "Cadastrando..." : "Cadastrar Usuário"}
          variant="primary"
          onPress={handleCadastrar}
          disabled={carregando || buscandoCep}
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