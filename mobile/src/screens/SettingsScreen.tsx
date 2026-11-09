import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Platform,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getProfilePhoto } from "@/services/profilePhoto";
import type { SettingsScreenProps } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [foto, setFoto] = useState<string | null>(null);

  const ehOng = user?.type === "ong";

  const abas = ehOng
    ? [
        {
          titulo: "Início",
          icone: "home-outline" as const,
          onPress: () => navigation.navigate("HomeOngs"),
        },
        {
          titulo: "Solicitações",
          icone: "document-text-outline" as const,
          onPress: () => navigation.navigate("SolicitacoesOngs"),
        },
        {
          titulo: "Configurações",
          icone: "settings" as const, // preenchido: é a tela atual
          onPress: () => {},
        },
      ]
    : [
        {
          titulo: "Favoritos",
          icone: "heart-outline" as const,
          onPress: () => navigation.navigate("Favoritos"),
        },
        {
          titulo: "Solicitações",
          icone: "document-text-outline" as const,
          onPress: () => navigation.navigate("SolicitacoesUsuario"),
        },
        {
          titulo: "Configurações",
          icone: "settings" as const, // preenchido: é a tela atual
          onPress: () => {},
        },
      ];

  // Recarrega a foto sempre que a tela ganha foco (ex.: ao voltar da edição)
  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        if (!user?.id) {
          if (active) setFoto(null);
          return;
        }
        const uri = await getProfilePhoto(
          user.type === "ong" ? "ong" : "user",
          user.id
        );
        if (active) setFoto(uri);
      })();

      return () => {
        active = false;
      };
    }, [user?.id, user?.type])
  );

  const performLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("Erro ao limpar sessão:", e);
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <View style={styles.avatarContainer}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="#4CAF50" />
            )}
          </View>
          <Text style={styles.name}>{user?.name || "Usuário PetConnect"}</Text>
          <Text style={styles.email}>
            {user?.email || user?.document || "Conectado"}
          </Text>
          <Text style={styles.role}>
            Tipo: {ehOng ? "ONG" : "Tutor / Adotante"}
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
                trackColor={{ false: "#D1D5DB", true: "#A5D6A7" }}
                thumbColor={notificationsEnabled ? "#4CAF50" : "#FFFFFF"}
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

      {/* Barra de navegação inferior */}
      <View style={styles.barra}>
        {abas.map((aba) => (
          <TouchableOpacity
            key={aba.titulo}
            style={styles.aba}
            onPress={aba.onPress}
          >
            <Ionicons name={aba.icone} size={24} color="#0F766E" />
            <Text style={styles.abaTexto}>{aba.titulo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scroll: {
    flex: 1,
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
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  barra: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  aba: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  abaTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F766E",
  },
});