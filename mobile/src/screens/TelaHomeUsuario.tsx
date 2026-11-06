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
      titulo: "Meus Favoritos",
      icone: "heart" as const,
      onPress: () => navigation.navigate("Favoritos"),
    },
    {
      titulo: "Minhas solicitações",
      icone: "document-text" as const,
      onPress: () => navigation.navigate("SolicitacoesUsuario"),
    },
    {
      titulo: "Configurações",
      icone: "settings" as const,
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  const cartoes = [
    {
      id: "1",
      titulo: "Meus Favoritos",
      descricao: "Veja os pets que você favoritou.",
      icone: "heart" as const,
      etiqueta: "Acesse seus favoritos",
      onPress: () => navigation.navigate("Favoritos"),
    },
    {
      id: "2",
      titulo: "Minhas solicitações",
      descricao: "Acompanhe o andamento dos seus pedidos de adoção.",
      icone: "document-text" as const,
      etiqueta: "Acompanhe suas solicitações",
      onPress: () => navigation.navigate("SolicitacoesUsuario"),
    },
    {
      id: "3",
      titulo: "Configurações",
      descricao: "Gerencie sua conta e preferências.",
      icone: "settings" as const,
      etiqueta: "Configurações da conta",
      onPress: () => navigation.navigate("Settings"),
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
