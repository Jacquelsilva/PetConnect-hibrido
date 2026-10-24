import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ConfigurationScreen from "../screens/ConfigurationScreen";
import AlterarSenhaScreen from "../screens/AlterarSenhaScreen";
import TermosDeUsoScreen from "../screens/TermosDeUsoScreen";
import PoliticaDePrivacidadeScreen from "../screens/PoliticaDePrivacidadeScreen";
import PetDetailScreen from "../screens/PetDetailScreen";
import { RootStackParamList, TabParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const VERDE = "#2E8B34";

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: VERDE,
        tabBarInactiveTintColor: "#999",
        tabBarIcon: ({ focused, color, size }) => {
          const nomes: Record<string, [string, string]> = {
            Inicio: ["home", "home-outline"],
            Configuracoes: ["settings", "settings-outline"],
          };
          const par = nomes[route.name] ?? ["ellipse", "ellipse-outline"];
          return (
            <Ionicons
              name={(focused ? par[0] : par[1]) as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen
        name="Configuracoes"
        component={ConfigurationScreen}
        options={{ title: "Config." }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
        <Stack.Screen
          name="AlterarSenha"
          component={AlterarSenhaScreen}
          options={{ headerShown: true, title: "Alterar Senha" }}
        />
        <Stack.Screen
          name="TermosDeUso"
          component={TermosDeUsoScreen}
          options={{ headerShown: true, title: "Termos de Uso" }}
        />
        <Stack.Screen
          name="PoliticaDePrivacidade"
          component={PoliticaDePrivacidadeScreen}
          options={{ headerShown: true, title: "Política de Privacidade" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}