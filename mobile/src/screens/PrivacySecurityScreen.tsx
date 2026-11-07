import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Switch,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { clearSession, changePassword, deleteAccount } from "@/services/auth";
import type { PrivacySecurityScreenProps } from "@/types/navigation";

function notify(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function confirmAction(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}

export function PrivacySecurityScreen({ navigation }: PrivacySecurityScreenProps) {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setShowPasswordForm(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notify("Atenção", "Preencha todos os campos.");
      return;
    }
    if (newPassword.length < 6) {
      notify("Atenção", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("Atenção", "A confirmação não é igual à nova senha.");
      return;
    }
    if (newPassword === currentPassword) {
      notify("Atenção", "A nova senha deve ser diferente da atual.");
      return;
    }

    try {
      setSavingPassword(true);
      await changePassword(currentPassword, newPassword);
      resetPasswordForm();
      notify("Sucesso", "Senha alterada com sucesso.");
    } catch (e: any) {
      notify("Erro", e?.message || "Não foi possível alterar a senha.");
    } finally {
      setSavingPassword(false);
    }
  };

  const finishSession = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch (e) {
        console.log(e);
      }
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleDeleteAccount = () => {
    confirmAction(
      "Excluir conta",
      "Esta ação é permanente e todos os seus dados serão removidos. Deseja continuar?",
      "Excluir",
      async () => {
        try {
          setDeleting(true);
          await deleteAccount();
          await finishSession();
        } catch (e: any) {
          notify("Erro", e?.message || "Não foi possível excluir a conta.");
        } finally {
          setDeleting(false);
        }
      }
    );
  };

  const handleLogoutAll = () => {
    confirmAction(
      "Sair da conta",
      "Deseja encerrar a sessão neste dispositivo?",
      "Sair",
      finishSession
    );
  };

  const renderSwitchRow = (
    icon: keyof typeof Ionicons.glyphMap,
    label: string,
    description: string,
    value: boolean,
    onChange: (v: boolean) => void
  ) => (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color="#555" />
      <View style={styles.rowTextBox}>
        <Text style={styles.rowText}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#D0D0D0", true: "#A5D6A7" }}
        thumbColor={value ? "#4CAF50" : "#F4F4F4"}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Privacidade e Segurança" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.menuTitle}>Privacidade</Text>
        <View style={styles.card}>
          {renderSwitchRow(
            "eye-outline",
            "Perfil público",
            "Outros usuários podem ver seu perfil",
            profileVisible,
            setProfileVisible
          )}
          <View style={styles.divider} />
          {renderSwitchRow(
            "call-outline",
            "Mostrar telefone",
            "Exibir seu telefone nas solicitações",
            showPhone,
            setShowPhone
          )}
          <View style={styles.divider} />
          {renderSwitchRow(
            "mail-outline",
            "Mostrar e-mail",
            "Exibir seu e-mail no perfil",
            showEmail,
            setShowEmail
          )}
          <View style={styles.divider} />
          {renderSwitchRow(
            "location-outline",
            "Compartilhar localização",
            "Usar sua região para sugerir pets próximos",
            shareLocation,
            setShareLocation
          )}
        </View>

        <Text style={styles.menuTitle}>Segurança</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() => setShowPasswordForm((prev) => !prev)}
          >
            <Ionicons name="lock-closed-outline" size={22} color="#555" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowText}>Alterar senha</Text>
              <Text style={styles.rowDescription}>Atualize sua senha de acesso</Text>
            </View>
            <Ionicons
              name={showPasswordForm ? "chevron-up" : "chevron-down"}
              size={20}
              color="#999"
            />
          </Pressable>

          {showPasswordForm && (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Senha atual"
                placeholderTextColor="#999"
                secureTextEntry={!showPasswords}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Nova senha"
                placeholderTextColor="#999"
                secureTextEntry={!showPasswords}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmar nova senha"
                placeholderTextColor="#999"
                secureTextEntry={!showPasswords}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <Pressable
                style={styles.showPasswordRow}
                onPress={() => setShowPasswords((prev) => !prev)}
              >
                <Ionicons
                  name={showPasswords ? "checkbox" : "square-outline"}
                  size={20}
                  color="#4CAF50"
                />
                <Text style={styles.showPasswordText}>Mostrar senhas</Text>
              </Pressable>
              <Button
                title={savingPassword ? "Salvando..." : "Salvar nova senha"}
                onPress={handleChangePassword}
                disabled={savingPassword}
              />
              <Pressable style={styles.cancelLink} onPress={resetPasswordForm}>
                <Text style={styles.cancelLinkText}>Cancelar</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.divider} />
          <Pressable style={styles.row} onPress={handleLogoutAll}>
            <Ionicons name="log-out-outline" size={22} color="#555" />
            <View style={styles.rowTextBox}>
              <Text style={styles.rowText}>Encerrar sessão</Text>
              <Text style={styles.rowDescription}>Sair deste dispositivo</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>
        </View>

        <Text style={styles.menuTitle}>Dados e conta</Text>
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

        <View style={styles.dangerBox}>
          <Text style={styles.dangerTitle}>Zona de perigo</Text>
          <Text style={styles.dangerText}>
            Ao excluir sua conta, seus dados, pets cadastrados e solicitações serão removidos
            permanentemente.
          </Text>
          <Button
            title={deleting ? "Excluindo..." : "Excluir minha conta"}
            variant="outline"
            onPress={handleDeleteAccount}
            disabled={deleting}
            style={styles.deleteButton}
          />
        </View>
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
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  form: {
    paddingBottom: 16,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333333",
    backgroundColor: "#FAFAFA",
  },
  showPasswordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  showPasswordText: {
    fontSize: 14,
    color: "#555555",
  },
  cancelLink: {
    alignItems: "center",
    paddingVertical: 6,
  },
  cancelLinkText: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  dangerBox: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#F5C6C6",
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
  },
  dangerText: {
    fontSize: 13,
    color: "#7F5A5A",
  },
  deleteButton: {
    borderColor: "#D32F2F",
  },
});