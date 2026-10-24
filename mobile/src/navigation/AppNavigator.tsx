import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ConfigurationScreen from "../screens/ConfigurationScreen";
import AlterarSenhaScreen from "../screens/AlterarSenhaScreen";
import TermosDeUsoScreen from "../screens/TermosDeUsoScreen";
import PoliticaDePrivacidadeScreen from "../screens/PoliticaDePrivacidadeScreen";
import PetDetailScreen from "../screens/PetDetailScreen";
import { RootStackParamList, TabParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {/* Descomente quando essas telas existirem:
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Pedidos" component={OrdersScreen} />
      */}
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

        {/* Detalhes do pet (recebe { petId }) */}
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />

        {/* Telas abertas a partir das Configurações */}
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