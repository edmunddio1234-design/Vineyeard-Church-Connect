# VineyardConnect Backend - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd /sessions/great-modest-sagan/vineyard-connect/backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/vineyard_connect
JWT_SECRET=your-super-secret-key-here-change-this-in-production
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### 3. Create PostgreSQL Database
```bash
createdb vineyard_connect
# or via psql:
# CREATE DATABASE vineyard_connect;
```

### 4. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## Verify Setup

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2026-02-09T..."}
```

## First Steps - Testing Endpoints

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response includes `token` - save this for authenticated requests.

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. List All Users
```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Create a Suggestion
```bash
curl -X POST http://localhost:5000/api/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Youth Ministry Event",
    "description": "Let'\''s organize a youth retreat",
    "category": "event"
  }'
```

## File Organization

```
backend/
├── server.js                      # Main application
├── package.json                   # Dependencies
├── .env.example                   # Environment template
├── .env                          # Your configuration (create from .env.example)
├── middleware/
│   └── auth.js                   # JWT authentication
├── routes/
│   ├── auth.js                   # /api/auth endpoints
│   ├── users.js                  # /api/users endpoints
│   ├── messages.js               # /api/messages endpoints
│   ├── connections.js            # /api/connections endpoints
│   └── suggestions.js            # /api/suggestions endpoints
└── README.md                      # Full documentation
```

## Database Tables

Tables are created automatically on first server startup:
- `users` - User accounts
- `messages` - Direct messages
- `connections` - Friendships
- `suggestions` - Suggestions/ideas
- `suggestion_votes` - Voting on suggestions

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost:5432/vineyard_connect |
| JWT_SECRET | Secret key for signing tokens | my-secret-key-12345 |
| FRONTEND_URL | Frontend domain (CORS) | http://localhost:3000 |
| PORT | Server port | 5000 |

## Common Issues

### Port Already in Use
```bash
# Change PORT in .env or kill process on port 5000
kill -9 $(lsof -ti:5000)
```

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432

# Check PostgreSQL is running
brew services start postgresql
# or
sudo systemctl start postgresql
```

### Token Invalid/Expired
- Tokens expire after 24 hours
- Always include `Authorization: Bearer <token>` header
- Check token format (should start with `Bearer `)

### CORS Error
- Verify FRONTEND_URL in .env matches your frontend origin
- Update CORS setting in server.js if needed

## Stopping the Server

```bash
# Press Ctrl+C in the terminal
```

## Troubleshooting

### Enable Debug Logging
Add to server.js:
```javascript
app.use(require('morgan')('dev'));
```

### Check Database Connection
```bash
psql postgresql://user:password@localhost:5432/vineyard_connect
# then:
\dt  # list all tables
\q  # quit
```

### View Node Logs
```bash
npm run dev 2>&1 | tee server.log
```

## Next Steps

1. Build the React frontend to consume these endpoints
2. Implement real-time features with Socket.io (optional)
3. Add email notifications
4. Setup file uploads for profile images
5. Add analytics and logging
6. Deploy to production server

## API Documentation

See `README.md` for complete API documentation with all endpoints.

## Support

All code files are fully commented and documented. Check the specific route file for detailed information about each endpoint.
