
import * as SQLite from 'expo-sqlite';

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  database = await SQLite.openDatabaseAsync('petconnect.db');

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      cpf TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      cep TEXT,
      estado TEXT,
      cidade TEXT,
      endereco TEXT
    );

    CREATE TABLE IF NOT EXISTS ongs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      cnpj TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      cep TEXT,
      estado TEXT,
      cidade TEXT,
      endereco TEXT,
      telefone TEXT
    );

    CREATE TABLE IF NOT EXISTS animais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      especie TEXT,
      idade INTEGER,
      porte TEXT,
      sexo TEXT,
      descricao TEXT,
      foto_url TEXT,
      id_ong INTEGER
    );

    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      especie TEXT,
      idade INTEGER,
      porte TEXT,
      sexo TEXT,
      descricao TEXT,
      foto_url TEXT,
      id_ong INTEGER
    );

    CREATE TABLE IF NOT EXISTS favoritos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      id_animal TEXT NOT NULL,
      UNIQUE(id_usuario, id_animal)
    );

    CREATE TABLE IF NOT EXISTS solicitacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      id_animal TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Em análise',
      data TEXT,
      nome_solicitante TEXT,
      telefone TEXT,
      moradia TEXT,
      outros_animais TEXT,
      experiencia TEXT,
      observacoes TEXT,
      UNIQUE(id_usuario, id_animal)
    );
  `);

  return database;
}
