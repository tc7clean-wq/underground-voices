import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/midnight-theme.css';

// Import components
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import ToastContainer from './components/Common/ToastContainer';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';
// Lazy load components for better performance
const Home = lazy(() => import('./components/Home/Home'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));
const Profile = lazy(() => import('./components/Auth/Profile'));
const ArticleList = lazy(() => import('./components/Articles/ArticleList'));
const ArticleForm = lazy(() => import('./components/Articles/ArticleForm'));
const ArticleFormEnhanced = lazy(() => import('./components/Articles/ArticleFormEnhanced'));
const StoryboardCanvas = lazy(() => import('./components/Storyboard/StoryboardCanvas'));

// Import contexts
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';

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
      <LoadingSpinner
        fullScreen={true}
        size="xlarge"
        color="white"
        message="Loading Underground Voices..."
      />
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
          <div className="App midnight-theme" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header user={user} onLogout={handleLogout} />

            <main style={{ flex: 1, paddingTop: '80px' }}>
            <Suspense fallback={<LoadingSpinner size="large" message="Loading page..." />}>
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
              element={user ? <Home user={user} /> : <Navigate to="/login" />}
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
            </Suspense>
            </main>

        <Footer />
        <ToastContainer />

        {/* Global styles */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background: linear-gradient(135deg, #1e3a8a 0%, #334155 100%);
            color: #f1f5f9;
            min-height: 100vh;
          }

          .App {
            text-align: left;
          }

          /* Toast animations */
          @keyframes slide-in-right {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }

          @keyframes shrink {
            0% { width: 100%; }
            100% { width: 0%; }
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.3s ease-out forwards;
          }
        `}</style>
            </div>
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
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
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/articles?select=*`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
          'apikey': process.env.REACT_APP_SUPABASE_ANON_KEY,
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