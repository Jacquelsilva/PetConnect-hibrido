import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

const SECOES = [
  {
    titulo: "1. Introdução",
    texto:
      "A sua privacidade é importante para o PetConnect. Esta política explica quais dados coletamos, como os usamos e quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (LGPD).",
  },
  {
    titulo: "2. Dados que coletamos",
    texto:
      "Coletamos os dados que você informa no cadastro, como nome, e-mail e senha, além de informações sobre seus pets e dados de uso do aplicativo, como telas acessadas e tipo de dispositivo.",
  },
  {
    titulo: "3. Como usamos seus dados",
    texto:
      "Usamos seus dados para criar e manter sua conta, oferecer as funcionalidades do aplicativo, enviar avisos importantes, melhorar a experiência de uso e garantir a segurança da plataforma.",
  },
  {
    titulo: "4. Compartilhamento",
    texto:
      "Não vendemos seus dados pessoais. Podemos compartilhá-los com prestadores que ajudam a operar o serviço (como hospedagem e envio de e-mails) ou quando houver exigência legal.",
  },
  {
    titulo: "5. Armazenamento e segurança",
    texto:
      "Adotamos medidas técnicas para proteger suas informações contra acesso não autorizado, perda ou alteração. Mantemos seus dados apenas pelo tempo necessário para as finalidades descritas ou conforme exigido por lei.",
  },
  {
    titulo: "6. Seus direitos",
    texto:
      "Você pode solicitar a confirmação de que tratamos seus dados, acessar, corrigir ou excluir suas informações, revogar consentimentos e pedir a portabilidade dos dados, conforme previsto na LGPD.",
  },
  {
    titulo: "7. Cookies e dados de uso",
    texto:
      "Podemos usar tecnologias de armazenamento local e ferramentas de análise para entender como o aplicativo é utilizado e aprimorar seu funcionamento.",
  },
  {
    titulo: "8. Crianças e adolescentes",
    texto:
      "O PetConnect não é direcionado a menores de 18 anos. Se identificarmos dados de menores coletados sem autorização de um responsável, eles serão excluídos.",
  },
  {
    titulo: "9. Alterações nesta política",
    texto:
      "Podemos atualizar esta política periodicamente. Em caso de mudanças relevantes, avisaremos pelo aplicativo.",
  },
  {
    titulo: "10. Contato",
    texto:
      "Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato pelo e-mail de suporte informado no aplicativo.",
  },
];

export default function PoliticaDePrivacidadeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.atualizacao}>Última atualização: outubro de 2026</Text>

      {SECOES.map((secao) => (
        <React.Fragment key={secao.titulo}>
          <Text style={styles.subtitulo}>{secao.titulo}</Text>
          <Text style={styles.texto}>{secao.texto}</Text>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  atualizacao: {
    fontSize: 12,
    color: "#777",
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    lineHeight: 21,
    color: "#444",
  },
});