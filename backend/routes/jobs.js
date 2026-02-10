const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { title, company, type, category, description, location, salary, urgent } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const result = await pool.query(
      `INSERT INTO jobs (user_id, title, company, type, category, description, location, salary, urgent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.userId, title, company, type, category, description, location, salary, urgent || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, type, location, urgent, search } = req.query;
    let query = 'SELECT j.*, u.name as user_name, u.avatar FROM jobs j JOIN users u ON j.user_id = u.id';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push(`j.category = $${params.length + 1}`);
      params.push(category);
    }

    if (type) {
      conditions.push(`j.type = $${params.length + 1}`);
      params.push(type);
    }

    if (location) {
      conditions.push(`j.location ILIKE $${params.length + 1}`);
      params.push(`%${location}%`);
    }

    if (urgent === 'true') {
      conditions.push('j.urgent = true');
    }

    if (search) {
      conditions.push(`(j.title ILIKE $${params.length + 1} OR j.description ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY j.created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT j.*, u.name as user_name, u.avatar FROM jobs j JOIN users u ON j.user_id = u.id WHERE j.id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, type, category, description, location, salary, urgent } = req.body;

    const job = await pool.query('SELECT user_id FROM jobs WHERE id = $1', [id]);

    if (job.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only edit your own jobs' });
    }

    const result = await pool.query(
      `UPDATE jobs SET
        title = COALESCE($1, title),
        company = COALESCE($2, company),
        type = COALESCE($3, type),
        category = COALESCE($4, category),
        description = COALESCE($5, description),
        location = COALESCE($6, location),
        salary = COALESCE($7, salary),
        urgent = COALESCE($8, urgent)
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title, company, type, category, description, location, salary, urgent, id, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const job = await pool.query('SELECT user_id FROM jobs WHERE id = $1', [id]);

    if (job.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.rows[0].user_id !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own jobs' });
    }

    await pool.query('DELETE FROM jobs WHERE id = $1 AND user_id = $2', [id, req.userId]);

    res.json({ message: 'Job deleted' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
