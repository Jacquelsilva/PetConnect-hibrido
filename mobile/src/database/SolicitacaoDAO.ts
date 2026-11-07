import type { SQLiteDatabase } from "expo-sqlite";
import type { Solicitacao } from "../models/types";

export async function inserirSolicitacao(
  db: SQLiteDatabase,
  dados: Pick<Solicitacao, "id_usuario" | "id_animal"> &
    Partial<
      Pick<
        Solicitacao,
        | "nome_solicitante"
        | "telefone"
        | "moradia"
        | "outros_animais"
        | "experiencia"
        | "observacoes"
      >
    >
): Promise<boolean> {
  const data = new Date().toLocaleDateString("pt-BR");

  try {
    console.log("INSERINDO SOLICITAÇÃO:", JSON.stringify(dados));

    const result = await db.runAsync(
      `INSERT OR IGNORE INTO solicitacoes
       (id_usuario, id_animal, status, data, nome_solicitante,
        telefone, moradia, outros_animais, experiencia, observacoes)
       VALUES (?, ?, 'Em análise', ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.id_usuario,
        String(dados.id_animal),
        data,
        dados.nome_solicitante ?? "",
        dados.telefone ?? "",
        dados.moradia ?? "",
        dados.outros_animais ?? "",
        dados.experiencia ?? "",
        dados.observacoes ?? "",
      ]
    );

    // changes = 0 significa que o usuário já tinha solicitado esse animal
    console.log("SOLICITAÇÃO - ALTERAÇÕES:", result.changes);

    return result.changes > 0;
  } catch (error) {
    console.error("ERRO AO INSERIR SOLICITAÇÃO NO SQLITE:", error);
    return false;
  }
}

export async function jaSolicitou(
  db: SQLiteDatabase,
  idUsuario: number,
  idAnimal: string
): Promise<boolean> {
  try {
    const row = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM solicitacoes
       WHERE id_usuario = ? AND id_animal = ?`,
      [idUsuario, String(idAnimal)]
    );

    return row !== null;
  } catch (error) {
    console.error("ERRO AO VERIFICAR SOLICITAÇÃO EXISTENTE:", error);
    return false;
  }
}

export async function listarSolicitacoesPorUsuario(
  db: SQLiteDatabase,
  idUsuario: number
): Promise<Solicitacao[]> {
  try {
    return await db.getAllAsync<Solicitacao>(
      `SELECT s.id, s.id_usuario, s.id_animal, s.status, s.data,
              s.nome_solicitante, s.telefone, s.moradia,
              s.outros_animais, s.experiencia, s.observacoes,
              COALESCE(a.nome, p.nome, 'Animal') AS nome_animal,
              COALESCE(o1.nome, o2.nome, '') AS nome_ong
       FROM solicitacoes s
       LEFT JOIN animais a
         ON s.id_animal = CAST(a.id AS TEXT)
       LEFT JOIN pets p
         ON s.id_animal = CAST(p.id AS TEXT)
       LEFT JOIN ongs o1 ON a.id_ong = o1.id
       LEFT JOIN ongs o2 ON p.id_ong = o2.id
       WHERE s.id_usuario = ?
       ORDER BY s.id DESC`,
      [idUsuario]
    );
  } catch (error) {
    console.error("ERRO AO LISTAR SOLICITAÇÕES DO USUÁRIO:", error);
    return [];
  }
}

// Solicitações recebidas pelos animais de uma ONG
export async function listarSolicitacoesPorOng(
  db: SQLiteDatabase,
  idOng: number
): Promise<Solicitacao[]> {
  try {
    return await db.getAllAsync<Solicitacao>(
      `SELECT s.id, s.id_usuario, s.id_animal, s.status, s.data,
              s.nome_solicitante, s.telefone, s.moradia,
              s.outros_animais, s.experiencia, s.observacoes,
              COALESCE(a.nome, p.nome, 'Animal') AS nome_animal,
              COALESCE(o1.nome, o2.nome, '') AS nome_ong
       FROM solicitacoes s
       LEFT JOIN animais a
         ON s.id_animal = CAST(a.id AS TEXT)
       LEFT JOIN pets p
         ON s.id_animal = CAST(p.id AS TEXT)
       LEFT JOIN ongs o1 ON a.id_ong = o1.id
       LEFT JOIN ongs o2 ON p.id_ong = o2.id
       WHERE a.id_ong = ? OR p.id_ong = ?
       ORDER BY s.id DESC`,
      [idOng, idOng]
    );
  } catch (error) {
    console.error("ERRO AO LISTAR SOLICITAÇÕES DA ONG:", error);
    return [];
  }
}

// Totais para a Home da ONG
export async function contarSolicitacoesDaOng(
  db: SQLiteDatabase,
  idOng: number
): Promise<{ total: number; pendentes: number }> {
  try {
    const row = await db.getFirstAsync<{ total: number; pendentes: number }>(
      `SELECT
         COUNT(*) AS total,
         COALESCE(SUM(CASE WHEN s.status = 'Em análise' THEN 1 ELSE 0 END), 0) AS pendentes
       FROM solicitacoes s
       WHERE EXISTS (
               SELECT 1 FROM animais a
               WHERE CAST(a.id AS TEXT) = s.id_animal AND a.id_ong = ?
             )
          OR EXISTS (
               SELECT 1 FROM pets p
               WHERE CAST(p.id AS TEXT) = s.id_animal AND p.id_ong = ?
             )`,
      [idOng, idOng]
    );

    return {
      total: row?.total ?? 0,
      pendentes: row?.pendentes ?? 0,
    };
  } catch (error) {
    console.error("ERRO AO CONTAR SOLICITAÇÕES DA ONG:", error);
    return { total: 0, pendentes: 0 };
  }
}

export async function atualizarStatusSolicitacao(
  db: SQLiteDatabase,
  idSolicitacao: number,
  status: string
): Promise<boolean> {
  try {
    if (idSolicitacao === undefined || idSolicitacao === null) {
      console.error("ERRO: solicitação sem ID, não é possível atualizar.");
      return false;
    }

    const result = await db.runAsync(
      "UPDATE solicitacoes SET status = ? WHERE id = ?",
      [status, idSolicitacao]
    );

    console.log("STATUS ATUALIZADO. ALTERAÇÕES:", result.changes);

    return result.changes > 0;
  } catch (error) {
    console.error("ERRO AO ATUALIZAR STATUS DA SOLICITAÇÃO:", error);
    return false;
  }
}