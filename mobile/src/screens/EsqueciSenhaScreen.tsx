import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderLogin } from "@/components/ui/HeaderLogin";
import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { MainLayout } from "@/components/ui/MainLayout";
import type { EsqueciSenhaScreenProps } from "@/types/navigation";
import { redefinirSenha } from "@/services/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EsqueciSenhaScreen({
  navigation,
  route,
}: EsqueciSenhaScreenProps) {
  const isOng = route.params?.tipo === "ong";
  const docLabel = isOng ? "CNPJ" : "CPF";
  const tamanhoDoc = isOng ? 14 : 11;

  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const [documentError, setDocumentError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  const [confirmarError, setConfirmarError] = useState("");

  const validateForm = () => {
    let isValid = true;
    const cleanDoc = document.replace(/\D/g, "");

    if (!cleanDoc) {
      setDocumentError(`${docLabel} é obrigatório.`);
      isValid = false;
    } else if (cleanDoc.length !== tamanhoDoc) {
      setDocumentError(`${docLabel} inválido (${tamanhoDoc} dígitos).`);
      isValid = false;
    } else {
      setDocumentError("");
    }

    if (!email.trim()) {
      setEmailError("E-mail é obrigatório.");
      isValid = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Digite um e-mail válido.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!novaSenha) {
      setSenhaError("Nova senha é obrigatória.");
      isValid = false;
    } else if (novaSenha.length < 6) {
      setSenhaError("A senha deve ter pelo menos 6 caracteres.");
      isValid = false;
    } else {
      setSenhaError("");
    }

    if (!confirmarSenha) {
      setConfirmarError("Confirme a nova senha.");
      isValid = false;
    } else if (confirmarSenha !== novaSenha) {
      setConfirmarError("As senhas não coincidem.");
      isValid = false;
    } else {
      setConfirmarError("");
    }

    return isValid;
  };

  const handleRedefinir = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await redefinirSenha({
        tipo: isOng ? "ong" : "adotante",
        document,
        email,
        novaSenha,
      });

      Alert.alert(
        "Senha redefinida",
        "Sua senha foi alterada com sucesso. Faça login com a nova senha.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert(
        "Não foi possível redefinir",
        error.message || "Tente novamente em instantes."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout variant="form" showNavBar={false}>
      <View style={styles.card}>
        <HeaderLogin
          title="Esqueceu a senha?"
          subtitle="Confirme seus dados para criar uma nova senha."
        />

        <View style={styles.formContainer}>
          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#047857"
            />
            <Text style={styles.noticeText}>
              Informe o {docLabel} e o e-mail cadastrados na sua conta
              {isOng ? " de ONG" : ""}.
            </Text>
          </View>

          <InputGroup
            label={docLabel}
            placeholder={`Digite seu ${docLabel}`}
            keyboardType="numeric"
            value={document}
            onChangeText={setDocument}
            errorMessage={documentError}
            mask="cpf_cnpj"
            maxLength={18}
          />

          <InputGroup
            label="E-mail cadastrado"
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            errorMessage={emailError}
          />

          <InputGroup
            label="Nova senha"
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
            errorMessage={senhaError}
          />

          <InputGroup
            label="Confirmar nova senha"
            placeholder="Repita a nova senha"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            errorMessage={confirmarError}
          />

          <Button
            title={loading ? "Salvando..." : "Redefinir senha"}
            variant="primary"
            onPress={handleRedefinir}
            disabled={loading}
            style={styles.primaryButton}
          />

          <Button
            title="Voltar para o login"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 16,
  },
  formContainer: {
    marginTop: 20,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E6F4EA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#047857",
  },
  primaryButton: {
    marginTop: 16,
  },
  secondaryButton: {
    marginTop: 12,
  },
});