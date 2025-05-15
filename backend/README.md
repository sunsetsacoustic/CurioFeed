# CurioFeed Backend

This is the backend for CurioFeed, a news aggregator MVP. It fetches articles from selected RSS feeds, stores them in SQLite, and exposes a simple API for the frontend.

## Tech Stack
- Node.js + Express
- SQLite
- rss-parser

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Fetch news articles (run manually or set up a cron job):
   ```
   npm run fetch
   ```
3. Start the API server:
   ```
   npm start
   ```

## API Endpoints

- `GET /api/news?category=Technology&source=TechCrunch`  
  Returns news articles, optionally filtered by category or source.
- `GET /api/categories`  
  Returns a list of categories.
- `GET /api/sources`  
  Returns a list of sources.

## Notes
- The database file is stored at `backend/news.db`.
- Feeds are defined in `src/feeds.js`.
- For MVP, deduplication is by article link. 