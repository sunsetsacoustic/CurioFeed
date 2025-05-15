import './App.css';
import { useState } from 'react';

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

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');

  return (
    <div className="App">
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
        {/* News feed will go here */}
        <h2>Welcome to CurioFeed</h2>
        <p>Select a category or source to filter news.</p>
      </main>
    </div>
  );
}

export default App;
