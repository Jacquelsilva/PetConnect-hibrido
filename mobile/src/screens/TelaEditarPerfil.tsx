import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { Header } from "@/components/ui/Header";
import { InputGroup } from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { getSession, saveSession } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import { getDatabase } from "@/database/Database";
import { buscarUsuarioPorId, atualizarUsuario } from "@/database/UsuarioDAO";
import { atualizarOng } from "@/database/OngDAO";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "EditarPerfil">;

// Alert.alert não funciona na web, então usamos window.alert nesse caso
function mostrarAviso(titulo: string, mensagem: string, aoFechar?: () => void) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(`${titulo}\n\n${mensagem}`);
    }
    aoFechar?.();
  } else {
    Alert.alert(
      titulo,
      mensagem,
      aoFechar ? [{ text: "OK", onPress: aoFechar }] : undefined
    );
  }
}

export function TelaEditarPerfil({ navigation }: Props) {
  const { updateUser } = useAuth();
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
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const session = await getSession();
        console.log("SESSÃO NA EDIÇÃO:", JSON.stringify(session));

        if (!session || !session.user?.id) {
          console.error("EDIÇÃO: sessão sem usuário/ID.");
          return;
        }

        const id = Number(session.user.id);
        setUserId(id);
        setUserType(session.user.type);

        const db = await getDatabase();

        if (session.user.type === "ong") {
          const ongs = await db.getAllAsync<any>(
            "SELECT * FROM ongs WHERE id = ?",
            [id]
          );

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
          } else {
            console.error("EDIÇÃO: ONG não encontrada, id:", id);
          }
        } else {
          const user = await buscarUsuarioPorId(db, id);

          if (user) {
            setNome(user.nome || "");
            setEmail(user.email || "");
            setDocumento(user.cpf || "");
            setCep(user.cep || "");
            setEstado(user.estado || "");
            setCidade(user.cidade || "");
            setEndereco(user.endereco || "");
            setSenha(user.senha || "");
          } else {
            console.error("EDIÇÃO: usuário não encontrado, id:", id);
          }
        }
      } catch (e) {
        console.error("Erro ao carregar perfil para edição:", e);
      }
    }

    loadData();
  }, []);

  const handleSalvar = async () => {
    if (salvando) return;

    console.log("CLICOU EM SALVAR");
    console.log("userId:", userId, "| userType:", userType);

    if (!nome.trim() || !email.trim() || !cep.trim()) {
      mostrarAviso("Erro", "Preencha os campos obrigatórios (nome, e-mail e CEP).");
      return;
    }

    if (userId === null || Number.isNaN(userId)) {
      console.error("ERRO: userId inválido, não é possível salvar.");
      mostrarAviso(
        "Erro",
        "Não foi possível identificar o usuário. Faça login novamente."
      );
      return;
    }

    setSalvando(true);

    try {
      const db = await getDatabase();
      let success = false;

      if (userType === "ong") {
        success = await atualizarOng(db, {
          id: userId,
          nome: nome.trim(),
          cnpj: documento,
          email: email.trim(),
          senha,
          cep,
          estado,
          cidade,
          endereco,
          telefone,
        });
      } else {
        success = await atualizarUsuario(db, {
          id: userId,
          nome: nome.trim(),
          cpf: documento,
          email: email.trim(),
          senha,
          cep,
          estado,
          cidade,
          endereco,
        });
      }

      console.log("RESULTADO DO UPDATE:", success);

      if (success) {
        await saveSession({
          token: "active",
          user: {
            id: String(userId),
            name: nome.trim(),
            email: email.trim(),
            type: userType,
            document: documento,
          },
        });

        updateUser({
          name: nome.trim(),
          email: email.trim(),
          document: documento,
        });

        mostrarAviso("Sucesso", "Perfil atualizado com sucesso!", () =>
          navigation.goBack()
        );
      } else {
        mostrarAviso(
          "Erro",
          "Não foi possível atualizar o perfil. O e-mail pode já estar em uso por outra conta."
        );
      }
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      mostrarAviso("Erro", "Ocorreu um erro ao salvar as alterações.");
    } finally {
      setSalvando(false);
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

          <Button
            title={salvando ? "Salvando..." : "Salvar Alterações"}
            onPress={handleSalvar}
            style={styles.button}
          />
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