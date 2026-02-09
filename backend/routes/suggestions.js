const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const VALID_CATEGORIES = ['event', 'ministry', 'outreach', 'facility', 'other', 'general', 'events', 'facilities'];

// GET /categories - return available categories
router.get('/categories', authMiddleware, async (req, res) => {
  try {
    res.json({ data: ['general', 'ministry', 'events', 'outreach', 'facilities'] });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Failed to get categories' });
  }
});

// GET /my-votes - return current user's votes
router.get('/my-votes', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT suggestion_id FROM suggestion_votes WHERE user_id = $1',
      [userId],
    );

    res.json({ data: result.rows });
  } catch (err) {
    console.error('Get my votes error:', err);
    res.status(500).json({ message: 'Failed to get votes' });
  }
});

// POST / - create suggestion
router.post(
  '/',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .isIn(VALID_CATEGORIES)
      .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const { title, description, category } = req.body;
      const userId = req.user.id;

      const result = await pool.query(
        `INSERT INTO suggestions (user_id, title, description, category, status)
         VALUES ($1, $2, $3, $4, 'open')
         RETURNING id, user_id, title, description, category, status, created_at`,
        [userId, title, description, category],
      );

      res.status(201).json({ data: result.rows[0] });
    } catch (err) {
      console.error('Create suggestion error:', err);
      res.status(500).json({ message: 'Failed to create suggestion' });
    }
  },
);

// GET / - list all suggestions with vote count and submitter info
router.get(
  '/',
  authMiddleware,
  [query('category').optional().isIn(VALID_CATEGORIES)],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const { category } = req.query;
      const userId = req.user.id;

      let queryStr = `
        SELECT
          s.id,
          s.user_id,
          s.title,
          s.description,
          s.category,
          s.status,
          s.created_at,
          u.first_name as submitter_first_name,
          u.last_name as submitter_last_name,
          COUNT(sv.id)::int as votes,
          CASE WHEN EXISTS(
            SELECT 1 FROM suggestion_votes
            WHERE suggestion_id = s.id AND user_id = $1
          ) THEN true ELSE false END as user_voted
        FROM suggestions s
        LEFT JOIN suggestion_votes sv ON s.id = sv.suggestion_id
        JOIN users u ON s.user_id = u.id
      `;
      const params = [userId];

      if (category) {
        queryStr += ` WHERE s.category = $2`;
        params.push(category);
      }

      queryStr += `
        GROUP BY s.id, u.first_name, u.last_name
        ORDER BY votes DESC, s.created_at DESC
      `;

      const result = await pool.query(queryStr, params);

      res.json({ data: result.rows });
    } catch (err) {
      console.error('List suggestions error:', err);
      res.status(500).json({ message: 'Failed to list suggestions' });
    }
  },
);

