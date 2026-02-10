const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { location, available, group, search } = req.query;
    let query = 'SELECT id, name, email, avatar, profile_image, phone, location, work, age, has_kids, is_retired, marital_status, birthday, languages, can_drive, dietary, spiritual_gifts, current_groups, desired_groups, hobbies, available, need_help_with, bio, social, joined FROM users WHERE id != $1';
    const params = [req.userId];
    let paramCount = 2;

    if (location) {
      query += ` AND location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (available) {
      query += ` AND available @> $${paramCount}`;
      params.push(`{${available}}`);
      paramCount++;
    }

    if (group) {
      query += ` AND (current_groups @> $${paramCount} OR desired_groups @> $${paramCount})`;
      params.push(`{${group}}`);
      params.push(`{${group}}`);
      paramCount += 2;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR work ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      paramCount += 2;
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
