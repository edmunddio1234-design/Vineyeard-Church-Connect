const express = require('express');
const { param, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /request/:userId - send connection request
router.post(
  '/request/:userId',
  authMiddleware,
  [param('userId').isInt().withMessage('Valid userId is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const requesterId = req.user.id;
      const receiverId = parseInt(req.params.userId);

      if (requesterId === receiverId) {
        return res.status(400).json({ message: 'Cannot send connection request to yourself' });
      }

      const receiverCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1',
        [receiverId],
      );

      if (receiverCheck.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingConnection = await pool.query(
        `SELECT id, status FROM connections
         WHERE (requester_id = $1 AND receiver_id = $2) OR (requester_id = $2 AND receiver_id = $1)`,
        [requesterId, receiverId],
      );

      if (existingConnection.rows.length > 0) {
        const existingStatus = existingConnection.rows[0].status;
        if (existingStatus === 'accepted') {
          return res.status(400).json({ message: 'Already connected' });
        }
        return res.status(400).json({ message: `Connection already ${existingStatus}` });
      }

      const result = await pool.query(
        `INSERT INTO connections (requester_id, receiver_id, status)
         VALUES ($1, $2, 'pending')
         RETURNING id, requester_id, receiver_id, status, created_at`,
        [requesterId, receiverId],
      );

      res.status(201).json({ data: result.rows[0] });
    } catch (err) {
      console.error('Send connection request error:', err);
      res.status(500).json({ message: 'Failed to send connection request' });
    }
  },
);

// POST /accept/:id - accept connection request
router.post(
  '/accept/:id',
  authMiddleware,
  [param('id').isInt().withMessage('Valid connection id is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const connectionId = parseInt(req.params.id);
      const userId = req.user.id;

      const connectionCheck = await pool.query(
        'SELECT id, requester_id, receiver_id, status FROM connections WHERE id = $1',
        [connectionId],
      );

      if (connectionCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Connection request not found' });
      }

      const connection = connectionCheck.rows[0];

      if (connection.receiver_id !== userId) {
        return res.status(403).json({ message: 'Cannot accept this connection request' });
      }

      if (connection.status !== 'pending') {
        return res.status(400).json({ message: `Connection is already ${connection.status}` });
      }

      const result = await pool.query(
        `UPDATE connections SET status = 'accepted' WHERE id = $1
         RETURNING id, requester_id, receiver_id, status, created_at`,
        [connectionId],
      );

      res.json({ data: result.rows[0] });
    } catch (err) {
      console.error('Accept connection error:', err);
      res.status(500).json({ message: 'Failed to accept connection' });
    }
  },
);

// POST /decline/:id - decline connection request
router.post(
  '/decline/:id',
  authMiddleware,
  [param('id').isInt().withMessage('Valid connection id is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const connectionId = parseInt(req.params.id);
      const userId = req.user.id;

      const connectionCheck = await pool.query(
        'SELECT id, requester_id, receiver_id, status FROM connections WHERE id = $1',
        [connectionId],
      );

      if (connectionCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Connection request not found' });
      }

      const connection = connectionCheck.rows[0];

      if (connection.receiver_id !== userId) {
        return res.status(403).json({ message: 'Cannot decline this connection request' });
      }

      if (connection.status !== 'pending') {
        return res.status(400).json({ message: `Cannot decline connection with status ${connection.status}` });
      }

      const result = await pool.query(
        `UPDATE connections SET status = 'declined' WHERE id = $1
         RETURNING id, requester_id, receiver_id, status, created_at`,
        [connectionId],
      );

      res.json({ data: result.rows[0] });
    } catch (err) {
      console.error('Decline connection error:', err);
      res.status(500).json({ message: 'Failed to decline connection' });
    }
  },
);

// DELETE /:id - remove connection
router.delete(
  '/:id',
  authMiddleware,
  [param('id').isInt().withMessage('Valid connection id is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const connectionId = parseInt(req.params.id);
      const userId = req.user.id;

      const connectionCheck = await pool.query(
        'SELECT id, requester_id, receiver_id FROM connections WHERE id = $1',
        [connectionId],
      );

      if (connectionCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Connection not found' });
      }

      const connection = connectionCheck.rows[0];

      if (connection.requester_id !== userId && connection.receiver_id !== userId) {
        return res.status(403).json({ message: 'Cannot delete this connection' });
      }

      await pool.query('DELETE FROM connections WHERE id = $1', [connectionId]);

      res.json({ data: { message: 'Connection removed' } });
    } catch (err) {
      console.error('Delete connection error:', err);
      res.status(500).json({ message: 'Failed to delete connection' });
    }
  },
);

// GET /my-connections - get all accepted connections (frontend expects this path)
router.get('/my-connections', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        c.id,
        CASE WHEN requester_id = $1 THEN receiver_id ELSE requester_id END as user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.bio,
        u.profile_image,
        c.created_at
      FROM connections c
      JOIN users u ON (
        CASE WHEN c.requester_id = $1 THEN c.receiver_id ELSE c.requester_id END = u.id
      )
      WHERE (c.requester_id = $1 OR c.receiver_id = $1) AND c.status = 'accepted'
      ORDER BY c.created_at DESC`,
      [userId],
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Get my connections error:', err);
    res.status(500).json({ message: 'Failed to get connections' });
  }
});

// GET /pending-requests - get all pending connection requests received
router.get('/pending-requests', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        c.id,
        c.requester_id,
        u.first_name,
        u.last_name,
        u.email,
        u.bio,
        u.profile_image,
        c.created_at
      FROM connections c
      JOIN users u ON c.requester_id = u.id
      WHERE c.receiver_id = $1 AND c.status = 'pending'
      ORDER BY c.created_at DESC`,
      [userId],
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Get pending requests error:', err);
    res.status(500).json({ message: 'Failed to get pending requests' });
  }
});

// GET /status/:userId - check connection status with specific user
router.get(
  '/status/:userId',
  authMiddleware,
  [param('userId').isInt().withMessage('Valid userId is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const currentUserId = req.user.id;
      const targetUserId = parseInt(req.params.userId);

      const result = await pool.query(
        `SELECT id, requester_id, receiver_id, status, created_at
         FROM connections
         WHERE (requester_id = $1 AND receiver_id = $2) OR (requester_id = $2 AND receiver_id = $1)`,
        [currentUserId, targetUserId],
      );

      if (result.rows.length === 0) {
        return res.json({ data: { status: 'none' } });
      }

      const connection = result.rows[0];
      let connectionStatus = connection.status;
      if (connection.requester_id === currentUserId && connection.status === 'pending') {
        connectionStatus = 'pending_sent';
      } else if (connection.receiver_id === currentUserId && connection.status === 'pending') {
        connectionStatus = 'pending_received';
      }

      res.json({
        data: {
          status: connectionStatus,
          connection_id: connection.id,
          created_at: connection.created_at,
        },
      });
    } catch (err) {
      console.error('Get connection status error:', err);
      res.status(500).json({ message: 'Failed to get connection status' });
    }
  },
);

module.exports = router;
