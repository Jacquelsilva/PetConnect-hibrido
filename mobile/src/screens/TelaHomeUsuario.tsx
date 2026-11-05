import React, { useState } from "react";
import { HomeBase } from "@/screens/HomeBase";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "HomeUsuario">;

export function TelaHomeUsuario({ navigation }: Props) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const filtros = [
    { nome: "Todos", valor: "todos" },
    { nome: "Cães", valor: "caes" },
    { nome: "Gatos", valor: "gatos" },
    { nome: "Outros", valor: "outros" },
  ];

  const acoes = [
    {
      titulo: "Minhas solicitações",
      icone: "document-text" as const,
      onPress: () => navigation.navigate("SolicitacoesUsuario"),
    },
  ];

  const cartoes = [
    {
      id: "1",
      titulo: "Encontrar animais",
      descricao: "Conheça os animais disponíveis para adoção.",
      icone: "paw" as const,
      etiqueta: "Explore os animais",
    },
    {
      id: "2",
      titulo: "Minhas solicitações",
      descricao: "Acompanhe o andamento dos seus pedidos de adoção.",
      icone: "heart" as const,
      etiqueta: "Acompanhe suas solicitações",
      onPress: () => navigation.navigate("SolicitacoesUsuario"),
    },
  ];

  return (
    <HomeBase
      saudacao="Olá!"
      titulo="Encontre seu novo amigo"
      subtitulo="Um novo companheiro pode estar esperando por você."
      busca={busca}
      placeholderBusca="Buscar por nome do animal..."
      onChangeBusca={setBusca}
      filtros={filtros}
      filtroSelecionado={filtro}
      onSelecionarFiltro={setFiltro}
      acoes={acoes}
      cartoes={cartoes.filter((cartao) =>
        cartao.titulo.toLowerCase().includes(busca.toLowerCase())
      )}
      textoLista="EXPLORE O PETCONNECT"
      textoVazio="Nenhum resultado encontrado."
    />
  );
}
