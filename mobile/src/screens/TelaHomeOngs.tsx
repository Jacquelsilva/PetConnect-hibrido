import React, { useState } from "react";
import { HomeBase } from "@/screens/HomeBase";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "HomeOngs">;

export function TelaHomeOngs({ navigation }: Props) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const filtros = [
    { nome: "Todos", valor: "todos" },
    { nome: "Disponíveis", valor: "disponiveis" },
    { nome: "Adotados", valor: "adotados" },
  ];

  const indicadores = [
    {
      titulo: "Animais cadastrados",
      valor: 12,
      icone: "paw" as const,
    },
    {
      titulo: "Solicitações recebidas",
      valor: 5,
      icone: "mail" as const,
    },
  ];

  const acoes = [
    {
      titulo: "Cadastrar animal",
      icone: "add-circle" as const,
      onPress: () => {
        // navigation.navigate("CadastroAnimal");
      },
    },
    {
      titulo: "Ver solicitações",
      icone: "document-text" as const,
      onPress: () => navigation.navigate("SolicitacoesOngs"),
    },
  ];

  const cartoes = [
    {
      id: "1",
      titulo: "Gerenciar animais",
      descricao: "Visualize e atualize os animais cadastrados.",
      icone: "paw" as const,
      etiqueta: "12 animais cadastrados",
    },
    {
      id: "2",
      titulo: "Solicitações de adoção",
      descricao: "Acompanhe as pessoas interessadas em adotar.",
      icone: "people" as const,
      etiqueta: "5 solicitações pendentes",
      onPress: () => navigation.navigate("SolicitacoesOngs"),
    },
  ];

  return (
    <HomeBase
      saudacao="Bem-vinda!"
      titulo="Área da ONG"
      subtitulo="Gerencie seus animais e acompanhe as adoções."
      busca={busca}
      placeholderBusca="Buscar animais..."
      onChangeBusca={setBusca}
      filtros={filtros}
      filtroSelecionado={filtro}
      onSelecionarFiltro={setFiltro}
      indicadores={indicadores}
      acoes={acoes}
      cartoes={cartoes.filter((cartao) =>
        cartao.titulo.toLowerCase().includes(busca.toLowerCase())
      )}
      textoLista="GERENCIAMENTO"
      textoVazio="Nenhum resultado encontrado."
    />
  );
}
