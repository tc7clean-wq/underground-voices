import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('https://yyawiqaqsclsyqjqvwbg.supabase.co/rest/v1/articles', {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YXdpcWFxc2Nsc3lxanF2d2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDU1NjMsImV4cCI6MjA3MzYyMTU2M30.eyoSmpwxmpWzHjO5ND1XK3D-22gT1a2XJE6CeBrMsNE',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YXdpcWFxc2Nsc3lxanF2d2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDU1NjMsImV4cCI6MjA3MzYyMTU2M30.eyoSmpwxmpWzHjO5ND1XK3D-22gT1a2XJE6CeBrMsNE',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Underground Voices</h1>
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Underground Voices</h1>
        <p>Error: {error}</p>
        <button onClick={fetchArticles}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Underground Voices</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>
        A secure platform for underground journalists
      </p>

      <div style={{ marginBottom: '20px' }}>
        <h2>Articles ({articles.length})</h2>
      </div>

      {articles.map(article => (
        <div
          key={article.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>
            {article.title}
          </h3>
          <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0' }}>
            By {article.is_anonymous ? 'Anonymous' : article.author} •
            {new Date(article.created_at).toLocaleDateString()}
            {article.verified && <span style={{ color: 'green', marginLeft: '10px' }}>✓ Verified</span>}
          </p>
          <p style={{ lineHeight: '1.5', margin: '0 0 10px 0' }}>
            {article.content}
          </p>
          {article.tags && article.tags.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    marginRight: '5px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {article.sources && article.sources.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <strong>Sources:</strong>
              {article.sources.map((source, index) => (
                <a
                  key={index}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: '10px', color: '#1976d2' }}
                >
                  Link {index + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}

      {articles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No articles found. The database connection is working but there are no articles to display.</p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', borderTop: '1px solid #ddd' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Underground Voices • Connecting journalists worldwide
        </p>
      </div>
    </div>
  );
}

export default App;