const express = require('express');
const cors = require('cors');
const pool = require('./db/index');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'https://vineyeard-church-connect.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const authRoutes = require('./routes/auth');
const membersRoutes = require('./routes/members');
const profileRoutes = require('./routes/profile');
const messagesRoutes = require('./routes/messages');
const connectionsRoutes = require('./routes/connections');
const jobsRoutes = require('./routes/jobs');
const prayerRoutes = require('./routes/prayer');
const galleryRoutes = require('./routes/gallery');
const suggestionsRoutes = require('./routes/suggestions');

app.get('/', (req, res) => {
  res.json({ message: 'VineyardConnect Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/suggestions', suggestionsRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const initializeDatabase = async () => {
  try {
    console.log('Initializing database schema...');
    const fs = require('fs');
    const path = require('path');
    const initSql = fs.readFileSync(path.join(__dirname, 'db/init.sql'), 'utf8');
    await pool.query(initSql);
    console.log('Database schema initialized successfully');

    // Seed database if fewer than 5 users (seed adds 8 sample members)
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const count = parseInt(userCount.rows[0].count);
    if (count < 5) {
      console.log(`Database has only ${count} users, seeding with sample data...`);
      // Use INSERT ... ON CONFLICT to avoid duplicates
      const seedSql = fs.readFileSync(path.join(__dirname, 'db/seed.sql'), 'utf8');
      await pool.query(seedSql);
      console.log('Database seeded successfully with sample data');
    } else {
      console.log(`Database already has ${count} users, skipping seed`);
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    console.log('Connecting to database...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`VineyardConnect Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
