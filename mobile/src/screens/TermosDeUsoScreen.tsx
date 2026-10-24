import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

const SECOES = [
  {
    titulo: "1. Aceitação dos termos",
    texto:
      "Ao criar uma conta e usar o PetConnect, você concorda com estes Termos de Uso. Se não concordar com algum ponto, não utilize o aplicativo.",
  },
  {
    titulo: "2. Sobre o PetConnect",
    texto:
      "O PetConnect é uma plataforma que conecta tutores de animais a serviços e produtos para pets. Podemos atualizar ou alterar funcionalidades a qualquer momento.",
  },
  {
    titulo: "3. Cadastro e conta",
    texto:
      "Você deve fornecer informações verdadeiras e mantê-las atualizadas. Você é responsável por manter a confidencialidade da sua senha e por toda atividade realizada na sua conta.",
  },
  {
    titulo: "4. Uso adequado",
    texto:
      "É proibido usar o aplicativo para fins ilegais, publicar conteúdo ofensivo ou enganoso, ou tentar prejudicar o funcionamento da plataforma ou de outros usuários.",
  },
  {
    titulo: "5. Conteúdo do usuário",
    texto:
      "Fotos, textos e demais conteúdos que você publicar são de sua responsabilidade. Você nos autoriza a exibi-los dentro do aplicativo para o funcionamento do serviço.",
  },
  {
    titulo: "6. Responsabilidades",
    texto:
      "O PetConnect busca manter o serviço disponível e seguro, mas não garante funcionamento ininterrupto. Não nos responsabilizamos por acordos feitos diretamente entre usuários e prestadores.",
  },
  {
    titulo: "7. Encerramento da conta",
    texto:
      "Você pode encerrar sua conta quando quiser. Podemos suspender ou encerrar contas que violem estes termos.",
  },
  {
    titulo: "8. Alterações nos termos",
    texto:
      "Estes termos podem ser atualizados periodicamente. Quando houver mudanças relevantes, avisaremos pelo aplicativo.",
  },
  {
    titulo: "9. Contato",
    texto:
      "Em caso de dúvidas, entre em contato pelo e-mail de suporte informado no aplicativo.",
  },
];

export default function TermosDeUsoScreen() {
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