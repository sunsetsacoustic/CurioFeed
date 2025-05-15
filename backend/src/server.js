import express from 'express';
import cors from 'cors';
import { initDb, dbPromise } from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Get news articles, with optional category/source filter
app.get('/api/news', async (req, res) => {
  const db = await dbPromise;
  const { category, source } = req.query;
  let query = 'SELECT * FROM articles';
  const params = [];
  if (category || source) {
    query += ' WHERE ';
    if (category) {
      query += 'category = ?';
      params.push(category);
    }
    if (category && source) query += ' AND ';
    if (source) {
      query += 'source = ?';
      params.push(source);
    }
  }
  query += ' ORDER BY datetime(pubDate) DESC LIMIT 100';
  const articles = await db.all(query, params);
  res.json(articles);
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all('SELECT DISTINCT category FROM articles');
  res.json(rows.map(r => r.category).filter(Boolean));
});

// Get all sources
app.get('/api/sources', async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all('SELECT DISTINCT source FROM articles');
  res.json(rows.map(r => r.source).filter(Boolean));
});

// Health check
app.get('/', (req, res) => {
  res.send('CurioFeed backend is running.');
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}); 