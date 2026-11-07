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
  try {
    return await db.getFirstAsync<Usuario>(
      "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
      [email, senha]
    );
  } catch (error) {
    console.error("ERRO AO FAZER LOGIN NO SQLITE:", error);
    return null;
  }
}

export async function buscarUsuarioPorId(
  db: SQLiteDatabase,
  id: number
): Promise<Usuario | null> {
  try {
    return await db.getFirstAsync<Usuario>(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
  } catch (error) {
    console.error("ERRO AO BUSCAR USUÁRIO POR ID:", error);
    return null;
  }
}

export async function listarUsuarios(
  db: SQLiteDatabase
): Promise<Usuario[]> {
  try {
    return await db.getAllAsync<Usuario>(
      "SELECT * FROM usuarios ORDER BY id DESC"
    );
  } catch (error) {
    console.error("ERRO AO LISTAR USUÁRIOS:", error);
    return [];
  }
}

export async function atualizarUsuario(
  db: SQLiteDatabase,
  usuario: Usuario
): Promise<boolean> {
  try {
    console.log("INICIANDO ATUALIZAÇÃO DO USUÁRIO...");
    console.log("DADOS RECEBIDOS:", JSON.stringify(usuario));

    // Antes: "if (!usuario.id) return false;" falhava em silêncio.
    if (usuario.id === undefined || usuario.id === null) {
      console.error("ERRO: usuário sem ID, não é possível atualizar.");
      return false;
    }

    // Verifica se o e-mail já pertence a OUTRO usuário
    const emailEmUso = await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM usuarios WHERE email = ? AND id <> ?",
      [usuario.email, usuario.id]
    );

    if (emailEmUso) {
      console.log("E-MAIL JÁ USADO POR OUTRO USUÁRIO:", emailEmUso.id);
      return false;
    }

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

    console.log("USUÁRIO ATUALIZADO!");
    console.log("ALTERAÇÕES:", result.changes);

    return result.changes > 0;
  } catch (error) {
    console.error("ERRO AO ATUALIZAR USUÁRIO NO SQLITE:", error);
    return false;
  }
}

export async function excluirUsuario(
  db: SQLiteDatabase,
  id: number
): Promise<boolean> {
  try {
    const result = await db.runAsync(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );

    console.log("ALTERAÇÕES (EXCLUSÃO):", result.changes);

    return result.changes > 0;
  } catch (error) {
    console.error("ERRO AO EXCLUIR USUÁRIO NO SQLITE:", error);
    return false;
  }
}

