const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { anonymous, category, title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Prayer request title is required' });
    }

    const result = await pool.query(
      `INSERT INTO prayer_requests (user_id, anonymous, category, title, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.userId, anonymous || false, category, title, description]
    );

    const prayerRequest = result.rows[0];

    // Notify all prayer team members (except the requester)
    try {
      const teamMembers = await pool.query(
        'SELECT id, name, email FROM users WHERE on_prayer_team = true AND id != $1',
        [req.userId]
      );

      if (teamMembers.rows.length > 0) {
        const requesterName = anonymous ? 'Anonymous' : (await pool.query('SELECT name FROM users WHERE id = $1', [req.userId])).rows[0]?.name || 'A member';
        const notifTitle = 'New Prayer Request';
        const notifMessage = `${requesterName} submitted a prayer request: "${title}"${category ? ` (${category})` : ''}`;

        // Insert a notification for each prayer team member
        const notifValues = teamMembers.rows.map((m, i) => {
          const offset = i * 5;
          return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
        }).join(', ');

        const notifParams = teamMembers.rows.flatMap(m => [
          m.id, 'prayer_request', notifTitle, notifMessage, prayerRequest.id
        ]);

        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, related_id) VALUES ${notifValues}`,
          notifParams
        );
      }
    } catch (notifError) {
      // Don't fail the prayer request if notifications fail
      console.error('Failed to notify prayer team:', notifError);
    }

    res.status(201).json(prayerRequest);
  } catch (error) {
    console.error('Create prayer request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, answered, search } = req.query;
    let query = `SELECT pr.*,
                  CASE WHEN pr.anonymous = true THEN 'Anonymous' ELSE u.name END as user_name,
                  CASE WHEN pr.anonymous = true THEN NULL ELSE u.avatar END as user_avatar
           FROM prayer_requests pr
           LEFT JOIN users u ON pr.user_id = u.id`;
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push(`pr.category = $${params.length + 1}`);
      params.push(category);
    }

    if (answered !== undefined) {
      conditions.push(`pr.answered = $${params.length + 1}`);
      params.push(answered === 'true');
    }

    if (search) {
      conditions.push(`(pr.title ILIKE $${params.length + 1} OR pr.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY pr.created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get prayer requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*,
              CASE WHEN pr.anonymous = true THEN 'Anonymous' ELSE u.name END as user_name,
              CASE WHEN pr.anonymous = true THEN NULL ELSE u.avatar END as user_avatar
       FROM prayer_requests pr
       LEFT JOIN users u ON pr.user_id = u.id
       WHERE pr.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get prayer request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, answered } = req.body;

    const request = await pool.query('SELECT user_id FROM prayer_requests WHERE id = $1', [id]);

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    if (request.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only edit your own prayer requests' });
    }

    const result = await pool.query(
      `UPDATE prayer_requests SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        answered = COALESCE($4, answered)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description, category, answered, id, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update prayer request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/pray', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE prayer_requests SET prayer_count = prayer_count + 1 WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Pray error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await pool.query('SELECT user_id FROM prayer_requests WHERE id = $1', [id]);

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    if (request.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own prayer requests' });
    }

    await pool.query('DELETE FROM prayer_requests WHERE id = $1 AND user_id = $2', [id, req.userId]);

    res.json({ message: 'Prayer request deleted' });
  } catch (error) {
    console.error('Delete prayer request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/responses', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Response text is required' });
    }

    const request = await pool.query('SELECT id FROM prayer_requests WHERE id = $1', [id]);

    if (request.rows.length === 0) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    const result = await pool.query(
      'INSERT INTO prayer_responses (prayer_request_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
      [id, req.userId, text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create prayer response error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/responses', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*, u.name as user_name, u.avatar FROM prayer_responses pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.prayer_request_id = $1
       ORDER BY pr.created_at DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get prayer responses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
