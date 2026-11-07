import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";

import { getSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import { buscarAnimal } from "@/database/AnimalDAO";
import { inserirSolicitacao, jaSolicitou } from "@/database/SolicitacaoDAO";

import type { Animal } from "@/models/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "solicitaradocao">;

type Erros = Partial<Record<"nome" | "telefone" | "moradia", string>>;

const MORADIAS = ["Casa", "Apartamento", "Chácara/Sítio"];
const SIM_NAO = ["Sim", "Não"];

function mostrarAviso(titulo: string, mensagem: string, aoFechar?: () => void) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${titulo}\n\n${mensagem}`);
    }
    aoFechar?.();
  } else {
    Alert.alert(
      titulo,
      mensagem,
      aoFechar ? [{ text: "OK", onPress: aoFechar }] : undefined
    );
  }
}

type OpcoesProps = {
  label: string;
  opcoes: string[];
  valor: string;
  onSelecionar: (valor: string) => void;
};

function Opcoes({ label, opcoes, valor, onSelecionar }: OpcoesProps) {
  return (
    <View style={styles.grupo}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.linha}>
        {opcoes.map((opcao) => {
          const selecionada = valor === opcao;
          return (
            <TouchableOpacity
              key={opcao}
              style={[styles.chip, selecionada && styles.chipSelecionado]}
              onPress={() => onSelecionar(opcao)}
            >
              <Text
                style={[
                  styles.chipTexto,
                  selecionada && styles.chipTextoSelecionado,
                ]}
              >
                {opcao}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function SolicitarAdocaoScreen({ navigation, route }: Props) {
  const { id } = route.params;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [moradia, setMoradia] = useState("");
  const [outrosAnimais, setOutrosAnimais] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let ativo = true;

    (async () => {
      try {
        const db = await getDatabase();
        const resultado = await buscarAnimal(db, id);
        if (ativo) setAnimal(resultado);
      } catch (e) {
        console.error("ERRO AO CARREGAR ANIMAL DA SOLICITAÇÃO:", e);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [id]);

  function validar(): boolean {
    const novosErros: Erros = {};

    if (!nome.trim()) novosErros.nome = "Informe o seu nome.";

    if (telefone.replace(/\D/g, "").length < 10) {
      novosErros.telefone = "Informe um telefone com DDD.";
    }

    if (!moradia) novosErros.moradia = "Selecione o tipo de moradia.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleEnviar() {
    if (enviando) return;
    if (!validar()) return;

    setEnviando(true);

    try {
      const session = await getSession();

      if (!session?.user?.id) {
        mostrarAviso("Erro", "Sessão não encontrada. Faça login novamente.");
        return;
      }

      const idUsuario = Number(session.user.id);
      const idAnimal = String(id);
      const db = await getDatabase();

      if (await jaSolicitou(db, idUsuario, idAnimal)) {
        mostrarAviso(
          "Solicitação já enviada",
          "Você já enviou uma solicitação para este animal. Acompanhe em Minhas solicitações."
        );
        return;
      }

      const ok = await inserirSolicitacao(db, {
        id_usuario: idUsuario,
        id_animal: idAnimal,
        nome_solicitante: nome.trim(),
        telefone: telefone.trim(),
        moradia,
        outros_animais: outrosAnimais,
        experiencia: experiencia.trim(),
        observacoes: observacoes.trim(),
      });

      if (!ok) {
        mostrarAviso("Erro", "Não foi possível enviar a solicitação.");
        return;
      }

      mostrarAviso(
        "Solicitação enviada",
        "A ONG recebeu o seu pedido e vai entrar em contato. Você pode acompanhar em Minhas solicitações.",
        () => navigation.goBack()
      );
    } catch (e) {
      console.error("ERRO AO ENVIAR SOLICITAÇÃO:", e);
      mostrarAviso("Erro", "Ocorreu um problema ao enviar a solicitação.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header
        title="Solicitar adoção"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {animal ? `Adotar ${animal.nome}` : "Solicitar adoção"}
        </Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo. A ONG responsável vai analisar o seu pedido.
        </Text>

        <Input
          label="Seu nome"
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && <Text style={styles.error}>{erros.nome}</Text>}

        <Input
          label="Telefone / WhatsApp"
          placeholder="(11) 99999-9999"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        {erros.telefone && <Text style={styles.error}>{erros.telefone}</Text>}

        <Opcoes
          label="Tipo de moradia"
          opcoes={MORADIAS}
          valor={moradia}
          onSelecionar={setMoradia}
        />
        {erros.moradia && <Text style={styles.error}>{erros.moradia}</Text>}

        <Opcoes
          label="Você tem outros animais?"
          opcoes={SIM_NAO}
          valor={outrosAnimais}
          onSelecionar={setOutrosAnimais}
        />

        <Input
          label="Experiência com animais"
          placeholder="Já teve cachorro ou gato? Conte um pouco."
          value={experiencia}
          onChangeText={setExperiencia}
          multiline
        />

        <Input
          label="Observações (opcional)"
          placeholder="Algo mais que a ONG deve saber"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
        />

        <Button
          title={enviando ? "Enviando..." : "Enviar solicitação"}
          variant="primary"
          onPress={handleEnviar}
          disabled={enviando}
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
  grupo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#FFFFFF",
  },
  chipSelecionado: {
    backgroundColor: "#0F766E",
    borderColor: "#0F766E",
  },
  chipTexto: {
    fontSize: 14,
    color: "#333333",
  },
  chipTextoSelecionado: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  error: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
});