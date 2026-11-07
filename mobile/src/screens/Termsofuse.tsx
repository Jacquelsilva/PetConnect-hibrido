import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LegalDocument, LegalSection } from "@/components/LegalDocument";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Termsofuse">;

const sections: LegalSection[] = [
  {
    title: "Aceitação dos termos",
    paragraphs: [
      "Ao criar uma conta ou usar o PetConnect, você declara que leu e concorda com estes Termos de Uso. Se não concordar, não utilize o aplicativo.",
    ],
  },
  {
    title: "Sobre o PetConnect",
    paragraphs: [
      "O PetConnect é uma plataforma que conecta pessoas interessadas em adotar animais a ONGs e tutores responsáveis. O aplicativo facilita o contato, mas não participa diretamente das adoções.",
    ],
  },
  {
    title: "Cadastro e conta",
    paragraphs: [
      "Você deve fornecer informações verdadeiras, completas e atualizadas.",
      "Você é responsável por manter a confidencialidade da sua senha e por todas as atividades realizadas na sua conta.",
      "É necessário ser maior de 18 anos ou estar representado por um responsável legal.",
    ],
  },
  {
    title: "Condutas permitidas e proibidas",
    paragraphs: [
      "Você concorda em tratar os animais com responsabilidade e respeitar os demais usuários.",
      "É proibido publicar informações falsas, cadastrar animais para venda ou exploração, praticar maus-tratos, assediar outros usuários, ou usar o aplicativo para fins ilegais.",
    ],
  },
  {
    title: "Adoções e responsabilidades",
    paragraphs: [
      "A decisão de adotar ou entregar um animal é de responsabilidade exclusiva das partes envolvidas.",
      "O PetConnect não garante a saúde, o comportamento ou a procedência dos animais anunciados, nem a veracidade das informações publicadas pelos usuários e ONGs.",
    ],
  },
  {
    title: "Conteúdo publicado",
    paragraphs: [
      "Você é responsável pelos textos e imagens que publica. Ao publicá-los, autoriza o PetConnect a exibi-los dentro da plataforma para a finalidade de divulgação dos animais.",
    ],
  },
  {
    title: "Suspensão e encerramento",
    paragraphs: [
      "Contas que violarem estes termos podem ser suspensas ou excluídas. Você também pode encerrar sua conta a qualquer momento.",
    ],
  },
  {
    title: "Alterações dos termos",
    paragraphs: [
      "Estes termos podem ser atualizados. O uso continuado do aplicativo após as mudanças representa a aceitação da nova versão.",
    ],
  },
  {
    title: "Contato",
    paragraphs: [
      "Em caso de dúvidas, entre em contato: contato@petconnect.com.br",
    ],
  },
];

export function TermsofuseScreen({ navigation }: Props) {
  return (
    <LegalDocument
      title="Termos de Uso"
      updatedAt="07/11/2026"
      intro="Estes termos regulam o uso do aplicativo PetConnect. Leia com atenção antes de utilizar a plataforma."
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}