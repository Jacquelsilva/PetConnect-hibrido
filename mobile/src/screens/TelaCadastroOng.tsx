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
import { inserirOng } from "@/database/OngDAO";
import { saveSession } from "@/services/auth";

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
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
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
    if (carregando || buscandoCep) {
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
        mostrarAviso(
          "Erro no cadastro",
          "Não foi possível cadastrar a ONG. Verifique se o e-mail já está cadastrado."
        );
        return;
      }

      console.log("5 - CADASTRO REALIZADO COM SUCESSO");

      const ongCriada = await db.getFirstAsync<Ong>(
        "SELECT * FROM ongs WHERE email = ?",
        [novaOng.email]
      );

      if (!ongCriada?.id) {
        console.error("ERRO: ONG criada mas não encontrada no banco.");
        mostrarAviso(
          "Erro",
          "Cadastro realizado, mas não foi possível iniciar a sessão. Faça login."
        );
        return;
      }

      await saveSession({
        token: "registered-ong-token-" + Date.now(),
        user: {
          id: String(ongCriada.id),
          name: novaOng.nome,
          document: novaOng.cnpj,
          email: novaOng.email,
          type: "ong",
        },
      });

      navigation.replace("HomeOngs");
    } catch (error) {
      console.error("ERRO NO CADASTRO DA ONG:", error);

      mostrarAviso("Erro", "Ocorreu um problema ao cadastrar a ONG.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Cadastro de ONG" onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Cadastre sua ONG</Text>
        <Text style={styles.subtitle}>
          Conecte sua instituição a milhares de adotantes em potencial.
        </Text>

        <Input
          label="Nome da ONG"
          placeholder="Digite o nome da instituição"
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && <Text style={styles.error}>{erros.nome}</Text>}

        <Input
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          value={cnpj}
          onChangeText={setCnpj}
          keyboardType="numeric"
          maxLength={18}
          mask="cnpj"
        />
        {erros.cnpj && <Text style={styles.error}>{erros.cnpj}</Text>}

        <Input
          label="E-mail"
          placeholder="Digite o e-mail da ONG"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erros.email && <Text style={styles.error}>{erros.email}</Text>}

        <Input
          label="Senha"
          placeholder="Crie uma senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {erros.senha && <Text style={styles.error}>{erros.senha}</Text>}

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
          placeholder="Digite a cidade"
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
          title={carregando ? "Cadastrando..." : "Cadastrar ONG"}
          variant="primary"
          onPress={handleCadastrarOng}
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