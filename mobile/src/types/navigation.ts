import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  EscolhaCadastro: undefined;
  CadastroUsuario: undefined;
  CadastroOng: undefined;
  HomeUsuario: undefined;
  HomeOngs: undefined;
  SolicitacoesUsuario: undefined;
  SolicitacoesOngs: undefined;
};

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