// GET /:id - get single suggestion with votes
router.get(
  '/:id',
  authMiddleware,
  [param('id').isInt().withMessage('Valid suggestion id is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const { id } = req.params;
      const userId = req.user.id;

      const result = await pool.query(
        `SELECT
          s.id, s.user_id, s.title, s.description, s.category, s.status, s.created_at,
          u.first_name as submitter_first_name, u.last_name as submitter_last_name,
          COUNT(sv.id)::int as votes,
          CASE WHEN EXISTS(
            SELECT 1 FROM suggestion_votes WHERE suggestion_id = s.id AND user_id = $2
          ) THEN true ELSE false END as user_voted
        FROM suggestions s
        LEFT JOIN suggestion_votes sv ON s.id = sv.suggestion_id
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1
        GROUP BY s.id, u.first_name, u.last_name`,
        [id, userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Suggestion not found' });
      }

      res.json({ data: result.rows[0] });
    } catch (err) {
      console.error('Get suggestion error:', err);
      res.status(500).json({ message: 'Failed to get suggestion' });
    }
  },
);

// POST /:id/vote - add vote on suggestion
router.post(
  '/:id/vote',
  authMiddleware,
  [param('id').isInt().withMessage('Valid suggestion id is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const suggestionId = parseInt(req.params.id);
      const userId = req.user.id;

      const suggestionCheck = await pool.query(
        'SELECT id FROM suggestions WHERE id = $1',
        [suggestionId],
      );

      if (suggestionCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Suggestion not found' });
      }

      const voteCheck = await pool.query(
        'SELECT id FROM suggestion_votes WHERE suggestion_id = $1 AND user_id = $2',
        [suggestionId, userId],
      );

      if (voteCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Already voted' });
      }

      await pool.query(
        'INSERT INTO suggestion_votes (suggestion_id, user_id) VALUES ($1, $2)',
        [suggestionId, userId],
      );

      res.json({ data: { voted: true } });
    } catch (err) {
      console.error('Vote error:', err);
      res.status(500).json({ message: 'Failed to vote' });
    }
  },
);

// DELETE /:id/vote - remove vote from suggestion
router.delete(
  '/:id/vote',
  authMiddleware,
  [param('id').isInt().withMessage('Valid suggestion id is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const suggestionId = parseInt(req.params.id);
      const userId = req.user.id;

      await pool.query(
        'DELETE FROM suggestion_votes WHERE suggestion_id = $1 AND user_id = $2',
        [suggestionId, userId],
      );

      res.json({ data: { voted: false } });
    } catch (err) {
      console.error('Remove vote error:', err);
      res.status(500).json({ message: 'Failed to remove vote' });
    }
  },
);

// PUT /:id - update suggestion
router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isInt().withMessage('Valid suggestion id is required'),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('category').optional().isIn(VALID_CATEGORIES),
    body('status').optional().isIn(['open', 'in_review', 'approved', 'completed']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const suggestionId = parseInt(req.params.id);
      const userId = req.user.id;
      const { title, description, category, status } = req.body;

      const suggestionCheck = await pool.query(
        'SELECT user_id FROM suggestions WHERE id = $1',
        [suggestionId],
      );

      if (suggestionCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Suggestion not found' });
      }

      if (suggestionCheck.rows[0].user_id !== userId) {
        return res.status(403).json({ message: 'Cannot update other users suggestion' });
      }

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) { updates.push(`title = $${paramCount}`); values.push(title); paramCount++; }
      if (description !== undefined) { updates.push(`description = $${paramCount}`); values.push(description); paramCount++; }
      if (category !== undefined) { updates.push(`category = $${paramCount}`); values.push(category); paramCount++; }
      if (status !== undefined) { updates.push(`status = $${paramCount}`); values.push(status); paramCount++; }

      if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      values.push(suggestionId);

      const result = await pool.query(
        `UPDATE suggestions SET ${updates.join(', ')} WHERE id = $${paramCount}
         RETURNING id, user_id, title, description, category, status, created_at`,
        values,
      );

      res.json({ data: result.rows[0] });
    } catch (err) {
      console.error('Update suggestion error:', err);
      res.status(500).json({ message: 'Failed to update suggestion' });
    }
  },
);

// DELETE /:id - delete suggestion
router.delete(
  '/:id',
  authMiddleware,
  [param('id').isInt().withMessage('Valid suggestion id is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const pool = req.app.locals.pool;
      const suggestionId = parseInt(req.params.id);
      const userId = req.user.id;

      const suggestionCheck = await pool.query(
        'SELECT user_id FROM suggestions WHERE id = $1',
        [suggestionId],
      );

      if (suggestionCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Suggestion not found' });
      }

      if (suggestionCheck.rows[0].user_id !== userId) {
        return res.status(403).json({ message: 'Cannot delete other users suggestion' });
      }

      await pool.query('DELETE FROM suggestions WHERE id = $1', [suggestionId]);

      res.json({ data: { message: 'Suggestion deleted' } });
    } catch (err) {
      console.error('Delete suggestion error:', err);
      res.status(500).json({ message: 'Failed to delete suggestion' });
    }
  },
);

module.exports = router;
