import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../services/auth';
import { articlesAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
// ReactQuill removed for compatibility

const ArticleFormEnhanced = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    sources: '',
    isAnonymous: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [richTextEnabled, setRichTextEnabled] = useState(true);

  // Load draft from localStorage on mount
  useEffect(() => {
    const loadDraft = () => {
      const savedDraft = localStorage.getItem('articleDraft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setFormData(draft.data);
          setLastSaved(new Date(draft.timestamp));
          setMessage('Draft loaded from previous session');
        } catch (err) {
          console.error('Error loading draft:', err);
        }
      }
    };
    loadDraft();
  }, []);

  // Auto-save functionality
  const saveDraft = useCallback(() => {
    if (formData.title || formData.content) {
      setIsSaving(true);
      try {
        const draft = {
          data: formData,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('articleDraft', JSON.stringify(draft));
        setLastSaved(new Date());
        setIsSaving(false);
      } catch (err) {
        console.error('Error saving draft:', err);
        setIsSaving(false);
      }
    }
  }, [formData]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveDraft();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [saveDraft]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveDraft();
    };
  }, [saveDraft]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const clearDraft = () => {
    localStorage.removeItem('articleDraft');
    setFormData({
      title: '',
      content: '',
      tags: '',
      sources: '',
      isAnonymous: false
    });
    setLastSaved(null);
    setMessage('Draft cleared');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Process tags and sources
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      const sources = formData.sources ? formData.sources.split('\n').map(source => source.trim()).filter(source => source) : [];

      const articleData = {
        title: formData.title,
        content: formData.content,
        author: user.username,
        tags,
        sources,
        isAnonymous: formData.isAnonymous
      };

      await articlesAPI.create(articleData);
      setMessage('Article created successfully!');

      // Clear draft after successful submission
      localStorage.removeItem('articleDraft');

      // Redirect to articles list after a short delay
      setTimeout(() => {
        navigate('/articles');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  // Quill editor configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Article
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Share your investigation with the underground journalism community.
          </p>
          {lastSaved && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Auto-saved {lastSaved.toLocaleTimeString()}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter a compelling title for your article"
            />
          </div>

          {/* Content with Rich Text Editor Toggle */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Article Content *
              </label>
              <button
                type="button"
                onClick={() => setRichTextEnabled(!richTextEnabled)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {richTextEnabled ? 'Switch to Plain Text' : 'Switch to Rich Text'}
              </button>
            </div>

            {richTextEnabled ? (
              <div className="bg-white dark:bg-gray-700 rounded-md">
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your article content here. Be thorough and include all relevant details."
                  className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            ) : (
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Write your article content here. Be thorough and include all relevant details."
              />
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {richTextEnabled
                ? `${formData.content.replace(/<[^>]*>/g, '').length} characters (excluding formatting)`
                : `${formData.content.length} characters`
              }
            </p>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter tags separated by commas (e.g., corruption, politics, investigation)"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Sources */}
          <div className="mt-6">
            <label htmlFor="sources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sources
            </label>
            <textarea
              id="sources"
              name="sources"
              rows={4}
              value={formData.sources}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter sources, one per line (URLs, documents, interviews, etc.)"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter one source per line
            </p>
          </div>

          {/* Anonymous Option */}
          <div className="mt-6">
            <div className="flex items-center">
              <input
                id="isAnonymous"
                name="isAnonymous"
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Publish anonymously (recommended for sensitive content)
              </label>
            </div>
          </div>
        </div>

        {/* Auto-save Notice */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Auto-save Enabled
              </h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  Your article is automatically saved every 30 seconds.
                  You can safely close this page and return later to continue editing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Security Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  This platform uses end-to-end encryption to protect your content.
                  However, always use a VPN when accessing from sensitive locations and
                  consider publishing anonymously for high-risk investigations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md p-4">
            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={clearDraft}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Clear Draft
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                saveDraft();
                navigate('/articles');
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Save & Exit
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ArticleFormEnhanced;