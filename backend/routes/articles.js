const express = require('express');
const axios = require('axios');
const { supabase } = require('../models/database');

const router = express.Router();

// Get all articles with search and filtering
router.get('/', async (req, res) => {
  try {
    const { search, author, dateFrom, dateTo, tag, limit = 50 } = req.query;

    let query = supabase
      .from('articles')
      .select('*');

    // Add search functionality
    if (search) {
      // Search in title and content using ilike (case-insensitive)
      query = query.or(`title.ilike.%${search}%, content.ilike.%${search}%`);
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

// Get article by ID
router.get('/:id', async (req, res) => {
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

// Create new article
router.post('/', async (req, res) => {
  try {
    const { title, content, author, isAnonymous, tags, sources } = req.body;
    
    // Validate required fields
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }
    
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

// Update article
router.put('/:id', async (req, res) => {
  try {
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

// Delete article
router.delete('/:id', async (req, res) => {
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
