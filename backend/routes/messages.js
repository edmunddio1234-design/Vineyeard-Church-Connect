const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /conversations - get list of conversations with last message preview
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT DISTINCT ON (CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END)
        CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_user_id,
        u.first_name,
        u.last_name,
        u.profile_image,
        m.content as last_message,
        m.created_at as last_message_time,
        m.read,
        m.sender_id
      FROM messages m
      JOIN users u ON (
        CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END = u.id
      )
      WHERE m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY
        CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END,
        m.created_at DESC
      `,
      [userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// GET /:userId - get all messages between current user and specific user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Get all messages
    const result = await pool.query(
      `
      SELECT id, sender_id, receiver_id, content, read, created_at
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
      `,
      [currentUserId, userId],
    );

    // Mark unread messages as read
    await pool.query(
      `
      UPDATE messages
      SET read = true
      WHERE receiver_id = $1 AND sender_id = $2 AND read = false
      `,
      [currentUserId, userId],
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// POST / - send message
router.post(
  '/',
  authMiddleware,
  [
    body('receiver_id').isInt().withMessage('Valid receiver_id is required'),
    body('content').trim().notEmpty().withMessage('Message content is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const { receiver_id, content } = req.body;
      const sender_id = req.user.id;

      // Check if receiver exists
      const receiverCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [receiver_id],
      );

      if (receiverCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Receiver not found' });
      }

      // Check if sender is trying to message themselves
      if (sender_id === receiver_id) {
        return res.status(400).json({ error: 'Cannot send message to yourself' });
      }

      // Insert message
      const result = await pool.query(
        `
        INSERT INTO messages (sender_id, receiver_id, content, read)
        VALUES ($1, $2, $3, false)
        RETURNING id, sender_id, receiver_id, content, read, created_at
        `,
        [sender_id, receiver_id, content],
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Send message error:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  },
);

// GET /unread/count - get count of unread messages
router.get('/unread/count', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT COUNT(*) as unread_count
      FROM messages
      WHERE receiver_id = $1 AND read = false
      `,
      [userId],
    );

    res.json({ unread_count: parseInt(result.rows[0].unread_count, 10) });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

module.exports = router;
