import React, { createElement, useEffect, useState } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { PhotoPicker } from "@/components/ui/PhotoPicker";

import { getDatabase } from "@/database/Database";
import { buscarAnimal, atualizarAnimal } from "@/database/AnimalDAO";

import type { Animal } from "@/models/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "editanimal">;

type Erros = Partial<
  Record<"nome" | "especie" | "dataNascimento" | "porte" | "sexo", string>
>;

const ESPECIES = ["Cachorro", "Gato", "Outro"];
const PORTES = ["Pequeno", "Médio", "Grande"];
const SEXOS = ["Macho", "Fêmea"];

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

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, "0");
}

function formatarBR(data: Date): string {
  return `${doisDigitos(data.getDate())}/${doisDigitos(
    data.getMonth() + 1
  )}/${data.getFullYear()}`;
}

function paraISO(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(
    data.getDate()
  )}`;
}

function deISO(texto: string): Date | null {
  const [ano, mes, dia] = texto.split("-").map(Number);
  if (!ano || !mes || !dia) return null;
  return new Date(ano, mes - 1, dia);
}

function calcularIdade(nascimento: Date): number {
  const hoje = new Date();
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() &&
      hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) anos -= 1;

  return Math.max(anos, 0);
}

function textoIdade(idade: number): string {
  if (idade === 0) return "Menos de 1 ano";
  return idade === 1 ? "1 ano" : `${idade} anos`;
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

type CampoDataProps = {
  label: string;
  valor: Date | null;
  dica: string;
  onSelecionar: (data: Date) => void;
};

function CampoData({ label, valor, dica, onSelecionar }: CampoDataProps) {
  const [mostrar, setMostrar] = useState(false);
  const hoje = new Date();

  if (Platform.OS === "web") {
    return (
      <View style={styles.grupo}>
        <Text style={styles.label}>{label}</Text>
        {createElement("input", {
          type: "date",
          value: valor ? paraISO(valor) : "",
          max: paraISO(hoje),
          onChange: (evento: { target: { value: string } }) => {
            const data = deISO(evento.target.value);
            if (data) onSelecionar(data);
          },
          style: {
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #CCCCCC",
            backgroundColor: "#FFFFFF",
            color: "#333333",
            fontFamily: "inherit",
          },
        })}
        <Text style={styles.dica}>{dica}</Text>
      </View>
    );
  }

  return (
    <View style={styles.grupo}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.campoData}
        onPress={() => setMostrar((atual) => !atual)}
      >
        <Text style={valor ? styles.campoDataTexto : styles.campoDataVazio}>
          {valor ? formatarBR(valor) : "Selecione a data"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.dica}>{dica}</Text>
      {mostrar && (
        <DateTimePicker
          value={valor ?? hoje}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          maximumDate={hoje}
          onChange={(_evento, data) => {
            if (Platform.OS !== "ios") setMostrar(false);
            if (data) onSelecionar(data);
          }}
        />
      )}
    </View>
  );
}

export function EditAnimalScreen({ navigation, route }: Props) {
  const { id } = route.params;

  const [animalOriginal, setAnimalOriginal] = useState<Animal | null>(null);
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [porte, setPorte] = useState("");
  const [sexo, setSexo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const db = await getDatabase();
        const animal = await buscarAnimal(db, id);

        if (!animal) {
          mostrarAviso("Erro", "Animal não encontrado.", () =>
            navigation.goBack()
          );
          return;
        }

        setAnimalOriginal(animal);
        setNome(animal.nome || "");
        setEspecie(animal.especie || "");
        setPorte(animal.porte || "");
        setSexo(animal.sexo || "");
        setDescricao(animal.descricao || "");
        setFotoUrl(animal.foto_url || null);
        setDataNascimento(
          animal.data_nascimento ? deISO(animal.data_nascimento) : null
        );
      } catch (e) {
        console.error("ERRO AO CARREGAR ANIMAL PARA EDIÇÃO:", e);
        mostrarAviso("Erro", "Não foi possível carregar o animal.", () =>
          navigation.goBack()
        );
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, navigation]);

  function validar(): boolean {
    const novosErros: Erros = {};

    if (!nome.trim()) {
      novosErros.nome = "Informe o nome do animal.";
    }

    if (!especie) {
      novosErros.especie = "Selecione a espécie.";
    }

    if (dataNascimento && dataNascimento.getTime() > Date.now()) {
      novosErros.dataNascimento = "A data não pode ser no futuro.";
    }

    if (!porte) {
      novosErros.porte = "Selecione o porte.";
    }

    if (!sexo) {
      novosErros.sexo = "Selecione o sexo.";
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function handleSalvar() {
    if (salvando || !animalOriginal) return;

    if (!validar()) return;

    setSalvando(true);

    try {
      const atualizado: Animal = {
        ...animalOriginal,
        nome: nome.trim(),
        especie,
        idade: dataNascimento
          ? calcularIdade(dataNascimento)
          : animalOriginal.idade,
        data_nascimento: dataNascimento
          ? paraISO(dataNascimento)
          : animalOriginal.data_nascimento ?? null,
        porte,
        sexo,
        descricao: descricao.trim(),
        foto_url: fotoUrl || null,
      };

      const db = await getDatabase();
      const ok = await atualizarAnimal(db, atualizado);

      if (!ok) {
        mostrarAviso("Erro", "Não foi possível salvar as alterações.");
        return;
      }

      mostrarAviso("Sucesso", "Animal atualizado com sucesso!", () =>
        navigation.goBack()
      );
    } catch (e) {
      console.error("ERRO AO ATUALIZAR ANIMAL:", e);
      mostrarAviso("Erro", "Ocorreu um problema ao salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  const dicaData = dataNascimento
    ? `Idade: ${textoIdade(calcularIdade(dataNascimento))}`
    : animalOriginal
    ? `Sem data cadastrada. Idade atual: ${textoIdade(animalOriginal.idade)}`
    : "";

  if (carregando) {
    return (
      <View style={styles.flex}>
        <Header title="Editar Animal" onBackPress={() => navigation.goBack()} />
        <Text style={styles.carregando}>Carregando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Editar Animal" onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Editar animal</Text>
        <Text style={styles.subtitle}>
          Altere os dados e toque em salvar.
        </Text>

        <PhotoPicker
          label="Foto do animal (opcional)"
          value={fotoUrl}
          onChange={setFotoUrl}
        />

        <Input
          label="Nome"
          placeholder="Ex.: Rex"
          value={nome}
          onChangeText={setNome}
        />
        {erros.nome && <Text style={styles.error}>{erros.nome}</Text>}

        <Opcoes
          label="Espécie"
          opcoes={ESPECIES}
          valor={especie}
          onSelecionar={setEspecie}
        />
        {erros.especie && <Text style={styles.error}>{erros.especie}</Text>}

        <CampoData
          label="Data de nascimento"
          valor={dataNascimento}
          dica={dicaData}
          onSelecionar={setDataNascimento}
        />
        {erros.dataNascimento && (
          <Text style={styles.error}>{erros.dataNascimento}</Text>
        )}

        <Opcoes
          label="Porte"
          opcoes={PORTES}
          valor={porte}
          onSelecionar={setPorte}
        />
        {erros.porte && <Text style={styles.error}>{erros.porte}</Text>}

        <Opcoes
          label="Sexo"
          opcoes={SEXOS}
          valor={sexo}
          onSelecionar={setSexo}
        />
        {erros.sexo && <Text style={styles.error}>{erros.sexo}</Text>}

        <Input
          label="Descrição"
          placeholder="Temperamento, saúde, vacinas..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Button
          title={salvando ? "Salvando..." : "Salvar alterações"}
          variant="primary"
          onPress={handleSalvar}
          disabled={salvando}
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
  carregando: {
    padding: 24,
    textAlign: "center",
    color: "#666666",
    fontSize: 15,
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
    marginBottom: 20,
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
  campoData: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#FFFFFF",
  },
  campoDataTexto: {
    fontSize: 16,
    color: "#333333",
  },
  campoDataVazio: {
    fontSize: 16,
    color: "#999999",
  },
  dica: {
    fontSize: 12,
    color: "#666666",
    marginTop: 6,
  },
  error: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
});