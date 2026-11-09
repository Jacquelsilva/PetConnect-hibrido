import { getDatabase } from "@/database/Database";

type AccountType = "user" | "ong";

let tableReady: Promise<void> | null = null;

function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = (async () => {
      const db = await getDatabase();
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS foto_perfil (
          tipo TEXT NOT NULL,
          id_conta INTEGER NOT NULL,
          foto TEXT NOT NULL,
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

/** Retorna a foto (data URI) da conta, ou null se não tiver. */
export async function getProfilePhoto(
  type: AccountType,
  id: number | string
): Promise<string | null> {
  try {
    await ensureTable();
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ foto: string }>(
      "SELECT foto FROM foto_perfil WHERE tipo = ? AND id_conta = ?",
      [type, Number(id)]
    );
    return row?.foto ?? null;
  } catch (e) {
    console.error("Erro ao ler foto de perfil:", e);
    return null;
  }
}

/** Salva a foto da conta. Passe null para remover. */
export async function saveProfilePhoto(
  type: AccountType,
  id: number | string,
  photo: string | null
): Promise<void> {
  await ensureTable();
  const db = await getDatabase();

  if (!photo) {
    await db.runAsync(
      "DELETE FROM foto_perfil WHERE tipo = ? AND id_conta = ?",
      [type, Number(id)]
    );
    return;
  }

  await db.runAsync(
    `INSERT INTO foto_perfil (tipo, id_conta, foto) VALUES (?, ?, ?)
     ON CONFLICT(tipo, id_conta) DO UPDATE SET foto = excluded.foto`,
    [type, Number(id), photo]
  );
}