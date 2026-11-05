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
  "SolicitacoesUsuario"
>;

export function TelaSolicitacoesUsuario({ navigation }: Props) {
  const [solicitacoes] = useState<Solicitacao[]>([
    {
      id: "1",
      animal: "Rex",
      pessoa: "ONG Patinhas Felizes",
      data: "05/11/2026",
      status: "Em análise",
      descricao: "Sua solicitação está aguardando avaliação da ONG.",
    },
    {
      id: "2",
      animal: "Luna",
      pessoa: "ONG Amigos dos Animais",
      data: "28/10/2026",
      status: "Aprovada",
      descricao: "Sua solicitação foi aprovada pela ONG!",
    },
    {
      id: "3",
      animal: "Thor",
      pessoa: "ONG Esperança Animal",
      data: "20/10/2026",
      status: "Recusada",
      descricao: "A ONG informou que não foi possível aprovar a solicitação.",
    },
  ]);

  function verDetalhes(item: Solicitacao) {
    Alert.alert(
      `Solicitação de ${item.animal}`,
      `ONG: ${item.pessoa}\nData: ${item.data}\n\nInformações: ${
        item.descricao || "Nenhuma informação adicional."
      }\n\nStatus: ${item.status}`
    );
  }

  return (
    <SolicitacoesBase
      perfil="usuario"
      solicitacoes={solicitacoes}
      onVerDetalhes={verDetalhes}
      onVoltar={() => navigation.goBack()}
    />
  );
}