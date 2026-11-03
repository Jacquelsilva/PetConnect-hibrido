import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EscolhaCadastroScreen from "../screens/TelaEscolhaCadastro";
import CadastroUsuarioScreen from "../screens/TelaCadastroUsuario";
import CadastroOngScreen from "../screens/TelaCadastroOng;
import CadastroAnimalScreen from "../screens/TelaCadastroAnimal";

import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="EscolhaCadastro"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="EscolhaCadastro"
          component={EscolhaCadastroScreen}
        />

        <Stack.Screen
          name="CadastroUsuario"
          component={CadastroUsuarioScreen}
        />

        <Stack.Screen
          name="CadastroOng"
          component={CadastroOngScreen}
        />
        <Stack.Screen
          name="CadastroAnimal"
         component={CadastroAnimalScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
