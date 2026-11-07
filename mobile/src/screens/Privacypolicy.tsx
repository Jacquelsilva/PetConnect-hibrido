import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacyPolicy">;

const sections: LegalSection[] = [
  {
    title: "Dados que coletamos",
    paragraphs: [
      "Coletamos os dados fornecidos por você no cadastro, como nome, CPF ou CNPJ, e-mail, telefone e endereço.",
      "Também armazenamos as informações dos pets cadastrados, suas solicitações de adoção e seus favoritos.",
    ],
  },
  {
    title: "Como usamos seus dados",
    paragraphs: [
      "Utilizamos seus dados para criar e manter sua conta, conectar tutores, adotantes e ONGs, processar solicitações de adoção e melhorar a experiência no aplicativo.",
      "Podemos usar sua localização aproximada, caso você permita, para sugerir pets e ONGs da sua região.",
    ],
  },
  {
    title: "Compartilhamento de informações",
    paragraphs: [
      "Seus dados não são vendidos a terceiros.",
      "Informações de contato podem ser exibidas a outros usuários apenas conforme as suas configurações de privacidade e quando necessário para uma solicitação de adoção.",
      "Podemos compartilhar dados com prestadores de serviço essenciais ao funcionamento do aplicativo, ou quando exigido por lei.",
    ],
  },
  {
    title: "Armazenamento e segurança",
    paragraphs: [
      "Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração.",
      "Os dados são mantidos pelo tempo necessário para cumprir as finalidades descritas nesta política ou obrigações legais.",
    ],
  },
  {
    title: "Seus direitos (LGPD)",
    paragraphs: [
      "Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar a confirmação do tratamento, o acesso, a correção, a portabilidade e a exclusão dos seus dados.",
      "Você pode alterar suas preferências de privacidade e excluir sua conta a qualquer momento na tela de Privacidade e Segurança.",
    ],
  },
  {
    title: "Alterações nesta política",
    paragraphs: [
      "Esta política pode ser atualizada periodicamente. Avisaremos sobre mudanças relevantes pelo aplicativo.",
    ],
  },
  {
    title: "Contato",
    paragraphs: [
      "Dúvidas sobre privacidade ou solicitações relacionadas aos seus dados podem ser enviadas para: contato@petconnect.com.br",
    ],
  },
];

export function PrivacyPolicyScreen({ navigation }: Props) {
  return (
    <LegalDocument
      title="Política de Privacidade"
      updatedAt="07/11/2026"
      intro="O PetConnect valoriza a sua privacidade. Esta política explica quais dados coletamos, como os utilizamos e quais são os seus direitos."
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}