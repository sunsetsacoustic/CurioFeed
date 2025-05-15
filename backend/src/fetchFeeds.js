import Parser from 'rss-parser';
import { feeds } from './feeds.js';
import { initDb } from './db.js';

const parser = new Parser();

async function fetchAndStore() {
  const db = await initDb();
  let newArticles = 0;
  for (const feed of feeds) {
    try {
      const res = await parser.parseURL(feed.url);
      for (const item of res.items) {
        try {
          await db.run(
            `INSERT OR IGNORE INTO articles (title, link, snippet, pubDate, source, category) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.title,
              item.link,
              item.contentSnippet || item.content || '',
              item.pubDate || '',
              feed.name,
              feed.category
            ]
          );
          if (db.changes > 0) newArticles++;
        } catch (e) {
          // Ignore duplicate errors
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${feed.name}:`, e.message);
    }
  }
  console.log(`Fetched feeds. New articles added: ${newArticles}`);
}

fetchAndStore(); 