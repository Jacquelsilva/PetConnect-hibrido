
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Animal } from '../models/types';

export async function inserirAnimal(
  db: SQLiteDatabase,
  animal: Animal
): Promise<number | null> {
  const result = await db.runAsync(
    `INSERT INTO animais
     (nome, especie, idade, porte, sexo, descricao, foto_url, id_ong)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      animal.nome,
      animal.especie,
      animal.idade,
      animal.porte,
      animal.sexo,
      animal.descricao,
      animal.foto_url ?? null,
      animal.id_ong
    ]
  );

  return result.lastInsertRowId || null;
}

export async function listarAnimais(
  db: SQLiteDatabase
): Promise<Animal[]> {
  return db.getAllAsync<Animal>(
    'SELECT * FROM animais ORDER BY id DESC'
  );
}

export async function buscarAnimal(
  db: SQLiteDatabase,
  id: number
): Promise<Animal | null> {
  return db.getFirstAsync<Animal>(
    'SELECT * FROM animais WHERE id = ?',
    [id]
  );
}

export async function listarAnimaisDaOng(
  db: SQLiteDatabase,
  idOng: number
): Promise<Animal[]> {
  return db.getAllAsync<Animal>(
    'SELECT * FROM animais WHERE id_ong = ? ORDER BY id DESC',
    [idOng]
  );
}

export async function atualizarAnimal(
  db: SQLiteDatabase,
  animal: Animal
): Promise<boolean> {
  if (!animal.id) return false;

  const result = await db.runAsync(
    `UPDATE animais
     SET nome = ?, especie = ?, idade = ?, porte = ?,
         sexo = ?, descricao = ?, foto_url = ?, id_ong = ?
     WHERE id = ?`,
    [
      animal.nome,
      animal.especie,
      animal.idade,
      animal.porte,
      animal.sexo,
      animal.descricao,
      animal.foto_url ?? null,
      animal.id_ong,
      animal.id
    ]
  );

  return result.changes > 0;
}

export async function excluirAnimal(
  db: SQLiteDatabase,
  id: number
): Promise<boolean> {
  const result = await db.runAsync(
    'DELETE FROM animais WHERE id = ?',
    [id]
  );

  return result.changes > 0;
}
