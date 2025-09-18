import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/auth';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Profile from './components/Auth/Profile';
import ArticleList from './components/Articles/ArticleList';
import ArticleFormEnhanced from './components/Articles/ArticleFormEnhanced';
import StoryboardCanvas from './components/Storyboard/StoryboardCanvas';
import './App.css';

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/articles" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
              <Route path="/articles/new" element={<ProtectedRoute><ArticleFormEnhanced /></ProtectedRoute>} />
              <Route path="/storyboard" element={<ProtectedRoute><StoryboardCanvas /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Home page component
function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Underground Voices
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        A secure platform for underground journalists to connect the dots
      </p>
      
      {user ? (
        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-200">
            Welcome back, {user.username}!
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/articles" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              View Articles
            </a>
            <a href="/storyboard" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
              Connect the Dots
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-200">
            Join the underground journalism movement
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/register" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              Get Started
            </a>
            <a href="/login" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
              Sign In
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
