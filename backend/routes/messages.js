const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { to_user_id, text } = req.body;

    if (!to_user_id || !text) {
      return res.status(400).json({ error: 'to_user_id and text are required' });
    }

    const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [to_user_id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    const result = await pool.query(
      'INSERT INTO messages (from_user_id, to_user_id, text) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, to_user_id, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/conversation/:other_user_id', auth, async (req, res) => {
  try {
    const { other_user_id } = req.params;

    const result = await pool.query(
      `SELECT m.*,
              u1.name as from_user_name, u1.avatar as from_user_avatar,
              u2.name as to_user_name, u2.avatar as to_user_avatar
       FROM messages m
       JOIN users u1 ON m.from_user_id = u1.id
       JOIN users u2 ON m.to_user_id = u2.id
       WHERE (m.from_user_id = $1 AND m.to_user_id = $2)
          OR (m.from_user_id = $2 AND m.to_user_id = $1)
       ORDER BY m.created_at ASC
       LIMIT 100`,
      [req.userId, other_user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (least(m.from_user_id, m.to_user_id), greatest(m.from_user_id, m.to_user_id))
              m.*,
              CASE
                WHEN m.from_user_id = $1 THEN u2.name
                ELSE u1.name
              END as other_user_name,
              CASE
                WHEN m.from_user_id = $1 THEN u2.avatar
                ELSE u1.avatar
              END as other_user_avatar,
              CASE
                WHEN m.from_user_id = $1 THEN m.to_user_id
                ELSE m.from_user_id
              END as other_user_id
       FROM messages m
       JOIN users u1 ON m.from_user_id = u1.id
       JOIN users u2 ON m.to_user_id = u2.id
       WHERE m.from_user_id = $1 OR m.to_user_id = $1
       ORDER BY least(m.from_user_id, m.to_user_id), greatest(m.from_user_id, m.to_user_id), m.created_at DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
