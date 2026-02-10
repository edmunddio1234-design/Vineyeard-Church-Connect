const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { to_user_id } = req.body;

    if (!to_user_id) {
      return res.status(400).json({ error: 'to_user_id is required' });
    }

    if (to_user_id === req.userId) {
      return res.status(400).json({ error: 'Cannot send connection request to yourself' });
    }

    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [to_user_id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingConnection = await pool.query(
      'SELECT id FROM connections WHERE (from_user_id = $1 AND to_user_id = $2) OR (from_user_id = $2 AND to_user_id = $1)',
      [req.userId, to_user_id]
    );

    if (existingConnection.rows.length > 0) {
      return res.status(409).json({ error: 'Connection request already exists' });
    }

    const result = await pool.query(
      'INSERT INTO connections (from_user_id, to_user_id, status) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, to_user_id, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['accepted', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (accepted or declined) is required' });
    }

    const connection = await pool.query(
      'SELECT * FROM connections WHERE id = $1',
      [id]
    );

    if (connection.rows.length === 0) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    if (connection.rows[0].to_user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only respond to requests sent to you' });
    }

    const result = await pool.query(
      'UPDATE connections SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = `SELECT c.*,
                  u1.name as from_user_name, u1.avatar as from_user_avatar,
                  u2.name as to_user_name, u2.avatar as to_user_avatar
           FROM connections c
           JOIN users u1 ON c.from_user_id = u1.id
           JOIN users u2 ON c.to_user_id = u2.id
           WHERE c.from_user_id = $1 OR c.to_user_id = $1`;
    const params = [req.userId];

    if (status) {
      query += ' AND c.status = $2';
      params.push(status);
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/pending/requests', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name as from_user_name, u.avatar as from_user_avatar
       FROM connections c
       JOIN users u ON c.from_user_id = u.id
       WHERE c.to_user_id = $1 AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.query(
      'SELECT * FROM connections WHERE id = $1',
      [id]
    );

    if (connection.rows.length === 0) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (connection.rows[0].from_user_id !== req.userId && connection.rows[0].to_user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own connections' });
    }

    await pool.query('DELETE FROM connections WHERE id = $1', [id]);

    res.json({ message: 'Connection deleted' });
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
