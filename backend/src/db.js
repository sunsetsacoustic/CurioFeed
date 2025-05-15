import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.join('backend', 'data', 'news.db');
console.log('Resolved SQLite DB path:', dbPath);

const dbPromise = open({
  filename: dbPath,
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