import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoginScreen } from "@/screens/LoginScreen";
import { EsqueciSenhaScreen } from "@/screens/EsqueciSenhaScreen";
import TelaCadastroUsuario from "@/screens/TelaCadastroUsuario";
import TelaCadastroOng from "@/screens/TelaCadastroOng";

import { TelaSolicitacoesOngs } from "@/screens/TelaSolicitacoesOngs";
import TelaSolicitacoesUsuario from "@/screens/TelaSolicitacoesUsuario";

import { TelaHomeUsuario } from "@/screens/TelaHomeUsuario";
import { TelaHomeOngs } from "@/screens/TelaHomeOngs";

import { SettingsScreen } from "@/screens/SettingsScreen";
import { PetDetailsScreen } from "@/screens/PetDetailsScreen";
import { TelaFavoritos } from "@/screens/TelaFavoritos";
import { TelaEditarPerfil } from "@/screens/TelaEditarPerfil";

import { PrivacySecurityScreen } from "@/screens/PrivacySecurityScreen";
import { PrivacyPolicyScreen } from "@/screens/Privacypolicy";
import { TermsofuseScreen } from "@/screens/Termsofuse";
import { HelpSupportScreen } from "@/screens/HelpSupportScreen";

import { AnimalRegistrationScreen } from "@/screens/AnimalRegistrationScreen";
import { ManageAnimalsScreen } from "@/screens/ManageAnimalsScreen";
import { EditAnimalScreen } from "@/screens/EditAnimalScreen";
import { SolicitarAdocaoScreen } from "@/screens/SolicitarAdocaoScreen";

import { getSession } from "@/services/auth";

import type { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const singleton = (id: string) => () => id;

export function AppNavigator() {
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList | null>(null);

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
      } catch (error) {
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
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F7F9FC" },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="EsqueciSenha" component={EsqueciSenhaScreen} />

          <Stack.Screen name="CadastroUsuario" component={TelaCadastroUsuario} />
          <Stack.Screen name="CadastroOng" component={TelaCadastroOng} />

          <Stack.Screen
            name="HomeUsuario"
            component={TelaHomeUsuario}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name="HomeOngs"
            component={TelaHomeOngs}
            getId={singleton("HomeOngs")}
          />

          <Stack.Screen
            name="SolicitacoesOngs"
            component={TelaSolicitacoesOngs}
            getId={singleton("SolicitacoesOngs")}
          />
          <Stack.Screen
            name="SolicitacoesUsuario"
            component={TelaSolicitacoesUsuario}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name="solicitaradocao"
            component={SolicitarAdocaoScreen}
          />

          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: "none" }}
          />
          <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
          <Stack.Screen
            name="Favoritos"
            component={TelaFavoritos}
            options={{ animation: "none" }}
          />
          <Stack.Screen name="EditarPerfil" component={TelaEditarPerfil} />

          <Stack.Screen
            name="Privacyandsecurity"
            component={PrivacySecurityScreen}
          />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="Termsofuse" component={TermsofuseScreen} />
          <Stack.Screen name="Helpandsupport" component={HelpSupportScreen} />

          <Stack.Screen
            name="manageanimals"
            component={ManageAnimalsScreen}
            getId={singleton("manageanimals")}
          />
          <Stack.Screen
            name="animalregistration"
            component={AnimalRegistrationScreen}
          />
          <Stack.Screen name="editanimal" component={EditAnimalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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