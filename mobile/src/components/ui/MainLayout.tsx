import React from "react";
import { View, StyleSheet, ScrollView, Platform, Dimensions, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
  variant?: "form" | "content";
  scrollable?: boolean;
  showNavBar?: boolean;
}

export function MainLayout({
  children,
  variant = "content",
  scrollable = true,
  showNavBar = true,
}: MainLayoutProps) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { user } = useAuth();
  const screenWidth = Dimensions.get("window").width;
  const isDesktop = Platform.OS === "web" && screenWidth > 768;

  const unauthRoutes = ["Login", "EscolhaCadastro", "CadastroUsuario", "CadastroOng"];
  const isUnauthRoute = unauthRoutes.includes(route.name) || !user;

  const shouldShowNav = showNavBar && !isUnauthRoute;

  const isForm = variant === "form";

  const containerStyle = [
    styles.container,
    isForm ? styles.formContainer : styles.contentContainer,
  ];

  const content = scrollable ? (
    <ScrollView 
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
    >
      <View style={containerStyle}>
        {children}
      </View>
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, containerStyle]}>
      {children}
    </View>
  );

  const isOng = user?.type === "ong";
  const homeRoute = isOng ? "HomeOngs" : "HomeUsuario";
  const requestsRoute = isOng ? "SolicitacoesOngs" : "SolicitacoesUsuario";

  return (
    <View style={styles.wrapper}>
      {/* Desktop Top Header Navigation (Only when authenticated and on auth/dashboard routes) */}
      {shouldShowNav && isDesktop && (
        <View style={styles.desktopHeader}>
          <Text style={styles.brandTitle}>PetConnect</Text>
          <View style={styles.desktopNavLinks}>
            <Pressable onPress={() => navigation.navigate(homeRoute)} style={styles.navLink}>
              <Text style={styles.navLinkText}>Início</Text>
            </Pressable>
            {!isOng && (
              <Pressable onPress={() => navigation.navigate("Favoritos")} style={styles.navLink}>
                <Text style={styles.navLinkText}>Favoritos</Text>
              </Pressable>
            )}
            <Pressable onPress={() => navigation.navigate(requestsRoute)} style={styles.navLink}>
              <Text style={styles.navLinkText}>Solicitações</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Settings")} style={styles.navLink}>
              <Text style={styles.navLinkText}>Configurações</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.mainBody}>
        {content}
      </View>

      {/* Mobile Bottom Navigation Bar (Only when authenticated and on auth/dashboard routes) */}
      {shouldShowNav && !isDesktop && (
        <View style={styles.bottomNav}>
          <Pressable 
            onPress={() => navigation.navigate(homeRoute)} 
            style={styles.navItem}
          >
            <Ionicons name="home-outline" size={22} color="#059669" />
            <Text style={styles.navItemText}>Início</Text>
          </Pressable>

          {!isOng && (
            <Pressable 
              onPress={() => navigation.navigate("Favoritos")} 
              style={styles.navItem}
            >
              <Ionicons name="heart-outline" size={22} color="#059669" />
              <Text style={styles.navItemText}>Favoritos</Text>
            </Pressable>
          )}

          <Pressable 
            onPress={() => navigation.navigate(requestsRoute)} 
            style={styles.navItem}
          >
            <Ionicons name="document-text-outline" size={22} color="#059669" />
            <Text style={styles.navItemText}>Solicitações</Text>
          </Pressable>

          <Pressable 
            onPress={() => navigation.navigate("Settings")} 
            style={styles.navItem}
          >
            <Ionicons name="settings-outline" size={22} color="#059669" />
            <Text style={styles.navItemText}>Configurações</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  desktopHeader: {
    height: 64,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#059669",
  },
  desktopNavLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  navLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navLinkText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  mainBody: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 16,
  },
  container: {
    alignSelf: "center",
    width: "100%",
  },
  formContainer: {
    width: "90%",
    maxWidth: 480,
    minWidth: 320,
    marginHorizontal: "auto",
  },
  contentContainer: {
    width: "100%",
    maxWidth: 1080,
    marginHorizontal: "auto",
    paddingHorizontal: 16,
  },
  bottomNav: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navItemText: {
    fontSize: 12,
    color: "#059669",
    marginTop: 2,
    fontWeight: "500",
  },
});
