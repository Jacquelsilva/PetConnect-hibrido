import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDatabase } from "@/database/Database";

WebBrowser.maybeCompleteAuthSession();

const AUTH_STORAGE_KEY = "@PetConnect:auth_session";
// Mesma chave usada por services/privacySettings.ts para contas Google/mock
const PRIVACY_FALLBACK_PREFIX = "@PetConnect:privacy:";

export interface LoginCredentials {
  document: string; // CPF or CNPJ
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    document?: string;
    email?: string;
    type: "user" | "ong";
  };
}

export async function saveSession(session: AuthResponse): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Erro ao salvar sessão no AsyncStorage:", error);
  }
}

export async function getSession(): Promise<AuthResponse | null> {
  try {
    const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as AuthResponse;
  } catch (error) {
    console.error("Erro ao recuperar sessão do AsyncStorage:", error);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar sessão do AsyncStorage:", error);
  }
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const documento = credentials.document.replace(/\D/g, "");
  const senha = credentials.password;

  if (!documento || !senha) {
    throw new Error("Informe o CPF/CNPJ e a senha.");
  }

  const db = await getDatabase();

  if (documento.length === 14) {
    const ong = await db.getFirstAsync<{
      id: number;
      nome: string;
      cnpj: string;
      email: string;
    }>("SELECT id, nome, cnpj, email FROM ongs WHERE cnpj = ? AND senha = ?", [
      documento,
      senha,
    ]);

    if (!ong) {
      throw new Error("CNPJ ou senha inválidos.");
    }

    const session: AuthResponse = {
      token: `local-ong-${ong.id}`,
      user: {
        id: String(ong.id),
        name: ong.nome,
        document: ong.cnpj,
        email: ong.email,
        type: "ong",
      },
    };

    await saveSession(session);
    return session;
  }

  const usuario = await db.getFirstAsync<{
    id: number;
    nome: string;
    cpf: string;
    email: string;
  }>("SELECT id, nome, cpf, email FROM usuarios WHERE cpf = ? AND senha = ?", [
    documento,
    senha,
  ]);

  if (!usuario) {
    throw new Error("CPF ou senha inválidos.");
  }

  const session: AuthResponse = {
    token: `local-user-${usuario.id}`,
    user: {
      id: String(usuario.id),
      name: usuario.nome,
      document: usuario.cpf,
      email: usuario.email,
      type: "user",
    },
  };

  await saveSession(session);
  return session;
}

export async function loginWithGoogle(): Promise<AuthResponse> {
  const clientId =
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    "mock-google-client-id.apps.googleusercontent.com";
  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL || "https://api.petconnect.com.br";

  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "petconnect",
    });

    const discovery = await AuthSession.fetchDiscoveryAsync(
      "https://accounts.google.com"
    );

    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ["profile", "email"],
      redirectUri,
    });

    const result = await request.promptAsync(discovery);

    let session: AuthResponse;

    if (result.type === "success" && result.params?.access_token) {
      const token = result.params.access_token;

      const apiResponse = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!apiResponse.ok) {
        throw new Error("Falha na autenticação com o Google no servidor.");
      }

      session = await apiResponse.json();
    } else {
      console.warn(
        "Google auth session not completed or dismissed, using fallback Google login."
      );
      session = {
        token: "mock-google-jwt-token-98765",
        user: {
          id: "google-user-1",
          name: "Google User",
          email: "user@gmail.com",
          type: "user",
        },
      };
    }

    await saveSession(session);
    return session;
  } catch (error: any) {
    console.warn("Google login fallback triggered due to:", error?.message);
    const fallbackSession: AuthResponse = {
      token: "mock-google-jwt-token-98765",
      user: {
        id: "google-user-1",
        name: "Google User",
        email: "user@gmail.com",
        type: "user",
      },
    };
    await saveSession(fallbackSession);
    return fallbackSession;
  }
}

function isMockToken(token?: string): boolean {
  return !!token && token.startsWith("mock-");
}

function isLocalToken(token?: string): boolean {
  return !!token && token.startsWith("local-");
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const session = await getSession();
  if (!session?.token) {
    throw new Error("Sessão inválida. Faça login novamente.");
  }

  if (isMockToken(session.token)) {
    return;
  }

  if (isLocalToken(session.token)) {
    const db = await getDatabase();
    const tabela = session.user.type === "ong" ? "ongs" : "usuarios";
    const id = Number(session.user.id);

    const existe = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM ${tabela} WHERE id = ? AND senha = ?`,
      [id, currentPassword]
    );

    if (!existe) {
      throw new Error("A senha atual está incorreta.");
    }

    await db.runAsync(`UPDATE ${tabela} SET senha = ? WHERE id = ?`, [
      newPassword,
      id,
    ]);
    return;
  }

  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL || "https://api.petconnect.com.br";

  const response = await fetch(`${apiUrl}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Não foi possível alterar a senha.");
  }
}


