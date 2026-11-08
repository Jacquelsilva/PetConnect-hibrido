import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Platform,
  Switch,
} from "react-native";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import type { SettingsScreenProps } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const performLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("Erro ao limpar sessão:", e);
    }

    if (Platform.OS === "web" && typeof window !== "undefined") {
      try {
        window.localStorage.clear();
        window.sessionStorage.clear();
      } catch (e) {
        console.log("Erro ao limpar storage da web:", e);
      }
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Deseja realmente sair da sua conta?");
      if (confirmed) {
        performLogout();
      }
      return;
    }

    Alert.alert("Sair da Conta", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: performLogout },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Configurações" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.name}>{user?.name || "Usuário PetConnect"}</Text>
          <Text style={styles.email}>
            {user?.email || user?.document || "Conectado"}
          </Text>
          <Text style={styles.role}>
            Tipo: {user?.type === "ong" ? "ONG" : "Tutor / Adotante"}
          </Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Preferências da Conta</Text>
          <View style={styles.card}>
            <Pressable style={styles.row} onPress={() => navigation.navigate("EditarPerfil")}>
              <Ionicons name="person-outline" size={22} color="#555" />
              <Text style={styles.rowText}>Editar Perfil</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Ionicons name="notifications-outline" size={22} color="#555" />
              <Text style={styles.rowText}>Notificações</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#D1D5DB", color: "#4CAF50" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.divider} />
            <Pressable style={styles.row} onPress={() => navigation.navigate("Privacyandsecurity")}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#555" />
              <Text style={styles.rowText}>Privacidade e Segurança</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.row} onPress={() => navigation.navigate("Helpandsupport")}>
              <Ionicons name="help-circle-outline" size={22} color="#555" />
              <Text style={styles.rowText}>Ajuda e Suporte</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </Pressable>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Sair da Conta"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
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
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  role: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 58,
  },
  logoutContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoutButton: {
    width: "100%",
    borderColor: "#E53935",
  },
});
