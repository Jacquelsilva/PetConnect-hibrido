import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { TelaEscolhaCadastro } from "@/screens/TelaEscolhaCadastro";
import { TelaCadastroUsuario } from "@/screens/TelaCadastroUsuario";
import { TelaCadastroOng } from "@/screens/TelaCadastroOng";
// import { TelaCadastroAnimal } from "@/screens/TelaCadastroAnimal";

import type { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="EscolhaCadastro"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="EscolhaCadastro" component={TelaEscolhaCadastro} />
        <Stack.Screen name="CadastroUsuario" component={TelaCadastroUsuario} />
        <Stack.Screen name="CadastroOng" component={TelaCadastroOng} />
        {/* <Stack.Screen name="CadastroAnimal" component={TelaCadastroAnimal} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}