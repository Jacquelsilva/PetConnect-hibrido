import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type TabParamList = {
  Inicio: undefined;
  Favoritos: undefined;
  Pedidos: undefined;
  Configuracoes: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  AlterarSenha: undefined;
  TermosDeUso: undefined;
  PoliticaDePrivacidade: undefined;
  PetDetail: { petId: string };
};

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;
export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;
export type PetDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PetDetail"
>;