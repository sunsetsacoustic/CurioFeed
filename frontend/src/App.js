import './App.css';
import { useState, useEffect } from 'react';

const categories = [
  'Technology',
  'Software',
  'Hardware',
  'AI',
  'Cybersecurity'
];

const sources = [
  'TechCrunch',
  'The Verge',
  'Wired',
  'Ars Technica',
  'Hacker News'
];

const TABS = [
  { label: 'RSS Feed', value: 'rss' },
  { label: 'NewsAPI', value: 'newsapi' }
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('rss');

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      let url = selectedTab === 'newsapi'
        ? 'http://localhost:4000/api/newsapi'
        : 'http://localhost:4000/api/news';
      const params = [];
      if (selectedCategory !== 'All') params.push(`category=${encodeURIComponent(selectedCategory)}`);
      if (selectedSource !== 'All') params.push(`source=${encodeURIComponent(selectedSource)}`);
      if (params.length) url += '?' + params.join('&');
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch news');
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [selectedCategory, selectedSource, selectedTab]);

  return (
    <div className="App">
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.value}
            className={`tab-btn${selectedTab === tab.value ? ' active' : ''}`}
            onClick={() => setSelectedTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <nav className="navbar">
        <div className="nav-section">
          <span className="nav-label">Categories:</span>
          <button className={selectedCategory === 'All' ? 'active' : ''} onClick={() => setSelectedCategory('All')}>All</button>
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="nav-section">
          <span className="nav-label">Sources:</span>
          <button className={selectedSource === 'All' ? 'active' : ''} onClick={() => setSelectedSource('All')}>All</button>
          {sources.map(src => (
            <button
              key={src}
              className={selectedSource === src ? 'active' : ''}
              onClick={() => setSelectedSource(src)}
            >
              {src}
            </button>
          ))}
        </div>
      </nav>
      <main className="main-content">
        {loading && <p>Loading news...</p>}
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        {!loading && !error && articles.length === 0 && <p>No articles found.</p>}
        <ul className="news-list">
          {articles.map(article => (
            <li key={article.link} className="news-item">
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="news-title">{article.title}</a>
              <div className="news-meta">
                <span className="news-source">{article.source}</span>
                <span className="news-date">{article.pubDate ? new Date(article.pubDate).toLocaleString() : ''}</span>
              </div>
              {article.snippet && <p className="news-snippet">{article.snippet}</p>}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
