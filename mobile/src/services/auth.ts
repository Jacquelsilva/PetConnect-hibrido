import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { getDatabase } from "@/database/Database";

WebBrowser.maybeCompleteAuthSession();

const AUTH_STORAGE_KEY = "@PetConnect:auth_session";
// Mesma chave usada por services/privacySettings.ts para contas Google/mock
const PRIVACY_FALLBACK_PREFIX = "@PetConnect:privacy:";

export interface LoginCredentials {
  document: string; // CPF, CNPJ or Email
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
    photoUrl?: string;
    whatsapp?: string;
    needsProfileCompletion?: boolean;
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
    if (auth.currentUser) {
      await signOut(auth);
    }
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar sessão do AsyncStorage:", error);
  }
}

<<<<<<< HEAD
=======
// Firebase & Local Hybrid Login
>>>>>>> 1fae836 (feat(layout): refine MainLayout navigation visibility and Google OAuth flow)
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const identifier = credentials.document.trim();
  const senha = credentials.password;

  if (!identifier || !senha) {
    throw new Error("Informe o e-mail/CPF/CNPJ e a senha.");
  }

  // If identifier is an email, try Firebase Auth first
  if (identifier.includes("@")) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, identifier, senha);
      const fbUser = userCredential.user;
      const token = await fbUser.getIdToken();

      // Fetch user profile from Firestore
      const userDocRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userDocRef);

      let userData: AuthResponse["user"] = {
        id: fbUser.uid,
        name: fbUser.displayName || "Usuário PetConnect",
        email: fbUser.email || identifier,
        type: "user",
      };

      if (userDoc.exists()) {
        const data = userDoc.data();
        userData = {
          id: fbUser.uid,
          name: data.name || data.nome || fbUser.displayName || "Usuário PetConnect",
          email: data.email || fbUser.email || identifier,
          document: data.document || data.cpf || data.cnpj,
          type: data.type === "ONG" || data.type === "ong" ? "ong" : "user",
          photoUrl: data.photoUrl || data.foto,
          whatsapp: data.whatsapp || data.phone || data.telefone,
        };
      } else {
        userData.needsProfileCompletion = true;
      }

      const session: AuthResponse = { token, user: userData };
      await saveSession(session);
      return session;
    } catch (firebaseError: any) {
      console.warn("Firebase login failed, trying local SQLite fallback:", firebaseError?.message);
    }
  }

  // Fallback / Local SQLite login (CPF / CNPJ)
  const documento = identifier.replace(/\D/g, "");
  const dbSqlite = await getDatabase();

  if (documento.length === 14) {
    const ong = await dbSqlite.getFirstAsync<{
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

  const usuario = await dbSqlite.getFirstAsync<{
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
  try {
    if (Platform.OS === "web") {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const token = await fbUser.getIdToken();

      const userDocRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userDocRef);

      let userData: AuthResponse["user"] = {
        id: fbUser.uid,
        name: fbUser.displayName || "Google User",
        email: fbUser.email || "",
        type: "user",
        photoUrl: fbUser.photoURL || undefined,
      };

      if (!userDoc.exists()) {
        userData.needsProfileCompletion = true;
        await setDoc(userDocRef, {
          name: userData.name,
          email: userData.email,
          type: "user",
          photoUrl: userData.photoUrl,
          createdAt: new Date().toISOString(),
        });
      } else {
        const data = userDoc.data();
        userData.name = data.name || data.nome || userData.name;
        userData.type = data.type === "ONG" || data.type === "ong" ? "ong" : "user";
        userData.photoUrl = data.photoUrl || data.foto || userData.photoUrl;
      }

      const session: AuthResponse = { token, user: userData };
      await saveSession(session);
      return session;
    }

    // Native Google Auth fallback
    const fallbackSession: AuthResponse = {
      token: "mock-google-jwt-token-98765",
      user: {
        id: "google-user-1",
        name: "Google User",
        email: "user@gmail.com",
        type: "user",
        needsProfileCompletion: true,
      },
    };
    await saveSession(fallbackSession);
    return fallbackSession;
  } catch (error: any) {
    console.warn("Google login error:", error?.message);
    const fallbackSession: AuthResponse = {
      token: "mock-google-jwt-token-98765",
      user: {
        id: "google-user-1",
        name: "Google User",
        email: "user@gmail.com",
        type: "user",
        needsProfileCompletion: true,
      },
    };
    await saveSession(fallbackSession);
    return fallbackSession;
  }
}

export async function registerWithFirebase(
  email: string,
  pass: string,
  name: string,
  document: string,
  type: "user" | "ong",
  whatsapp?: string
): Promise<AuthResponse> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;
  const token = await fbUser.getIdToken();

  const userData: AuthResponse["user"] = {
    id: fbUser.uid,
    name,
    email,
    document,
    type,
    whatsapp,
  };

  const userDocRef = doc(db, "users", fbUser.uid);
  await setDoc(userDocRef, {
    ...userData,
    createdAt: new Date().toISOString(),
  });

  const session: AuthResponse = { token, user: userData };
  await saveSession(session);
  return session;
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
    const dbSqlite = await getDatabase();
    const tabela = session.user.type === "ong" ? "ongs" : "usuarios";
    const id = Number(session.user.id);

    const existe = await dbSqlite.getFirstAsync<{ id: number }>(
      `SELECT id FROM ${tabela} WHERE id = ? AND senha = ?`,
      [id, currentPassword]
    );

    if (!existe) {
      throw new Error("A senha atual está incorreta.");
    }

    await dbSqlite.runAsync(`UPDATE ${tabela} SET senha = ? WHERE id = ?`, [
      newPassword,
      id,
    ]);
    return;
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

<<<<<<< HEAD

=======
>>>>>>> 1fae836 (feat(layout): refine MainLayout navigation visibility and Google OAuth flow)
  if (isLocalToken(session.token)) {
    const dbSqlite = await getDatabase();
    const id = Number(session.user.id);

<<<<<<< HEAD
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

=======
    await dbSqlite.withTransactionAsync(async () => {
>>>>>>> 1fae836 (feat(layout): refine MainLayout navigation visibility and Google OAuth flow)
      if (session.user.type === "ong") {
        const animaisDaOng = `SELECT CAST(id AS TEXT) FROM animais WHERE id_ong = ?`;
        await dbSqlite.runAsync(
          `DELETE FROM favoritos WHERE id_animal IN (${animaisDaOng})`,
          [id]
        );
        await dbSqlite.runAsync(
          `DELETE FROM solicitacoes WHERE id_animal IN (${animaisDaOng})`,
          [id]
        );
        await dbSqlite.runAsync("DELETE FROM animais WHERE id_ong = ?", [id]);
        await dbSqlite.runAsync("DELETE FROM ongs WHERE id = ?", [id]);
      } else {
        await dbSqlite.runAsync("DELETE FROM favoritos WHERE id_usuario = ?", [id]);
        await dbSqlite.runAsync("DELETE FROM solicitacoes WHERE id_usuario = ?", [id]);
        await dbSqlite.runAsync("DELETE FROM usuarios WHERE id = ?", [id]);
      }
    });

    await clearSession();
    return;
  }

  if (auth.currentUser) {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { deleted: true });
    await auth.currentUser.delete().catch(() => {});
  }

  await removeFallbackPrivacy(session);
  await clearSession();
}

export async function getUserWhatsapp(): Promise<string | null> {
  const session = await getSession();
  if (!session?.token) return null;

  if (session.user.whatsapp) {
    const digits = String(session.user.whatsapp).replace(/\D/g, "");
    return digits.length <= 11 ? `55${digits}` : digits;
  }

  if (!isMockToken(session.token) && !isLocalToken(session.token) && auth.currentUser) {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const raw = data.whatsapp || data.phone || data.telefone;
        const digits = String(raw || "").replace(/\D/g, "");
        if (digits) return digits.length <= 11 ? `55${digits}` : digits;
      }
    } catch (e) {
      console.log("Erro ao buscar WhatsApp do Firestore:", e);
    }
  }

  return null;
}
