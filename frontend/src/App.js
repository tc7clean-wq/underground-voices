import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Profile from './components/Auth/Profile';
import ArticleList from './components/Articles/ArticleList';
import ArticleForm from './components/Articles/ArticleForm';
import ArticleFormEnhanced from './components/Articles/ArticleFormEnhanced';
import StoryboardCanvas from './components/Storyboard/StoryboardCanvas';

// Import services
import { authAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user profile
      authAPI.getProfile()
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Underground Voices</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header user={user} onLogout={handleLogout} />

        <main style={{ flex: 1, paddingTop: '80px' }}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/register"
              element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/reset-password"
              element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />}
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={user ? <ArticleList /> : <Navigate to="/login" />}
            />
            <Route
              path="/articles"
              element={user ? <ArticleList /> : <Navigate to="/login" />}
            />
            <Route
              path="/articles/new"
              element={user ? <ArticleFormEnhanced /> : <Navigate to="/login" />}
            />
            <Route
              path="/articles/create"
              element={user ? <ArticleForm /> : <Navigate to="/login" />}
            />
            <Route
              path="/storyboard"
              element={user ? <StoryboardCanvas /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile user={user} /> : <Navigate to="/login" />}
            />

            {/* Default routes */}
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />

            {/* Public article view for non-authenticated users */}
            <Route
              path="/public"
              element={<PublicArticleView />}
            />
          </Routes>
        </main>

        <Footer />

        {/* Global styles */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: #f8fafc;
          }

          .App {
            text-align: left;
          }
        `}</style>
      </div>
    </Router>
  );
}

// Public article view component for non-authenticated users
const PublicArticleView = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicArticles();
  }, []);

  const fetchPublicArticles = async () => {
    try {
      // Direct Supabase API call for public articles
      const response = await fetch('https://yyawiqaqsclsyqjqvwbg.supabase.co/rest/v1/articles?select=*', {
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
        <h1>Underground Voices - Public Articles</h1>
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Underground Voices - Public Articles</h1>
        <p>Error: {error}</p>
        <button onClick={fetchPublicArticles}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Underground Voices</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>
        A secure platform for underground journalists
      </p>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Want to contribute? <a href="/register" style={{ color: '#2563eb' }}>Join our community</a>
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Latest Articles ({articles.length})</h2>
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
    </div>
  );
};

export default App;