const express = require('express');
const axios = require('axios');
const { body, query, param, validationResult } = require('express-validator');
const { supabase } = require('../models/database');

const router = express.Router();

// Get all articles with search and filtering
router.get('/', [
  query('search').optional().trim().escape(),
  query('author').optional().trim().escape(),
  query('tag').optional().trim().escape(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { search, author, dateFrom, dateTo, tag, limit = 50 } = req.query;

    let query = supabase
      .from('articles')
      .select('*');

    // Add search functionality - use parameterized queries
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.or(`title.ilike.${searchTerm}, content.ilike.${searchTerm}`);
    }

    // Filter by author
    if (author) {
      query = query.ilike('author', `%${author}%`);
    }

    // Filter by date range
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    // Filter by tag (if tags array contains the tag)
    if (tag) {
      query = query.contains('tags', [tag]);
    }

    // Apply limit and order
    query = query
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    const { data: articles, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unique tags for filtering
router.get('/tags', async (req, res) => {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select('tags');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Extract unique tags from all articles
    const allTags = articles.reduce((tags, article) => {
      if (article.tags) {
        tags.push(...article.tags);
      }
      return tags;
    }, []);

    const uniqueTags = [...new Set(allTags)].sort();

    res.json(uniqueTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token for protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Get article by ID
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid article ID format')
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new article (protected)
router.post('/', authenticateToken, [
  body('title').isLength({ min: 1, max: 200 }).trim().escape(),
  body('content').isLength({ min: 10 }).trim(),
  body('author').isLength({ min: 1, max: 100 }).trim().escape(),
  body('tags').optional().isArray(),
  body('sources').optional().isArray()
], async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, content, author, isAnonymous, tags, sources } = req.body;
    
    // Create article in database
    const { data: article, error } = await supabase
      .from('articles')
      .insert([
        {
          title,
          content,
          author,
          is_anonymous: isAnonymous || false,
          tags: tags || [],
          sources: sources || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(article[0]);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update article (protected)
router.put('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Invalid article ID format'),
  body('title').optional().isLength({ min: 1, max: 200 }).trim().escape(),
  body('content').optional().isLength({ min: 10 }).trim()
], async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { title, content, tags, sources } = req.body;
    
    const { data: article, error } = await supabase
      .from('articles')
      .update({
        title,
        content,
        tags,
        sources,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (!article || article.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article[0]);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete article (protected)
router.delete('/:id', authenticateToken, [
  param('id').isUUID().withMessage('Invalid article ID format')
], async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify article against NewsAPI
router.post('/verify', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Call NewsAPI to verify the article
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: url,
        apiKey: process.env.NEWS_API_KEY,
        sortBy: 'relevancy',
        pageSize: 10
      }
    });
    
    // Check if the article appears in trusted sources
    const trustedSources = ['reuters.com', 'ap.org', 'bbc.com', 'npr.org'];
    const isVerified = response.data.articles.some(article => 
      trustedSources.some(source => article.url.includes(source))
    );
    
    res.json({
      verified: isVerified,
      sources: response.data.articles.slice(0, 5),
      message: isVerified ? 'Article verified against trusted sources' : 'Article not found in trusted sources'
    });
    
  } catch (error) {
    console.error('Error verifying article:', error);
    res.status(500).json({ error: 'Failed to verify article' });
  }
});

module.exports = router;