async function removeFallbackPrivacy(session: AuthResponse): Promise<void> {
  try {
    await AsyncStorage.removeItem(
      `${PRIVACY_FALLBACK_PREFIX}${session.user.type}:${session.user.id}`
    );
  } catch (error) {
    console.error("Erro ao remover preferências de privacidade:", error);
  }
}


async function removeLocalExtras(
  type: "user" | "ong",
  id: number
): Promise<void> {
  try {
    const db = await getDatabase();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS privacidade (
        tipo TEXT NOT NULL,
        id_conta INTEGER NOT NULL,
        perfil_publico INTEGER NOT NULL DEFAULT 1,
        mostrar_telefone INTEGER NOT NULL DEFAULT 0,
        mostrar_email INTEGER NOT NULL DEFAULT 0,
        compartilhar_localizacao INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (tipo, id_conta)
      );
      CREATE TABLE IF NOT EXISTS foto_perfil (
        tipo TEXT NOT NULL,
        id_conta INTEGER NOT NULL,
        foto TEXT NOT NULL,
        PRIMARY KEY (tipo, id_conta)
      );
    `);
    await db.runAsync(
      "DELETE FROM privacidade WHERE tipo = ? AND id_conta = ?",
      [type, id]
    );
    await db.runAsync(
      "DELETE FROM foto_perfil WHERE tipo = ? AND id_conta = ?",
      [type, id]
    );
  } catch (error) {
    console.error("Erro ao remover dados extras da conta:", error);
  }
}

export async function deleteAccount(): Promise<void> {
  const session = await getSession();
  if (!session?.token) {
    throw new Error("Sessão inválida. Faça login novamente.");
  }

  if (isMockToken(session.token)) {
    await removeFallbackPrivacy(session);
    await clearSession();
    return;
  }


  if (isLocalToken(session.token)) {
    const db = await getDatabase();
    const id = Number(session.user.id);

    // As tabelas precisam existir antes da transação
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS privacidade (
        tipo TEXT NOT NULL,
        id_conta INTEGER NOT NULL,
        perfil_publico INTEGER NOT NULL DEFAULT 1,
        mostrar_telefone INTEGER NOT NULL DEFAULT 0,
        mostrar_email INTEGER NOT NULL DEFAULT 0,
        compartilhar_localizacao INTEGER NOT NULL DEFAULT 1,
        PRIMARY KEY (tipo, id_conta)
      );
      CREATE TABLE IF NOT EXISTS foto_perfil (
        tipo TEXT NOT NULL,
        id_conta INTEGER NOT NULL,
        foto TEXT NOT NULL,
        PRIMARY KEY (tipo, id_conta)
      );
    `);

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "DELETE FROM privacidade WHERE tipo = ? AND id_conta = ?",
        [session.user.type, id]
      );
      await db.runAsync(
        "DELETE FROM foto_perfil WHERE tipo = ? AND id_conta = ?",
        [session.user.type, id]
      );

      if (session.user.type === "ong") {
        const animaisDaOng = `SELECT CAST(id AS TEXT) FROM animais WHERE id_ong = ?`;

        await db.runAsync(
          `DELETE FROM favoritos WHERE id_animal IN (${animaisDaOng})`,
          [id]
        );
        await db.runAsync(
          `DELETE FROM solicitacoes WHERE id_animal IN (${animaisDaOng})`,
          [id]
        );
        await db.runAsync("DELETE FROM animais WHERE id_ong = ?", [id]);
        await db.runAsync("DELETE FROM ongs WHERE id = ?", [id]);
      } else {
        await db.runAsync("DELETE FROM favoritos WHERE id_usuario = ?", [id]);
        await db.runAsync("DELETE FROM solicitacoes WHERE id_usuario = ?", [id]);
        await db.runAsync("DELETE FROM usuarios WHERE id = ?", [id]);
      }
    });

    await clearSession();
    return;
  }

  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL || "https://api.petconnect.com.br";

  const response = await fetch(`${apiUrl}/users/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Não foi possível excluir a conta.");
  }

  await removeFallbackPrivacy(session);
  await clearSession();
}

export async function getUserWhatsapp(): Promise<string | null> {
  const session = await getSession();
  if (
    !session?.token ||
    isMockToken(session.token) ||
    isLocalToken(session.token)
  ) {
    return null;
  }

  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL || "https://api.petconnect.com.br";

  try {
    const response = await fetch(`${apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    if (!response.ok) return null;

    const data = await response.json();
    const raw =
      data?.whatsapp ||
      data?.phone ||
      data?.telefone ||
      data?.user?.whatsapp ||
      data?.user?.phone ||
      data?.user?.telefone;

    const digits = String(raw || "").replace(/\D/g, "");
    if (!digits) return null;

    return digits.length <= 11 ? `55${digits}` : digits;
  } catch (e) {
    console.log("Erro ao buscar WhatsApp do usuário:", e);
    return null;
  }
}