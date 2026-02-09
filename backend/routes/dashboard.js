const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /stats - dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    // Get connections count
    const connectionsResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM connections
       WHERE (requester_id = $1 OR receiver_id = $1) AND status = 'accepted'`,
      [userId],
    );

    // Get unread messages count
    const unreadResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM messages
       WHERE receiver_id = $1 AND read = false`,
      [userId],
    );

    // Get open suggestions count
    const suggestionsResult = await pool.query(
      `SELECT COUNT(*) as count
       FROM suggestions
       WHERE status = 'open'`,
    );

    res.json({
      data: {
        connectionsCount: parseInt(connectionsResult.rows[0].count, 10),
        unreadMessages: parseInt(unreadResult.rows[0].count, 10),
        suggestionsCount: parseInt(suggestionsResult.rows[0].count, 10),
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Failed to get dashboard stats' });
  }
});

// GET /activity - recent activity feed
router.get('/activity', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    // Get recent activity: new connections, new suggestions, new members
    const activities = [];

    // Recent connections accepted (involving current user)
    const connectionsResult = await pool.query(
      `SELECT
        u.first_name as actor_first_name,
        u.last_name as actor_last_name,
        'connected with you' as action,
        c.created_at as timestamp
       FROM connections c
       JOIN users u ON (
         CASE WHEN c.requester_id = $1 THEN c.receiver_id ELSE c.requester_id END = u.id
       )
       WHERE (c.requester_id = $1 OR c.receiver_id = $1) AND c.status = 'accepted'
       ORDER BY c.created_at DESC
       LIMIT 5`,
      [userId],
    );
    activities.push(...connectionsResult.rows);

    // Recent suggestions
    const suggestionsResult = await pool.query(
      `SELECT
        u.first_name as actor_first_name,
        u.last_name as actor_last_name,
        'submitted a new idea: ' || s.title as action,
        s.created_at as timestamp
       FROM suggestions s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC
       LIMIT 5`,
    );
    activities.push(...suggestionsResult.rows);

    // Recent new members
    const membersResult = await pool.query(
      `SELECT
        first_name as actor_first_name,
        last_name as actor_last_name,
        'joined VineyardConnect' as action,
        created_at as timestamp
       FROM users
       WHERE id != $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId],
    );
    activities.push(...membersResult.rows);

    // Sort all activities by timestamp, most recent first
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Return top 10
    res.json({ data: activities.slice(0, 10) });
  } catch (err) {
    console.error('Dashboard activity error:', err);
    res.status(500).json({ message: 'Failed to get dashboard activity' });
  }
});

module.exports = router;
