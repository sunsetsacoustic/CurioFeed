import express from 'express';
import cors from 'cors';
import { initDb, dbPromise } from './db.js';
import fetch from 'node-fetch';

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

// NewsAPI.org proxy endpoint
app.get('/api/newsapi', async (req, res) => {
  const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
  if (!NEWSAPI_KEY) {
    return res.status(500).json({ error: 'NewsAPI key not set in environment.' });
  }
  const { category, source } = req.query;
  let url = `https://newsapi.org/v2/top-headlines?apiKey=${NEWSAPI_KEY}&pageSize=50`;
  if (category && category !== 'All') url += `&category=${encodeURIComponent(category.toLowerCase())}`;
  if (source && source !== 'All') url += `&sources=${encodeURIComponent(source)}`;
  // Default to US headlines if no source/category
  if (!category && !source) url += '&country=us';
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== 'ok') {
      return res.status(500).json({ error: data.message || 'Failed to fetch from NewsAPI' });
    }
    // Normalize to match our article format
    const articles = data.articles.map(a => ({
      title: a.title,
      link: a.url,
      snippet: a.description || '',
      pubDate: a.publishedAt,
      source: a.source.name,
      category: category || ''
    }));
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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