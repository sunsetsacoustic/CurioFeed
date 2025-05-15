import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.join('backend', 'data', 'news.db');
console.log('Testing SQLite DB path:', dbPath);

async function testDb() {
  try {
    const db = await open({ filename: dbPath, driver: sqlite3.Database });
    await db.exec('CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY, value TEXT)');
    await db.run('INSERT INTO test_table (value) VALUES (?)', ['test']);
    const row = await db.get('SELECT * FROM test_table ORDER BY id DESC LIMIT 1');
    console.log('DB test success, last row:', row);
    await db.close();
  } catch (err) {
    console.error('DB test error:', err);
  }
}

testDb(); 