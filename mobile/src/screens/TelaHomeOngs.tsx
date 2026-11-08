import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { HomeBase } from "@/screens/HomeBase";
import { getSession } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getDatabase } from "@/database/Database";
import { listarAnimaisDaOng } from "@/database/AnimalDAO";
import { contarSolicitacoesDaOng } from "@/database/SolicitacaoDAO";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "HomeOngs">;

export function TelaHomeOngs({ navigation }: Props) {
  const { user } = useAuth();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const [totalAnimais, setTotalAnimais] = useState(0);
  const [totalSolicitacoes, setTotalSolicitacoes] = useState(0);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        try {
          const session = await getSession();

          if (!session?.user?.id) {
            console.error("HOME ONG: sessão sem usuário.");
            return;
          }

          const idOng = Number(session.user.id);
          const db = await getDatabase();

          const animais = await listarAnimaisDaOng(db, idOng);
          const solicitacoes = await contarSolicitacoesDaOng(db, idOng);

          if (ativo) {
            setTotalAnimais(animais.length);
            setTotalSolicitacoes(solicitacoes.total);
            setSolicitacoesPendentes(solicitacoes.pendentes);
          }
        } catch (e) {
          console.error("ERRO AO CARREGAR HOME DA ONG:", e);
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, [])
  );

  const filtros = [
    { nome: "Todos", valor: "todos" },
    { nome: "Disponíveis", valor: "disponiveis" },
    { nome: "Adotados", valor: "adotados" },
  ];

  const indicadores = [
    {
      titulo: "Animais cadastrados",
      valor: totalAnimais,
      icone: "paw" as const,
    },
    {
      titulo: "Solicitações recebidas",
      valor: totalSolicitacoes,
      icone: "mail" as const,
    },
  ];

  const acoes = [
    {
      titulo: "Cadastrar animal",
      icone: "add-circle" as const,
      onPress: () => navigation.navigate("animalregistration"),
    },
    {
      titulo: "Gerenciar animais",
      icone: "paw" as const,
      onPress: () => navigation.navigate("manageanimals"),
    },
    {
      titulo: "Ver solicitações",
      icone: "document-text" as const,
      onPress: () => navigation.navigate("SolicitacoesOngs"),
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
      titulo: "Cadastrar animal",
      descricao: "Adicione um novo animal para adoção.",
      icone: "add-circle" as const,
      etiqueta: "Novo cadastro",
      onPress: () => navigation.navigate("animalregistration"),
    },
    {
      id: "2",
      titulo: "Gerenciar animais",
      descricao: "Visualize e atualize os animais cadastrados.",
      icone: "paw" as const,
      etiqueta:
        totalAnimais === 1
          ? "1 animal cadastrado"
          : `${totalAnimais} animais cadastrados`,
      onPress: () => navigation.navigate("manageanimals"),
    },
    {
      id: "3",
      titulo: "Solicitações de adoção",
      descricao: "Acompanhe as pessoas interessadas em adotar.",
      icone: "people" as const,
      etiqueta:
        solicitacoesPendentes === 1
          ? "1 solicitação pendente"
          : `${solicitacoesPendentes} solicitações pendentes`,
      onPress: () => navigation.navigate("SolicitacoesOngs"),
    },
    {
      id: "4",
      titulo: "Configurações",
      descricao: "Gerencie dados da ONG e preferências.",
      icone: "settings" as const,
      etiqueta: "Configurações da conta",
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  return (
    <HomeBase
      saudacao={`Olá, ${user?.name || "ONG"}!`}
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