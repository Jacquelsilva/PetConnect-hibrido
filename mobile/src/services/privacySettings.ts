import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "@/database/Database";
import { getSession, type AuthResponse } from "@/services/auth";

export interface PrivacySettings {
  profileVisible: boolean;
  showPhone: boolean;
  showEmail: boolean;
  shareLocation: boolean;
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisible: true,
  showPhone: false,
  showEmail: false,
  shareLocation: true,
};

type AccountType = "user" | "ong";

const FALLBACK_PREFIX = "@PetConnect:privacy:";

type Row = {
  perfil_publico: number;
  mostrar_telefone: number;
  mostrar_email: number;
  compartilhar_localizacao: number;
};

let tableReady: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
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
      `);
    })().catch((e) => {
      tableReady = null;
      throw e;
    });
  }
  return tableReady;
}

function rowToSettings(row: Row | null | undefined): PrivacySettings {
  if (!row) return { ...DEFAULT_PRIVACY_SETTINGS };
  return {
    profileVisible: row.perfil_publico === 1,
    showPhone: row.mostrar_telefone === 1,
    showEmail: row.mostrar_email === 1,
    shareLocation: row.compartilhar_localizacao === 1,
  };
}

function isLocal(session: AuthResponse) {
  return session.token.startsWith("local-");
}

function fallbackKey(session: AuthResponse) {
  return `${FALLBACK_PREFIX}${session.user.type}:${session.user.id}`;
}


export async function getPrivacyFor(
  type: AccountType,
  id: number | string
): Promise<PrivacySettings> {
  try {
    await ensureTable();
    const db = await getDatabase();
    const row = await db.getFirstAsync<Row>(
      `SELECT perfil_publico, mostrar_telefone, mostrar_email, compartilhar_localizacao
       FROM privacidade WHERE tipo = ? AND id_conta = ?`,
      [type, Number(id)]
    );
    return rowToSettings(row);
  } catch (e) {
    console.error("Erro ao ler privacidade da conta:", e);
    return { ...DEFAULT_PRIVACY_SETTINGS };
  }
}


export async function getPrivacySettings(): Promise<PrivacySettings> {
  const session = await getSession();
  if (!session) return { ...DEFAULT_PRIVACY_SETTINGS };

  if (isLocal(session)) {
    return getPrivacyFor(session.user.type, session.user.id);
  }

  // Login Google/mock: não existe linha no SQLite, guarda só no aparelho
  try {
    const raw = await AsyncStorage.getItem(fallbackKey(session));
    return raw
      ? { ...DEFAULT_PRIVACY_SETTINGS, ...JSON.parse(raw) }
      : { ...DEFAULT_PRIVACY_SETTINGS };
  } catch {
    return { ...DEFAULT_PRIVACY_SETTINGS };
  }
}

// fila para dois toques rápidos não se sobrescreverem
let writeQueue: Promise<unknown> = Promise.resolve();

export function updatePrivacySettings(
  patch: Partial<PrivacySettings>
): Promise<PrivacySettings> {
  const task = writeQueue.then(async () => {
    const session = await getSession();
    if (!session?.token) {
      throw new Error("Sessão inválida. Faça login novamente.");
    }

    const next: PrivacySettings = {
      ...(await getPrivacySettings()),
      ...patch,
    };

    if (!isLocal(session)) {
      try {
        await AsyncStorage.setItem(fallbackKey(session), JSON.stringify(next));
      } catch (e) {
        console.error("Erro ao salvar privacidade:", e);
        throw new Error("Não foi possível salvar a preferência.");
      }
      return next;
    }

    try {
      await ensureTable();
      const db = await getDatabase();
      await db.runAsync(
        `INSERT INTO privacidade
           (tipo, id_conta, perfil_publico, mostrar_telefone, mostrar_email, compartilhar_localizacao)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(tipo, id_conta) DO UPDATE SET
           perfil_publico = excluded.perfil_publico,
           mostrar_telefone = excluded.mostrar_telefone,
           mostrar_email = excluded.mostrar_email,
           compartilhar_localizacao = excluded.compartilhar_localizacao`,
        [
          session.user.type,
          Number(session.user.id),
          next.profileVisible ? 1 : 0,
          next.showPhone ? 1 : 0,
          next.showEmail ? 1 : 0,
          next.shareLocation ? 1 : 0,
        ]
      );
    } catch (e) {
      console.error("Erro ao salvar privacidade:", e);
      throw new Error("Não foi possível salvar a preferência.");
    }
    return next;
  });

  writeQueue = task.catch(() => undefined);
  return task;
}


export async function applyContactPrivacy<
  T extends { id: number | string; telefone?: string | null; email?: string | null }
>(
  type: AccountType,
  contact: T
): Promise<T & { hidden: boolean }> {
  const p = await getPrivacyFor(type, contact.id);
  return {
    ...contact,
    telefone: p.showPhone ? contact.telefone ?? null : null,
    email: p.showEmail ? contact.email ?? null : null,
    hidden: !p.profileVisible,
  };
}