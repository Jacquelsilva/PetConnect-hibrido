import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@/screens/LoginScreen";
import { TelaEscolhaCadastro } from "@/screens/TelaEscolhaCadastro";
import TelaCadastroUsuario from "@/screens/TelaCadastroUsuario";
import TelaCadastroOng from "@/screens/TelaCadastroOng";
import { TelaSolicitacoesOngs } from "@/screens/TelaSolicitacoesOngs";
import { TelaSolicitacoesUsuario } from "@/screens/TelaSolicitacoesUsuario";
import { TelaHomeUsuario } from "@/screens/TelaHomeUsuario";
import { TelaHomeOngs } from "@/screens/TelaHomeOngs";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { PetDetailsScreen } from "@/screens/PetDetailsScreen";
import { TelaFavoritos } from "@/screens/TelaFavoritos";
import { TelaEditarPerfil } from "@/screens/TelaEditarPerfil";
import { getSession } from "@/services/auth";

import type { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    async function checkAuthSession() {
      try {
        const session = await getSession();
        if (session && session.token) {
          if (session.user.type === "ong") {
            setInitialRoute("HomeOngs");
          } else {
            setInitialRoute("HomeUsuario");
          }
        } else {
          setInitialRoute("Login");
        }
      } catch (e) {
        setInitialRoute("Login");
      } finally {
        setLoadingSession(false);
      }
    }
    checkAuthSession();
  }, []);

  if (loadingSession || !initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        {/* Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        {/* Cadastro */}
        <Stack.Screen
          name="EscolhaCadastro"
          component={TelaEscolhaCadastro}
        />

        <Stack.Screen
          name="CadastroUsuario"
          component={TelaCadastroUsuario}
        />

        <Stack.Screen
          name="CadastroOng"
          component={TelaCadastroOng}
        />

        {/* Home */}
        <Stack.Screen
          name="HomeUsuario"
          component={TelaHomeUsuario}
        />

        <Stack.Screen
          name="HomeOngs"
          component={TelaHomeOngs}
        />

        {/* Solicitações */}
        <Stack.Screen
          name="SolicitacoesUsuario"
          component={TelaSolicitacoesUsuario}
        />

        <Stack.Screen
          name="SolicitacoesOngs"
          component={TelaSolicitacoesOngs}
        />

        {/* Settings, PetDetails, Favoritos & EditarPerfil */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />

        <Stack.Screen
          name="PetDetails"
          component={PetDetailsScreen}
        />

        <Stack.Screen
          name="Favoritos"
          component={TelaFavoritos}
        />

        <Stack.Screen
          name="EditarPerfil"
          component={TelaEditarPerfil}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
