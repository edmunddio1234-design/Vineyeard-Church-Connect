const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { category, title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Suggestion title is required' });
    }

    const result = await pool.query(
      `INSERT INTO suggestions (user_id, category, title, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.userId, category, title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create suggestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = `SELECT s.*, u.name as user_name, u.avatar FROM suggestions s
           JOIN users u ON s.user_id = u.id`;
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push(`s.category = $${params.length + 1}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(s.title ILIKE $${params.length + 1} OR s.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'votes') {
      query += ' ORDER BY s.votes DESC';
    } else {
      query += ' ORDER BY s.created_at DESC';
    }

    query += ' LIMIT 100';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT s.*, u.name as user_name, u.avatar FROM suggestions s JOIN users u ON s.user_id = u.id WHERE s.id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get suggestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const suggestion = await pool.query('SELECT user_id FROM suggestions WHERE id = $1', [id]);

    if (suggestion.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    if (suggestion.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only edit your own suggestions' });
    }

    const result = await pool.query(
      `UPDATE suggestions SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, description, category, id, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update suggestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const suggestion = await pool.query('SELECT user_id FROM suggestions WHERE id = $1', [id]);

    if (suggestion.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    if (suggestion.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own suggestions' });
    }

    await pool.query('DELETE FROM suggestions WHERE id = $1 AND user_id = $2', [id, req.userId]);

    res.json({ message: 'Suggestion deleted' });
  } catch (error) {
    console.error('Delete suggestion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE suggestions SET votes = votes + 1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Vote error:', error);
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

    const suggestion = await pool.query('SELECT id FROM suggestions WHERE id = $1', [id]);

    if (suggestion.rows.length === 0) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    const result = await pool.query(
      'INSERT INTO suggestion_comments (suggestion_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
      [id, req.userId, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create suggestion comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sc.*, u.name as user_name, u.avatar FROM suggestion_comments sc
       JOIN users u ON sc.user_id = u.id
       WHERE sc.suggestion_id = $1
       ORDER BY sc.created_at DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get suggestion comments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
