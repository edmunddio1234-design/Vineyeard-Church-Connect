const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET / - list all users with optional search
router.get('/', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { search } = req.query;

    let query = `
      SELECT id, first_name, last_name, email, bio, age, has_kids, is_retired, groups, hobbies, profile_image, role
      FROM users
    `;
    const params = [];

    if (search) {
      query += ` WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    res.json({ data: result.rows });
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ message: 'Failed to list users' });
  }
});

// GET /:id - get single user by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, bio, age, has_kids, is_retired, groups, hobbies, profile_image, role
       FROM users
       WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Failed to get user' });
  }
});

// PUT /:id - update user profile
router.put(
  '/:id',
  authMiddleware,
  [
    body('first_name').optional().trim().notEmpty(),
    body('last_name').optional().trim().notEmpty(),
    body('bio').optional().trim(),
    body('age').optional().isInt({ min: 0, max: 150 }),
    body('has_kids').optional().isBoolean(),
    body('is_retired').optional().isBoolean(),
    body('groups').optional().isArray(),
    body('hobbies').optional().isArray(),
    body('profile_image').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;

      // Check if user is updating their own profile
      if (req.user.id !== parseInt(id)) {
        return res.status(403).json({ message: 'Cannot update other users profile' });
      }

      const pool = req.app.locals.pool;
      const { first_name, last_name, bio, age, has_kids, is_retired, groups, hobbies, profile_image } = req.body;

      // Build dynamic update query
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (first_name !== undefined) {
        updates.push(`first_name = $${paramCount}`);
        values.push(first_name);
        paramCount++;
      }

      if (last_name !== undefined) {
        updates.push(`last_name = $${paramCount}`);
        values.push(last_name);
        paramCount++;
      }

      if (bio !== undefined) {
        updates.push(`bio = $${paramCount}`);
        values.push(bio);
        paramCount++;
      }

      if (age !== undefined) {
        updates.push(`age = $${paramCount}`);
        values.push(age);
        paramCount++;
      }

      if (has_kids !== undefined) {
        updates.push(`has_kids = $${paramCount}`);
        values.push(has_kids);
        paramCount++;
      }

      if (is_retired !== undefined) {
        updates.push(`is_retired = $${paramCount}`);
        values.push(is_retired);
        paramCount++;
      }

      if (groups !== undefined) {
        updates.push(`groups = $${paramCount}`);
        values.push(groups);
        paramCount++;
      }

      if (hobbies !== undefined) {
        updates.push(`hobbies = $${paramCount}`);
        values.push(hobbies);
        paramCount++;
      }

      if (profile_image !== undefined) {
        updates.push(`profile_image = $${paramCount}`);
        values.push(profile_image);
        paramCount++;
      }

      if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      values.push(id);

      const query = `
        UPDATE users
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, first_name, last_name, email, bio, age, has_kids, is_retired, groups, hobbies, profile_image, role
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ data: result.rows[0] });
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({ message: 'Failed to update user' });
    }
  },
);

module.exports = router;
