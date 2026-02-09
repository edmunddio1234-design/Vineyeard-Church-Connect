const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET / - get list of conversations with last message preview
router.get('/', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT DISTINCT ON (other_user_id)
        sub.other_user_id as id,
        sub.other_user_id,
        u.first_name as other_user_first_name,
        u.last_name as other_user_last_name,
        u.profile_image as other_user_profile_image,
        sub.content as last_message,
        sub.created_at as last_message_time,
        sub.read,
        sub.sender_id
      FROM (
        SELECT
          CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_user_id,
          content,
          created_at,
          read,
          sender_id
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
        ORDER BY other_user_id, created_at DESC
      ) sub
      JOIN users u ON sub.other_user_id = u.id
      ORDER BY sub.other_user_id, sub.created_at DESC
      `,
      [userId],
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ message: 'Failed to get conversations' });
  }
});

// GET /:id/messages - get all messages in a conversation
// :id here is the other user's id (the conversation partner)
router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const otherUserId = parseInt(req.params.id);
    const currentUserId = req.user.id;

    // Get all messages between the two users
    const result = await pool.query(
      `
      SELECT id, sender_id, receiver_id, content, read, created_at
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
      `,
      [currentUserId, otherUserId],
    );

    // Mark unread messages as read
    await pool.query(
      `
      UPDATE messages
      SET read = true
      WHERE receiver_id = $1 AND sender_id = $2 AND read = false
      `,
      [currentUserId, otherUserId],
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Get conversation messages error:', err);
    res.status(500).json({ message: 'Failed to get messages' });
  }
});

// POST /:id/messages - send message in a conversation
router.post(
  '/:id/messages',
  authMiddleware,
  [
    body('content').trim().notEmpty().withMessage('Message content is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const receiverId = parseInt(req.params.id);
      const senderId = req.user.id;
      const { content } = req.body;

      // Check if receiver exists
      const receiverCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [receiverId],
      );

      if (receiverCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Receiver not found' });
      }

      if (senderId === receiverId) {
        return res.status(400).json({ message: 'Cannot send message to yourself' });
      }

      // Insert message
      const result = await pool.query(
        `
        INSERT INTO messages (sender_id, receiver_id, content, read)
        VALUES ($1, $2, $3, false)
        RETURNING id, sender_id, receiver_id, content, read, created_at
        `,
        [senderId, receiverId, content],
      );

      res.status(201).json({ data: result.rows[0] });
    } catch (err) {
      console.error('Send conversation message error:', err);
      res.status(500).json({ message: 'Failed to send message' });
    }
  },
);

module.exports = router;
