const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { caption, category, media_type, media_url, color, emoji } = req.body;

    if (!media_url) {
      return res.status(400).json({ error: 'Media URL is required' });
    }

    const result = await pool.query(
      `INSERT INTO gallery_posts (user_id, caption, category, media_type, media_url, color, emoji)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.userId, caption, category, media_type || 'photo', media_url, color, emoji]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create gallery post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = `SELECT gp.*, u.name as user_name, u.avatar FROM gallery_posts gp
           JOIN users u ON gp.user_id = u.id`;
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push(`gp.category = $${params.length + 1}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(gp.caption ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY gp.created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get gallery posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT gp.*, u.name as user_name, u.avatar FROM gallery_posts gp JOIN users u ON gp.user_id = u.id WHERE gp.id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get gallery post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, category } = req.body;

    const post = await pool.query('SELECT user_id FROM gallery_posts WHERE id = $1', [id]);

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery post not found' });
    }

    if (post.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only edit your own gallery posts' });
    }

    const result = await pool.query(
      `UPDATE gallery_posts SET
        caption = COALESCE($1, caption),
        category = COALESCE($2, category)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [caption, category, id, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update gallery post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await pool.query('SELECT user_id FROM gallery_posts WHERE id = $1', [id]);

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery post not found' });
    }

    if (post.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own gallery posts' });
    }

    await pool.query('DELETE FROM gallery_posts WHERE id = $1 AND user_id = $2', [id, req.userId]);

    res.json({ message: 'Gallery post deleted' });
  } catch (error) {
    console.error('Delete gallery post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE gallery_posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Like gallery post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await pool.query('SELECT id FROM gallery_posts WHERE id = $1', [id]);

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Gallery post not found' });
    }

    const result = await pool.query(
      'INSERT INTO gallery_comments (gallery_post_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
      [id, req.userId, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create gallery comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT gc.*, u.name as user_name, u.avatar FROM gallery_comments gc
       JOIN users u ON gc.user_id = u.id
       WHERE gc.gallery_post_id = $1
       ORDER BY gc.created_at DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get gallery comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
