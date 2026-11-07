import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { getUserWhatsapp } from "@/services/auth";
import type { HelpSupportScreenProps } from "@/types/navigation";

const SUPPORT_EMAIL = "contato@petconnect.com.br";
const FALLBACK_WHATSAPP = "5519999999999"; // usado se o usuário não tiver número no banco
const APP_VERSION = "1.0.0";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ: FaqItem[] = [
  {
    question: "Como faço para adotar um pet?",
    answer:
      "Abra a página do pet desejado e envie uma solicitação de adoção. A ONG ou o tutor responsável vai analisar seu pedido e entrar em contato. Você acompanha o andamento na tela de Solicitações.",
  },
  {
    question: "Como cadastro um animal?",
    answer:
      "Se você é uma ONG ou tutor, acesse a tela inicial e use a opção de cadastrar animal. Preencha nome, espécie, idade, descrição e adicione fotos.",
  },
  {
    question: "Como edito meus dados?",
    answer:
      "Vá em Configurações > Editar Perfil. Lá você pode atualizar suas informações pessoais e de contato.",
  },
  {
    question: "Esqueci minha senha. E agora?",
    answer:
      "Na tela de login, use a opção de recuperação de senha. Se estiver logado, vá em Configurações > Privacidade e Segurança > Alterar senha.",
  },
  {
    question: "Como excluo minha conta?",
    answer:
      "Acesse Configurações > Privacidade e Segurança e use a opção Excluir minha conta, na zona de perigo. Essa ação é permanente.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. Seus dados não são vendidos a terceiros e você controla o que aparece no seu perfil em Privacidade e Segurança. Veja mais na Política de Privacidade.",
  },
];

async function openLink(url: string, errorMessage: string) {
  try {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
      return;
    }
    await Linking.openURL(url);
  } catch (e) {
    if (Platform.OS === "web") {
      window.alert(errorMessage);
    } else {
      Alert.alert("Ops", errorMessage);
    }
  }
}

async function sendEmail(subject: string, body: string = "") {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (Platform.OS === "web") {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${encodedSubject}&body=${encodedBody}`;
    window.open(gmailUrl, "_blank");
    return;
  }

  try {
    await Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodedSubject}&body=${encodedBody}`
    );
  } catch (e) {
    Alert.alert(
      "Não foi possível abrir o e-mail",
      `Nenhum app de e-mail encontrado. Envie sua mensagem para ${SUPPORT_EMAIL}.`
    );
  }
}

function formatPhone(digits: string): string {
  const local = digits.startsWith("55") ? digits.slice(2) : digits;
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return digits;
}

export function HelpSupportScreen({ navigation }: HelpSupportScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [userWhatsapp, setUserWhatsapp] = useState<string | null>(null);

  useEffect(() => {
    async function loadWhatsapp() {
      const number = await getUserWhatsapp();
      setUserWhatsapp(number);
    }
    loadWhatsapp();
  }, []);

  const whatsappNumber = userWhatsapp || FALLBACK_WHATSAPP;

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleEmail = () => {
    sendEmail("Suporte PetConnect");
  };

  const handleWhatsapp = () => {
    const text = encodeURIComponent("Olá! Preciso de ajuda com o PetConnect.");
    openLink(
      `https://wa.me/${whatsappNumber}?text=${text}`,
      "Não foi possível abrir o WhatsApp."
    );
  };

  const handleReport = () => {
    sendEmail(
      "Problema no app PetConnect",
      `Descreva o problema:\n\n\n---\nVersão do app: ${APP_VERSION}\nPlataforma: ${Platform.OS}`
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Ajuda e Suporte" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.menuTitle}>Perguntas frequentes</Text>
        <View style={styles.card}>
          {FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <View key={item.question}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable style={styles.row} onPress={() => toggle(index)}>
                  <Text style={styles.question}>{item.question}</Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#999"
                  />
                </Pressable>
                {isOpen && <Text style={styles.answer}>{item.answer}</Text>}
              </View>
            );
          })}
        </View>

        <Text style={styles.menuTitle}>Fale com a gente</Text>
        <View style={styles.card}>
          <Pressable style={styles.row} onPress={handleEmail}>
            <Ionicons name="mail-outline" size={22} color="#555" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowText}>Enviar e-mail</Text>
              <Text style={styles.rowDescription}>{SUPPORT_EMAIL}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={handleWhatsapp}>
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowText}>WhatsApp</Text>
              <Text style={styles.rowDescription}>{formatPhone(whatsappNumber)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={handleReport}>
            <Ionicons name="bug-outline" size={22} color="#555" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowText}>Reportar um problema</Text>
              <Text style={styles.rowDescription}>Algo não está funcionando como deveria</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>
        </View>

        <Text style={styles.menuTitle}>Informações</Text>
        <View style={styles.card}>
          <Pressable style={styles.row} onPress={() => navigation.navigate("PrivacyPolicy")}>
            <Ionicons name="document-text-outline" size={22} color="#555" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowText}>Política de privacidade</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={() => navigation.navigate("Termsofuse")}>
            <Ionicons name="reader-outline" size={22} color="#555" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowText}>Termos de uso</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>
        </View>

        <Text style={styles.version}>PetConnect v{APP_VERSION}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  rowTextBox: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  rowText: {
    fontSize: 16,
    color: "#333333",
  },
  rowDescription: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
    marginRight: 8,
  },
  answer: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 21,
    paddingBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
  },
});