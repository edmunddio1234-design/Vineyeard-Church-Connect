const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// POST /register
router.post(
  '/register',
  [
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { first_name, last_name, email, password } = req.body;
      const pool = req.app.locals.pool;

      // Check if email already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email],
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const result = await pool.query(
        `INSERT INTO users (first_name, last_name, email, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, first_name, last_name, email, bio, age, has_kids, is_retired, groups, hobbies, profile_image, role, created_at`,
        [first_name, last_name, email, hashedPassword],
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' },
      );

      res.status(201).json({
        data: {
          token,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            bio: user.bio,
            age: user.age,
            has_kids: user.has_kids,
            is_retired: user.is_retired,
            groups: user.groups,
            hobbies: user.hobbies,
            profile_image: user.profile_image,
            role: user.role,
            created_at: user.created_at,
          },
        },
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: 'Failed to register user' });
    }
  },
);

// POST /login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const pool = req.app.locals.pool;

      // Find user by email
      const result = await pool.query(
        `SELECT id, email, password_hash, first_name, last_name, bio, age, has_kids, is_retired, groups, hobbies, profile_image, role, created_at
         FROM users
         WHERE email = $1`,
        [email],
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = result.rows[0];

      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' },
      );

      res.json({
        data: {
          token,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            bio: user.bio,
            age: user.age,
            has_kids: user.has_kids,
            is_retired: user.is_retired,
            groups: user.groups,
            hobbies: user.hobbies,
            profile_image: user.profile_image,
            role: user.role,
            created_at: user.created_at,
          },
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Failed to login' });
    }
  },
);

// GET /me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const pool = req.app.locals.pool;

    const result = await pool.query(
      `SELECT id, first_name, last_name, email, bio, age, has_kids, is_retired, groups, hobbies, profile_image, role, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Failed to get user' });
  }
});

module.exports = router;
