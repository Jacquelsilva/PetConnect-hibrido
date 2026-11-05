import React, { useState } from "react";
import { Alert } from "react-native";

import {
  SolicitacoesBase,
  Solicitacao,
} from "@/screens/SolicitacoesBase";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "SolicitacoesOngs"
>;

export function TelaSolicitacoesOngs({ navigation }: Props) {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([
    {
      id: "1",
      animal: "Rex",
      pessoa: "Maria Silva",
      data: "05/11/2026",
      status: "Em análise",
      descricao: "Tenho interesse em oferecer um novo lar para o Rex.",
    },
    {
      id: "2",
      animal: "Luna",
      pessoa: "João Santos",
      data: "03/11/2026",
      status: "Em análise",
      descricao: "Tenho experiência com gatos e gostaria de adotá-la.",
    },
    {
      id: "3",
      animal: "Mel",
      pessoa: "Ana Oliveira",
      data: "01/11/2026",
      status: "Aprovada",
      descricao: "Solicitação aprovada pela ONG.",
    },
  ]);

  function aprovarSolicitacao(item: Solicitacao) {
    Alert.alert(
      "Aprovar solicitação",
      `Deseja aprovar a solicitação de ${item.pessoa} para adoção de ${item.animal}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Aprovar",
          onPress: () => {
            setSolicitacoes((anteriores) =>
              anteriores.map((solicitacao) =>
                solicitacao.id === item.id
                  ? { ...solicitacao, status: "Aprovada" }
                  : solicitacao
              )
            );

            Alert.alert("Sucesso", "Solicitação aprovada!");
          },
        },
      ]
    );
  }

  function recusarSolicitacao(item: Solicitacao) {
    Alert.alert(
      "Recusar solicitação",
      `Deseja recusar a solicitação de ${item.pessoa} para adoção de ${item.animal}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Recusar",
          style: "destructive",
          onPress: () => {
            setSolicitacoes((anteriores) =>
              anteriores.map((solicitacao) =>
                solicitacao.id === item.id
                  ? { ...solicitacao, status: "Recusada" }
                  : solicitacao
              )
            );

            Alert.alert("Solicitação recusada", "O status foi atualizado.");
          },
        },
      ]
    );
  }

  function verDetalhes(item: Solicitacao) {
    Alert.alert(
      `Solicitação de ${item.animal}`,
      `Interessado: ${item.pessoa}\nData: ${item.data}\n\nDescrição: ${
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
