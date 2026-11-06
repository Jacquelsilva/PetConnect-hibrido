import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  EscolhaCadastro: undefined;
  CadastroUsuario: undefined;
  CadastroOng: undefined;
  HomeUsuario: undefined;
  HomeOngs: undefined;
  SolicitacoesUsuario: undefined;
  SolicitacoesOngs: undefined;
  Settings: undefined;
  PetDetails: { pet?: any } | undefined;
  Favoritos: undefined;
  EditarPerfil: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

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

export type HomeUsuarioProps = NativeStackScreenProps<
  RootStackParamList,
  "HomeUsuario"
>;

export type HomeOngsProps = NativeStackScreenProps<
  RootStackParamList,
  "HomeOngs"
>;

export type SolicitacoesUsuarioProps = NativeStackScreenProps<
  RootStackParamList,
  "SolicitacoesUsuario"
>;

export type SolicitacoesOngsProps = NativeStackScreenProps<
  RootStackParamList,
  "SolicitacoesOngs"
>;

export type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

export type PetDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PetDetails"
>;

export type FavoritosScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Favoritos"
>;

export type EditarPerfilScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EditarPerfil"
>;
