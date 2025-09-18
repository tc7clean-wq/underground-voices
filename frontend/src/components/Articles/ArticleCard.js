import React, { useState } from 'react';
import { articlesAPI } from '../../services/api';

const ArticleCard = ({ article, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await articlesAPI.delete(article.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerify = async () => {
    try {
      // This would typically verify the article against NewsAPI
      // For now, we'll just show a message
      alert('Verification feature coming soon!');
    } catch (error) {
      console.error('Error verifying article:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {article.title}
          </h3>
          {article.verified && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ Verified
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>By {article.is_anonymous ? 'Anonymous' : article.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(article.created_at)}</span>
        </div>

        {/* Content Preview */}
        <div className="text-gray-600 dark:text-gray-300 mb-4">
          {showFullContent ? (
            <p className="whitespace-pre-wrap">{article.content}</p>
          ) : (
            <p className="line-clamp-3">{article.content}</p>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Sources */}
        {article.sources && article.sources.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sources:</h4>
            <div className="space-y-1">
              {article.sources.map((source, index) => (
                <a
                  key={index}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline block truncate"
                >
                  {source}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showFullContent ? 'Show Less' : 'Read More'}
            </button>
            {!article.verified && (
              <button
                onClick={handleVerify}
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Verify
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
