import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { HeaderLogin } from "@/components/ui/HeaderLogin";
import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { OrDivider } from "@/components/ui/OrDivider";
import { loginUser } from "@/services/auth";
import type { LoginScreenProps } from "@/types/navigation";

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [documentError, setDocumentError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    const cleanDoc = document.replace(/\D/g, "");

    if (!cleanDoc) {
      setDocumentError("CPF ou CNPJ é obrigatório.");
      isValid = false;
    } else if (cleanDoc.length !== 11 && cleanDoc.length !== 14) {
      setDocumentError("CPF (11 dígitos) ou CNPJ (14 dígitos) inválido.");
      isValid = false;
    } else {
      setDocumentError("");
    }

    if (!password) {
      setPasswordError("Senha é obrigatória.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await loginUser({ document, password });
      Alert.alert("Sucesso", `Bem-vindo(a), ${response.user.name}!`);
      
      if (response.user.type === "ong") {
        navigation.navigate("HomeOngs");
      } else {
        navigation.navigate("HomeUsuario");
      }
    } catch (error: any) {
      Alert.alert("Erro ao entrar", error.message || "Verifique suas credenciais e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <HeaderLogin
            title="Bem-vindo de volta!"
            subtitle="Faça login para continuar encontrando seu novo melhor amigo."
          />

          <View style={styles.formContainer}>
            <InputGroup
              label="CPF ou CNPJ"
              placeholder="Digite seu CPF ou CNPJ"
              keyboardType="numeric"
              value={document}
              onChangeText={setDocument}
              errorMessage={documentError}
              mask="cpf_cnpj"
              maxLength={18}
            />

            <InputGroup
              label="Senha"
              placeholder="Digite sua senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              errorMessage={passwordError}
            />

            <Button
              title={loading ? "Entrando..." : "Entrar"}
              variant="primary"
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            />

            <OrDivider text="ou" />

            <Button
              title="Cadastrar como Usuário"
              variant="outline"
              onPress={() => navigation.navigate("CadastroUsuario")}
              style={styles.actionButton}
            />

            <Button
              title="Cadastrar como ONG"
              variant="secondary"
              onPress={() => navigation.navigate("CadastroOng")}
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: "#EFEFEF",
  },
  formContainer: {
    width: "100%",
  },
  loginButton: {
    marginTop: 8,
  },
  actionButton: {
    marginTop: 12,
  },
});
