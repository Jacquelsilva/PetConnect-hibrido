
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Ong } from '../models/types';

export async function inserirOng(
  db: SQLiteDatabase,
  ong: Ong
): Promise<boolean> {
  try {
    const result = await db.runAsync(
      `INSERT INTO ongs
       (nome, cnpj, email, senha, cep, estado, cidade, endereco, telefone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ong.nome,
        ong.cnpj,
        ong.email,
        ong.senha,
        ong.cep,
        ong.estado,
        ong.cidade,
        ong.endereco,
        ong.telefone ?? null
      ]
    );

    return result.changes > 0;
  } catch {
    return false;
  }
}

export async function loginOng(
  db: SQLiteDatabase,
  email: string,
  senha: string
): Promise<Ong | null> {
  return db.getFirstAsync<Ong>(
    'SELECT * FROM ongs WHERE email = ? AND senha = ?',
    [email, senha]
  );
}

export async function listarOngs(
  db: SQLiteDatabase
): Promise<Ong[]> {
  return db.getAllAsync<Ong>(
    'SELECT * FROM ongs ORDER BY id DESC'
  );
}

export async function atualizarOng(
  db: SQLiteDatabase,
  ong: Ong
): Promise<boolean> {
  if (!ong.id) return false;

  const result = await db.runAsync(
    `UPDATE ongs
     SET nome = ?, cnpj = ?, email = ?, senha = ?,
         cep = ?, estado = ?, cidade = ?, endereco = ?, telefone = ?
     WHERE id = ?`,
    [
      ong.nome,
      ong.cnpj,
      ong.email,
      ong.senha,
      ong.cep,
      ong.estado,
      ong.cidade,
      ong.endereco,
      ong.telefone ?? null,
      ong.id
    ]
  );

  return result.changes > 0;
}

export async function excluirOng(
  db: SQLiteDatabase,
  id: number
): Promise<boolean> {
  const result = await db.runAsync(
    'DELETE FROM ongs WHERE id = ?',
    [id]
  );

  return result.changes > 0;
}
