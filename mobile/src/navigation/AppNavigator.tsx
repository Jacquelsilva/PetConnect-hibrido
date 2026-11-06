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

import type { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
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

      </Stack.Navigator>
    </NavigationContainer>
  );
}
