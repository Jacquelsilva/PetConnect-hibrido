import type { SQLiteDatabase } from "expo-sqlite";
import type { Solicitacao } from "../models/types";

type DadosSolicitacao = Pick<Solicitacao, "id_usuario" | "id_animal"> &
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
  >;

export type ResultadoSolicitacao = {
  ok: boolean;
  motivo?: "usuario_invalido" | "animal_invalido" | "duplicada" | "erro";
};

// Une animais e pets sem duplicar: se o ID existe em "animais", ignora "pets".
// Evita que o mesmo id_animal case com as duas tabelas ao mesmo tempo.
const JOIN_ANIMAIS = `
  LEFT JOIN animais a
    ON s.id_animal = CAST(a.id AS TEXT)
  LEFT JOIN pets p
    ON s.id_animal = CAST(p.id AS TEXT) AND a.id IS NULL
  LEFT JOIN ongs o1 ON a.id_ong = o1.id
  LEFT JOIN ongs o2 ON p.id_ong = o2.id
`;

const CAMPOS = `
  s.id, s.id_usuario, s.id_animal, s.status, s.data,
  s.nome_solicitante, s.telefone, s.moradia,
  s.outros_animais, s.experiencia, s.observacoes,
  COALESCE(a.nome, p.nome, 'Animal') AS nome_animal,
  COALESCE(o1.nome, o2.nome, '') AS nome_ong
`;

/** Versão com motivo da falha, útil para a tela mostrar a mensagem certa. */
export async function inserirSolicitacaoComMotivo(
  db: SQLiteDatabase,
  dados: DadosSolicitacao
): Promise<ResultadoSolicitacao> {
  const idUsuario = Number(dados.id_usuario);
  const idAnimal = String(dados.id_animal ?? "").trim();

  if (!Number.isFinite(idUsuario) || idUsuario <= 0) {
    console.error("SOLICITAÇÃO: id_usuario inválido:", dados.id_usuario);
    return { ok: false, motivo: "usuario_invalido" };
  }

  if (!idAnimal || idAnimal === "undefined" || idAnimal === "null") {
    console.error("SOLICITAÇÃO: id_animal inválido:", dados.id_animal);
    return { ok: false, motivo: "animal_invalido" };
  }

  try {
    // Só avisa: a solicitação é gravada mesmo assim, mas nenhuma ONG a verá
    const existe = await db.getFirstAsync<{ id_ong: number | null }>(
      `SELECT id_ong FROM animais WHERE CAST(id AS TEXT) = ?
       UNION ALL
       SELECT id_ong FROM pets WHERE CAST(id AS TEXT) = ?
       LIMIT 1`,
      [idAnimal, idAnimal]
    );
    if (!existe || existe.id_ong == null) {
      console.warn(
        "SOLICITAÇÃO: o animal",
        idAnimal,
        "não existe em animais/pets ou não tem ONG. Nenhuma ONG vai receber."
      );
    }

    const data = new Date().toLocaleDateString("pt-BR");

    // INSERT simples (sem OR IGNORE) para os erros aparecerem de verdade
    await db.runAsync(
      `INSERT INTO solicitacoes
       (id_usuario, id_animal, status, data, nome_solicitante,
        telefone, moradia, outros_animais, experiencia, observacoes)
       VALUES (?, ?, 'Em análise', ?, ?, ?, ?, ?, ?, ?)`,
      [
        idUsuario,
        idAnimal,
        data,
        dados.nome_solicitante ?? "",
        dados.telefone ?? "",
        dados.moradia ?? "",
        dados.outros_animais ?? "",
        dados.experiencia ?? "",
        dados.observacoes ?? "",
      ]
    );

    return { ok: true };
  } catch (error: any) {
    const msg = String(error?.message ?? error);
    if (msg.includes("UNIQUE")) {
      return { ok: false, motivo: "duplicada" };
    }
    console.error("ERRO AO INSERIR SOLICITAÇÃO NO SQLITE:", error);
    return { ok: false, motivo: "erro" };
  }
}

/** Mantém a assinatura antiga (boolean) para não quebrar as telas. */
export async function inserirSolicitacao(
  db: SQLiteDatabase,
  dados: DadosSolicitacao
): Promise<boolean> {
  const resultado = await inserirSolicitacaoComMotivo(db, dados);
  if (!resultado.ok) {
    console.log("SOLICITAÇÃO NÃO ENVIADA. MOTIVO:", resultado.motivo);
  }
  return resultado.ok;
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
      `SELECT ${CAMPOS}
       FROM solicitacoes s
       ${JOIN_ANIMAIS}
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
      `SELECT ${CAMPOS}
       FROM solicitacoes s
       ${JOIN_ANIMAIS}
       WHERE a.id_ong = ? OR (a.id IS NULL AND p.id_ong = ?)
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
       ${JOIN_ANIMAIS}
       WHERE a.id_ong = ? OR (a.id IS NULL AND p.id_ong = ?)`,
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