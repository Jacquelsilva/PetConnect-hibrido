import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderLogin } from "@/components/ui/HeaderLogin";
import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { OrDivider } from "@/components/ui/OrDivider";
import { MainLayout } from "@/components/ui/MainLayout";
import { loginUser, loginWithGoogle } from "@/services/auth";
import type { LoginScreenProps } from "@/types/navigation";

type TipoConta = "adotante" | "ong";

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [tipoConta, setTipoConta] = useState<TipoConta>("adotante");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [documentError, setDocumentError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isOng = tipoConta === "ong";
  const docLabel = isOng ? "CNPJ" : "CPF";

  const handleSelecionarTipo = (tipo: TipoConta) => {
    if (tipo === tipoConta) return;
    setTipoConta(tipo);
    // Limpa o documento e os erros, pois o formato muda (CPF x CNPJ)
    setDocument("");
    setDocumentError("");
    setPasswordError("");
  };

  const validateForm = () => {
    let isValid = true;
    const cleanDoc = document.replace(/\D/g, "");
    const tamanhoEsperado = isOng ? 14 : 11;

    if (!cleanDoc) {
      setDocumentError(`${docLabel} é obrigatório.`);
      isValid = false;
    } else if (cleanDoc.length !== tamanhoEsperado) {
      setDocumentError(
        `${docLabel} inválido (${tamanhoEsperado} dígitos).`
      );
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

      // Garante que a conta é do tipo selecionado na tela
      const contaEhOng = response.user.type === "ong";
      if (contaEhOng !== isOng) {
        Alert.alert(
          "Tipo de conta incorreto",
          isOng
            ? "Este CNPJ não pertence a uma ONG. Selecione 'Sou adotante' para entrar."
            : "Este CPF pertence a uma ONG. Selecione 'Sou ONG' para entrar."
        );
        return;
      }

      Alert.alert("Sucesso", `Bem-vindo(a), ${response.user.name}!`);

      if (contaEhOng) {
        navigation.navigate("HomeOngs");
      } else {
        navigation.navigate("HomeUsuario");
      }
    } catch (error: any) {
      Alert.alert(
        "Erro ao entrar",
        error.message || "Verifique suas credenciais e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const response = await loginWithGoogle();
      Alert.alert(
        "Sucesso",
        `Bem-vindo(a) via Google, ${response.user.name}!`
      );
      navigation.navigate("HomeUsuario");
    } catch (error: any) {
      Alert.alert(
        "Erro no Google Login",
        error.message || "Não foi possível autenticar com o Google."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <MainLayout variant="form" showNavBar={false}>
      <View style={styles.card}>
        <HeaderLogin
          title="Bem-vindo de volta!"
          subtitle="Faça login para continuar encontrando seu novo melhor amigo."
        />

        <View style={styles.formContainer}>
          {/* Seletor de tipo de conta */}
          <Text style={styles.selectorLabel}>Como você deseja entrar?</Text>
          <View style={styles.selector}>
            <Pressable
              onPress={() => handleSelecionarTipo("adotante")}
              style={[
                styles.selectorOption,
                !isOng && styles.selectorOptionActive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: !isOng }}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={!isOng ? "#FFFFFF" : "#047857"}
              />
              <Text
                style={[
                  styles.selectorText,
                  !isOng && styles.selectorTextActive,
                ]}
              >
                Sou adotante
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleSelecionarTipo("ong")}
              style={[
                styles.selectorOption,
                isOng && styles.selectorOptionActive,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isOng }}
            >
              <Ionicons
                name="business-outline"
                size={18}
                color={isOng ? "#FFFFFF" : "#047857"}
              />
              <Text
                style={[
                  styles.selectorText,
                  isOng && styles.selectorTextActive,
                ]}
              >
                Sou ONG
              </Text>
            </Pressable>
          </View>

          {/* Login com Google: somente para adotantes.
              O bloco continua montado (invisível) para ocupar o mesmo espaço
              e a tela não mudar de tamanho ao alternar entre adotante e ONG. */}
          <View style={styles.googleArea}>
            <View
              style={isOng ? styles.googleHidden : undefined}
              pointerEvents={isOng ? "none" : "auto"}
              accessibilityElementsHidden={isOng}
              importantForAccessibility={isOng ? "no-hide-descendants" : "auto"}
            >
              <Button
                title={
                  googleLoading ? "Conectando..." : "Continuar com o Google"
                }
                variant="google"
                icon={<Ionicons name="logo-google" size={20} color="#DB4437" />}
                onPress={handleGoogleLogin}
                disabled={googleLoading || isOng}
                style={styles.googleButton}
              />

              <OrDivider text="ou" />
            </View>

            {isOng && (
              <View style={styles.ongNotice} pointerEvents="none">
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#047857"
                />
                <Text style={styles.ongNoticeText}>
                  ONGs entram somente com CNPJ e senha.
                </Text>
              </View>
            )}
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
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            errorMessage={passwordError}
          />

          <Pressable
            onPress={() =>
              navigation.navigate("EsqueciSenha", { tipo: tipoConta })
            }
            style={styles.forgotLink}
            hitSlop={8}
            accessibilityRole="link"
            accessibilityLabel="Esqueci minha senha"
          >
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </Pressable>

          <Button
            title={loading ? "Entrando..." : `Entrar com ${docLabel}`}
            variant="primary"
            onPress={handleLogin}
            disabled={loading}
            style={styles.loginButton}
          />

          <OrDivider text="ou" />

          {isOng ? (
            <Button
              title="Cadastrar como ONG"
              variant="outline"
              onPress={() => navigation.navigate("CadastroOng")}
              style={styles.actionButton}
            />
          ) : (
            <Button
              title="Cadastrar como Usuário"
              variant="outline"
              onPress={() => navigation.navigate("CadastroUsuario")}
              style={styles.actionButton}
            />
          )}
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
  selectorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  selector: {
    flexDirection: "row",
    backgroundColor: "#E6F4EA",
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 20,
  },
  selectorOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 9,
  },
  selectorOptionActive: {
    backgroundColor: "#047857",
  },
  selectorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#047857",
  },
  selectorTextActive: {
    color: "#FFFFFF",
  },
  googleArea: {
    position: "relative",
  },
  googleHidden: {
    opacity: 0,
  },
  ongNotice: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#E6F4EA",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  ongNoticeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#047857",
    flexShrink: 1,
  },
  googleButton: {
    marginBottom: 16,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#047857",
  },
  loginButton: {
    marginTop: 12,
    marginBottom: 16,
  },
  actionButton: {
    marginTop: 12,
  },
});