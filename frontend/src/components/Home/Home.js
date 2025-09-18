import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articlesAPI } from '../../services/api';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [stats, setStats] = useState({
    totalArticles: 0,
    recentArticles: 0,
    userArticles: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is new (show tour)
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour && user) {
      setShowTour(true);
    }
  }, [user]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [articlesResponse] = await Promise.all([
        articlesAPI.getAll({ limit: 5 })
      ]);

      const articles = articlesResponse.data || [];
      setRecentActivity(articles.slice(0, 3));
      setStats({
        totalArticles: articles.length,
        recentArticles: articles.filter(a =>
          new Date(a.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        userArticles: articles.filter(a => a.author === user?.username).length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Submit New Tip',
      description: 'Report something you\'ve witnessed',
      icon: '📝',
      path: '/articles/new',
      color: 'bg-blue-500 hover:bg-blue-600',
      urgent: true
    },
    {
      title: 'Browse Cases',
      description: 'View ongoing investigations',
      icon: '🔍',
      path: '/articles',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Connect the Dots',
      description: 'Visual investigation mapping',
      icon: '🕸️',
      path: '/storyboard',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'My Profile',
      description: 'Manage account settings',
      icon: '👤',
      path: '/profile',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  const tourSteps = [
    {
      target: '.quick-actions',
      title: 'Quick Actions',
      content: 'Start here! These buttons give you instant access to the most common tasks.'
    },
    {
      target: '.submit-tip',
      title: 'Submit Tips Safely',
      content: 'Click here to securely and anonymously report what you\'ve witnessed.'
    },
    {
      target: '.dashboard-stats',
      title: 'Stay Informed',
      content: 'Track community activity and see how your contributions make a difference.'
    }
  ];

  const nextTourStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
      localStorage.setItem('hasSeenTour', 'true');
    }
  };

  const skipTour = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const getSuggestions = () => {
    const suggestions = [];

    if (stats.userArticles === 0) {
      suggestions.push({
        text: "New here? Start by submitting your first tip",
        action: () => navigate('/articles/new'),
        icon: '🌟'
      });
    }

    if (stats.userArticles > 0 && stats.userArticles < 3) {
      suggestions.push({
        text: "Try the visual storyboard to connect your investigations",
        action: () => navigate('/storyboard'),
        icon: '🔗'
      });
    }

    if (recentActivity.length > 0) {
      suggestions.push({
        text: `${stats.recentArticles} new tips this week - check what's happening`,
        action: () => navigate('/articles'),
        icon: '📈'
      });
    }

    return suggestions;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.username || 'Anonymous'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your secure platform for underground journalism and investigation
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="quick-actions mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} ${index === 0 ? 'submit-tip' : ''} text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
              {action.urgent && (
                <div className="mt-3">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">
                    Quick Start
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="dashboard-stats mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Community Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.totalArticles}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tips Submitted</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.recentArticles}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">New This Week</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.userArticles}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Your Contributions</div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      {getSuggestions().length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Suggested Actions
          </h2>
          <div className="space-y-3">
            {getSuggestions().map((suggestion, index) => (
              <div
                key={index}
                onClick={suggestion.action}
                className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{suggestion.icon}</span>
                  <span className="text-blue-800 dark:text-blue-200">{suggestion.text}</span>
                  <span className="ml-auto text-blue-600 dark:text-blue-400">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              to="/articles"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      By {article.is_anonymous ? 'Anonymous' : article.author} •
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {article.verified && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guided Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tourSteps[tourStep].title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tourStep + 1} of {tourSteps.length}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {tourSteps[tourStep].content}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={skipTour}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Skip tour
              </button>
              <button
                onClick={nextTourStep}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {tourStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Reminder */}
      <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
        <div className="flex items-start">
          <span className="text-yellow-600 dark:text-yellow-400 mr-3">🔒</span>
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              Security Reminder
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Always use secure networks and consider using a VPN when submitting sensitive information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;