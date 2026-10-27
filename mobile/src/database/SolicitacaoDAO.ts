
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Solicitacao } from '../models/types';

export async function inserirSolicitacao(
  db: SQLiteDatabase,
  dados: Pick<Solicitacao, 'id_usuario' | 'id_animal'> &
    Partial<Pick<
      Solicitacao,
      | 'nome_solicitante'
      | 'telefone'
      | 'moradia'
      | 'outros_animais'
      | 'experiencia'
      | 'observacoes'
    >>
): Promise<boolean> {
  const data = new Date().toLocaleDateString('pt-BR');

  try {
    const result = await db.runAsync(
      `INSERT OR IGNORE INTO solicitacoes
       (id_usuario, id_animal, status, data, nome_solicitante,
        telefone, moradia, outros_animais, experiencia, observacoes)
       VALUES (?, ?, 'Em análise', ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.id_usuario,
        dados.id_animal,
        data,
        dados.nome_solicitante ?? '',
        dados.telefone ?? '',
        dados.moradia ?? '',
        dados.outros_animais ?? '',
        dados.experiencia ?? '',
        dados.observacoes ?? ''
      ]
    );

    return result.changes > 0;
  } catch {
    return false;
  }
}

export async function jaSolicitou(
  db: SQLiteDatabase,
  idUsuario: number,
  idAnimal: string
): Promise<boolean> {
  const row = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM solicitacoes
     WHERE id_usuario = ? AND id_animal = ?`,
    [idUsuario, idAnimal]
  );

  return row !== null;
}

export async function listarSolicitacoesPorUsuario(
  db: SQLiteDatabase,
  idUsuario: number
): Promise<Solicitacao[]> {
  return db.getAllAsync<Solicitacao>(
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
}

export async function atualizarStatusSolicitacao(
  db: SQLiteDatabase,
  idSolicitacao: number,
  status: string
): Promise<boolean> {
  const result = await db.runAsync(
    'UPDATE solicitacoes SET status = ? WHERE id = ?',
    [status, idSolicitacao]
  );

  return result.changes > 0;
}
