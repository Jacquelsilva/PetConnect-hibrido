import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { Header } from "@/components/ui/Header";
import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { getSession, saveSession } from "@/services/auth";
import { getDatabase } from "@/database/Database";
import { buscarUsuarioPorId, atualizarUsuario } from "@/database/UsuarioDAO";
import { atualizarOng } from "@/database/OngDAO";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "EditarPerfil">;

export function TelaEditarPerfil({ navigation }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [senha, setSenha] = useState("");
  const [userType, setUserType] = useState<"user" | "ong">("user");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getSession();
        if (!session || !session.user?.id) return;
        setUserId(Number(session.user.id));
        setUserType(session.user.type);

        const db = await getDatabase();
        if (session.user.type === "ong") {
          // fetch ong
          const ongs = await db.getAllAsync<any>("SELECT * FROM ongs WHERE id = ?", [session.user.id]);
          if (ongs && ongs.length > 0) {
            const ong = ongs[0];
            setNome(ong.nome || "");
            setEmail(ong.email || "");
            setDocumento(ong.cnpj || "");
            setTelefone(ong.telefone || "");
            setCep(ong.cep || "");
            setEstado(ong.estado || "");
            setCidade(ong.cidade || "");
            setEndereco(ong.endereco || "");
            setSenha(ong.senha || "");
          }
        } else {
          const user = await buscarUsuarioPorId(db, Number(session.user.id));
          if (user) {
            setNome(user.nome || "");
            setEmail(user.email || "");
            setDocumento(user.cpf || "");
            setCep(user.cep || "");
            setEstado(user.estado || "");
            setCidade(user.cidade || "");
            setEndereco(user.endereco || "");
            setSenha(user.senha || "");
          }
        }
      } catch (e) {
        console.error("Erro ao carregar perfil para edição:", e);
      }
    }
    loadData();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !email || !cep) {
      Alert.alert("Erro", "Preencha os campos obrigatórios.");
      return;
    }

    try {
      const db = await getDatabase();
      if (userType === "ong" && userId) {
        const success = await atualizarOng(db, {
          id: userId,
          nome,
          cnpj: documento,
          email,
          senha,
          cep,
          estado,
          cidade,
          endereco,
          telefone,
        });
        if (success) {
          await saveSession({
            token: "active",
            user: { id: String(userId), name: nome, email, type: "ong", document: documento }
          });
          Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        }
      } else if (userId) {
        const success = await atualizarUsuario(db, {
          id: userId,
          nome,
          cpf: documento,
          email,
          senha,
          cep,
          estado,
          cidade,
          endereco,
        });
        if (success) {
          await saveSession({
            token: "active",
            user: { id: String(userId), name: nome, email, type: "user", document: documento }
          });
          Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        }
      }
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      Alert.alert("Erro", "Ocorreu um erro ao salvar as alterações.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Editar Perfil" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.formCard}>
          <InputGroup
            label="Nome Completo"
            placeholder="Digite seu nome"
            value={nome}
            onChangeText={setNome}
          />
          <InputGroup
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputGroup
            label={userType === "ong" ? "CNPJ" : "CPF"}
            placeholder={userType === "ong" ? "00.000.000/0000-00" : "000.000.000-00"}
            value={documento}
            onChangeText={setDocumento}
            mask={userType === "ong" ? "cnpj" : "cpf"}
            keyboardType="numeric"
          />
          {userType === "ong" && (
            <InputGroup
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChangeText={setTelefone}
              mask="phone"
              keyboardType="phone-pad"
            />
          )}
          <InputGroup
            label="CEP"
            placeholder="00000-000"
            value={cep}
            onChangeText={setCep}
            mask="cep"
            keyboardType="numeric"
          />
          <InputGroup
            label="Estado"
            placeholder="UF"
            value={estado}
            onChangeText={setEstado}
          />
          <InputGroup
            label="Cidade"
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
          <InputGroup
            label="Endereço"
            placeholder="Rua, número, bairro"
            value={endereco}
            onChangeText={setEndereco}
          />

          <Button title="Salvar Alterações" onPress={handleSalvar} style={styles.button} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scroll: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  formCard: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#0F766E",
  },
});
