import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './backend/data/news.db',
  driver: sqlite3.Database
});

export async function initDb() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      link TEXT UNIQUE,
      snippet TEXT,
      pubDate TEXT,
      source TEXT,
      category TEXT
    )
  `);
  return db;
}

export { dbPromise }; 