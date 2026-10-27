
import type { SQLiteDatabase } from 'expo-sqlite';

export async function adicionarFavorito(
  db: SQLiteDatabase,
  idUsuario: number,
  idAnimal: string
): Promise<void> {
  await db.runAsync(
    `INSERT OR IGNORE INTO favoritos
     (id_usuario, id_animal)
     VALUES (?, ?)`,
    [idUsuario, idAnimal]
  );
}

export async function removerFavorito(
  db: SQLiteDatabase,
  idUsuario: number,
  idAnimal: string
): Promise<void> {
  await db.runAsync(
    `DELETE FROM favoritos
     WHERE id_usuario = ? AND id_animal = ?`,
    [idUsuario, idAnimal]
  );
}

export async function isFavorito(
  db: SQLiteDatabase,
  idUsuario: number,
  idAnimal: string
): Promise<boolean> {
  const row = await db.getFirstAsync<{ existe: number }>(
    `SELECT 1 AS existe
     FROM favoritos
     WHERE id_usuario = ? AND id_animal = ?`,
    [idUsuario, idAnimal]
  );

  return row !== null;
}

export async function listarIdsFavoritos(
  db: SQLiteDatabase,
  idUsuario: number
): Promise<string[]> {
  const rows = await db.getAllAsync<{ id_animal: string }>(
    'SELECT id_animal FROM favoritos WHERE id_usuario = ?',
    [idUsuario]
  );

  return rows.map((row) => row.id_animal);
}
