import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  EscolhaCadastro: undefined;
  CadastroUsuario: undefined;
  CadastroOng: undefined;
};

// Tipos das propriedades de cada tela de cadastro do PetConnect
export type EscolhaCadastroProps = NativeStackScreenProps<
  RootStackParamList,
  "EscolhaCadastro"
>;

export type CadastroUsuarioProps = NativeStackScreenProps<
  RootStackParamList,
  "CadastroUsuario"
>;

export type CadastroOngProps = NativeStackScreenProps<
  RootStackParamList,
  "CadastroOng"
>;