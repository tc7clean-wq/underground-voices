const express = require('express');
const { supabase } = require('../models/database');

const router = express.Router();

// Get all storyboards
router.get('/', async (req, res) => {
  try {
    const { data: storyboards, error } = await supabase
      .from('storyboards')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json(storyboards);
  } catch (error) {
    console.error('Error fetching storyboards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get storyboard by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: storyboard, error } = await supabase
      .from('storyboards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'Storyboard not found' });
    }
    
    res.json(storyboard);
  } catch (error) {
    console.error('Error fetching storyboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new storyboard
router.post('/', async (req, res) => {
  try {
    const { title, data, author, isPublic } = req.body;
    
    // Validate required fields
    if (!title || !data) {
      return res.status(400).json({ error: 'Title and data are required' });
    }
    
    // Create storyboard in database
    const { data: storyboard, error } = await supabase
      .from('storyboards')
      .insert([
        {
          title,
          data,
          author,
          is_public: isPublic || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(storyboard[0]);
  } catch (error) {
    console.error('Error creating storyboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update storyboard
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, data, isPublic } = req.body;
    
    const { data: storyboard, error } = await supabase
      .from('storyboards')
      .update({
        title,
        data,
        is_public: isPublic,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (!storyboard || storyboard.length === 0) {
      return res.status(404).json({ error: 'Storyboard not found' });
    }
    
    res.json(storyboard[0]);
  } catch (error) {
    console.error('Error updating storyboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete storyboard
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('storyboards')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Storyboard deleted successfully' });
  } catch (error) {
    console.error('Error deleting storyboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Share storyboard (create public link)
router.post('/:id/share', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Update storyboard to be public
    const { data: storyboard, error } = await supabase
      .from('storyboards')
      .update({ is_public: true })
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (!storyboard || storyboard.length === 0) {
      return res.status(404).json({ error: 'Storyboard not found' });
    }
    
    // Generate shareable link
    const shareUrl = `${req.protocol}://${req.get('host')}/storyboard/${id}`;
    
    res.json({
      message: 'Storyboard shared successfully',
      shareUrl,
      storyboard: storyboard[0]
    });
  } catch (error) {
    console.error('Error sharing storyboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
