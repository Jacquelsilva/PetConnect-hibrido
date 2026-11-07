import React, { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  SolicitacoesBase,
  Solicitacao,
} from "@/screens/SolicitacoesBase";

import { getSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import {
  listarSolicitacoesPorOng,
  atualizarStatusSolicitacao,
} from "@/database/SolicitacaoDAO";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "SolicitacoesOngs"
>;

// Alert.alert não funciona na web
function mostrarAviso(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${titulo}\n\n${mensagem}`);
    }
  } else {
    Alert.alert(titulo, mensagem);
  }
}

// Alert.alert com botões não funciona na web: usa window.confirm
function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar: string,
  aoConfirmar: () => void,
  destrutivo = false
) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.confirm(`${titulo}\n\n${mensagem}`)) {
      aoConfirmar();
    }
  } else {
    Alert.alert(titulo, mensagem, [
      { text: "Cancelar", style: "cancel" },
      {
        text: textoConfirmar,
        style: destrutivo ? "destructive" : "default",
        onPress: aoConfirmar,
      },
    ]);
  }
}

// Monta o texto de detalhes a partir dos dados que o usuário preencheu
function montarDescricao(s: {
  telefone?: string;
  moradia?: string;
  outros_animais?: string;
  experiencia?: string;
  observacoes?: string;
}): string {
  const partes: string[] = [];

  if (s.telefone) partes.push(`Telefone: ${s.telefone}`);
  if (s.moradia) partes.push(`Moradia: ${s.moradia}`);
  if (s.outros_animais) partes.push(`Outros animais: ${s.outros_animais}`);
  if (s.experiencia) partes.push(`Experiência: ${s.experiencia}`);
  if (s.observacoes) partes.push(`Observações: ${s.observacoes}`);

  return partes.length > 0
    ? partes.join("\n")
    : "Nenhuma informação adicional.";
}

export function TelaSolicitacoesOngs({ navigation }: Props) {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  const carregar = useCallback(async () => {
    try {
      const session = await getSession();

      if (!session?.user?.id) {
        console.error("SOLICITAÇÕES ONG: sessão sem usuário.");
        return;
      }

      const db = await getDatabase();
      const linhas = await listarSolicitacoesPorOng(
        db,
        Number(session.user.id)
      );

      console.log("SOLICITAÇÕES DA ONG:", linhas.length);

      const lista: Solicitacao[] = linhas.map(
        (s) =>
          ({
            id: String(s.id),
            animal: s.nome_animal || "Animal",
            pessoa: s.nome_solicitante || "Solicitante não informado",
            data: s.data || "",
            status: s.status || "Em análise",
            descricao: montarDescricao(s),
          } as Solicitacao)
      );

      setSolicitacoes(lista);
    } catch (e) {
      console.error("ERRO AO CARREGAR SOLICITAÇÕES DA ONG:", e);
    }
  }, []);

  // recarrega sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function mudarStatus(item: Solicitacao, novoStatus: string) {
    try {
      const db = await getDatabase();
      const ok = await atualizarStatusSolicitacao(
        db,
        Number(item.id),
        novoStatus
      );

      console.log("MUDAR STATUS:", item.id, novoStatus, "->", ok);

      if (!ok) {
        mostrarAviso("Erro", "Não foi possível atualizar a solicitação.");
        return;
      }

      // atualiza a tela na hora, sem esperar nova consulta
      setSolicitacoes((anteriores) =>
        anteriores.map((solicitacao) =>
          solicitacao.id === item.id
            ? ({ ...solicitacao, status: novoStatus } as Solicitacao)
            : solicitacao
        )
      );

      mostrarAviso(
        novoStatus === "Aprovada" ? "Sucesso" : "Solicitação recusada",
        novoStatus === "Aprovada"
          ? "Solicitação aprovada!"
          : "O status foi atualizado."
      );
    } catch (e) {
      console.error("ERRO AO MUDAR STATUS:", e);
      mostrarAviso("Erro", "Ocorreu um erro ao atualizar a solicitação.");
    }
  }

  function aprovarSolicitacao(item: Solicitacao) {
    confirmar(
      "Aprovar solicitação",
      `Deseja aprovar a solicitação de ${item.pessoa} para adoção de ${item.animal}?`,
      "Aprovar",
      () => mudarStatus(item, "Aprovada")
    );
  }

  function recusarSolicitacao(item: Solicitacao) {
    confirmar(
      "Recusar solicitação",
      `Deseja recusar a solicitação de ${item.pessoa} para adoção de ${item.animal}?`,
      "Recusar",
      () => mudarStatus(item, "Recusada"),
      true
    );
  }

  function verDetalhes(item: Solicitacao) {
    mostrarAviso(
      `Solicitação de ${item.animal}`,
      `Interessado: ${item.pessoa}\nData: ${item.data}\n\n${
        item.descricao || "Nenhuma descrição informada."
      }\n\nStatus: ${item.status}`
    );
  }

  return (
    <SolicitacoesBase
      perfil="ong"
      solicitacoes={solicitacoes}
      onVerDetalhes={verDetalhes}
      onAprovar={aprovarSolicitacao}
      onRecusar={recusarSolicitacao}
      onVoltar={() => navigation.goBack()}
    />
  );
}