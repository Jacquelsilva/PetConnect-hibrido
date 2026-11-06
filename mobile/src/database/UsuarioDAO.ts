
import type { SQLiteDatabase } from "expo-sqlite";
import type { Usuario } from "../models/types";

export async function inserirUsuario(
  db: SQLiteDatabase,
  usuario: Usuario
): Promise<boolean> {
  try {
    console.log("INICIANDO INSERÇÃO DO USUÁRIO...");
    console.log("E-MAIL:", usuario.email);

    const existente = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM usuarios WHERE email = ?",
      [usuario.email]
    );

    if (existente) {
      console.log("E-MAIL JÁ CADASTRADO:", existente.id);
      return false;
    }

    const result = await db.runAsync(
      `INSERT INTO usuarios
       (nome, cpf, email, senha, cep, estado, cidade, endereco)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario.nome,
        usuario.cpf,
        usuario.email,
        usuario.senha,
        usuario.cep,
        usuario.estado,
        usuario.cidade,
        usuario.endereco,
      ]
    );

    console.log("USUÁRIO INSERIDO!");
    console.log("ID:", result.lastInsertRowId);
    console.log("ALTERAÇÕES:", result.changes);

    return result.changes > 0;

  } catch (error) {
    console.error("ERRO AO INSERIR USUÁRIO NO SQLITE:", error);
    return false;
  }
}

export async function loginUsuario(
  db: SQLiteDatabase,
  email: string,
  senha: string
): Promise<Usuario | null> {
  return db.getFirstAsync<Usuario>(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha]
  );
}

export async function buscarUsuarioPorId(
  db: SQLiteDatabase,
  id: number
): Promise<Usuario | null> {
  return db.getFirstAsync<Usuario>(
    "SELECT * FROM usuarios WHERE id = ?",
    [id]
  );
}

export async function listarUsuarios(
  db: SQLiteDatabase
): Promise<Usuario[]> {
  return db.getAllAsync<Usuario>(
    "SELECT * FROM usuarios ORDER BY id DESC"
  );
}

export async function atualizarUsuario(
  db: SQLiteDatabase,
  usuario: Usuario
): Promise<boolean> {
  if (!usuario.id) return false;

  const result = await db.runAsync(
    `UPDATE usuarios
     SET nome = ?, cpf = ?, email = ?, senha = ?,
         cep = ?, estado = ?, cidade = ?, endereco = ?
     WHERE id = ?`,
    [
      usuario.nome,
      usuario.cpf,
      usuario.email,
      usuario.senha,
      usuario.cep,
      usuario.estado,
      usuario.cidade,
      usuario.endereco,
      usuario.id,
    ]
  );

  return result.changes > 0;
}

export async function excluirUsuario(
  db: SQLiteDatabase,
  id: number
): Promise<boolean> {
  const result = await db.runAsync(
    "DELETE FROM usuarios WHERE id = ?",
    [id]
  );

  return result.changes > 0;
}
