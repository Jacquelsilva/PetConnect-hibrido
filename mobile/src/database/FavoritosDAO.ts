import type { SQLiteDatabase } from 'expo-sqlite';
import type { Animal } from '../models/types';

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

// NOVO: favorita se não é favorito, desfavorita se já é.
// Retorna true se o animal ficou favoritado.
export async function alternarFavorito(
  db: SQLiteDatabase,
  idUsuario: number,
  idAnimal: number
): Promise<boolean> {
  const id = String(idAnimal);

  if (await isFavorito(db, idUsuario, id)) {
    await removerFavorito(db, idUsuario, id);
    return false;
  }

  await adicionarFavorito(db, idUsuario, id);
  return true;
}

// NOVO: animais favoritados pelo usuário, para a tela Meus Favoritos
export async function listarAnimaisFavoritos(
  db: SQLiteDatabase,
  idUsuario: number
): Promise<Animal[]> {
  return db.getAllAsync<Animal>(
    `SELECT a.*
     FROM animais a
     INNER JOIN favoritos f
       ON CAST(f.id_animal AS TEXT) = CAST(a.id AS TEXT)
     WHERE f.id_usuario = ?
     ORDER BY a.id DESC`,
    [idUsuario]
  );
}