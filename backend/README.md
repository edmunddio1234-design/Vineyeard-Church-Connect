# VineyardConnect Backend

Express.js backend for VineyardConnect - A social networking app for Vineyard Church of Baton Rouge.

## Project Structure

```
backend/
├── server.js                 # Main application server
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── middleware/
│   └── auth.js              # JWT authentication middleware
└── routes/
    ├── auth.js              # Authentication endpoints
    ├── users.js             # User profile endpoints
    ├── messages.js          # Messaging endpoints
    ├── connections.js       # Connection/friendship endpoints
    └── suggestions.js       # Suggestions/voting endpoints
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Configure your `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/vineyard_connect
JWT_SECRET=your-super-secret-key-here-change-this
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### 3. Setup PostgreSQL Database

Create a PostgreSQL database:

```sql
CREATE DATABASE vineyard_connect;
```

The application will automatically create all required tables on startup.

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on http://localhost:5000 (or your configured PORT).

## API Endpoints

### Authentication (`/api/auth`)

- **POST /register** - Create new account
  - Body: `{ first_name, last_name, email, password }`
  - Returns: `{ token, user }`

- **POST /login** - Login to account
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- **GET /me** - Get current user profile (requires auth)
  - Returns: User object

### Users (`/api/users`)

- **GET /** - List all users with optional search (requires auth)
  - Query: `?search=name_or_email`
  - Returns: Array of user objects

- **GET /:id** - Get user by ID (requires auth)
  - Returns: User object

- **PUT /:id** - Update own profile (requires auth)
  - Body: `{ first_name, last_name, bio, age, has_kids, is_retired, groups[], hobbies[], profile_image }`
  - Returns: Updated user object

### Messages (`/api/messages`)

- **GET /conversations** - Get list of conversations (requires auth)
  - Returns: Array of conversation previews

- **GET /:userId** - Get all messages with a user (requires auth, marks as read)
  - Returns: Array of message objects

- **POST /** - Send a message (requires auth)
  - Body: `{ receiver_id, content }`
  - Returns: Created message object

- **GET /unread/count** - Get count of unread messages (requires auth)
  - Returns: `{ unread_count }`

### Connections (`/api/connections`)

- **POST /request/:userId** - Send connection request (requires auth)
  - Returns: Created connection object

- **POST /accept/:id** - Accept connection request (requires auth)
  - Returns: Updated connection object

- **POST /decline/:id** - Decline connection request (requires auth)
  - Returns: Updated connection object

- **DELETE /:id** - Remove connection (requires auth)
  - Returns: 204 No Content

- **GET /** - Get all accepted connections (requires auth)
  - Returns: Array of connected users

- **GET /pending** - Get pending connection requests (requires auth)
  - Returns: Array of pending requests

- **GET /status/:userId** - Check connection status with user (requires auth)
  - Returns: `{ status: 'none' | 'pending_sent' | 'pending_received' | 'accepted', ... }`

### Suggestions (`/api/suggestions`)

- **POST /** - Create suggestion (requires auth)
  - Body: `{ title, description, category }`
  - Categories: `event`, `ministry`, `outreach`, `facility`, `other`
  - Returns: Created suggestion object

- **GET /** - List all suggestions (requires auth)
  - Query: `?category=event`
  - Returns: Array of suggestions with vote counts

- **GET /:id** - Get single suggestion (requires auth)
  - Returns: Suggestion object with vote details

- **POST /:id/vote** - Toggle vote on suggestion (requires auth)
  - Returns: `{ voted: true/false }`

- **PUT /:id** - Update suggestion (requires auth, creator only)
  - Body: `{ title, description, category, status }`
  - Status: `open`, `in_review`, `approved`, `completed`
  - Returns: Updated suggestion object

- **DELETE /:id** - Delete suggestion (requires auth, creator only)
  - Returns: 204 No Content

## Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- first_name VARCHAR(100)
- last_name VARCHAR(100)
- email VARCHAR(255) UNIQUE
- password_hash VARCHAR(255)
- bio TEXT
- age INTEGER
- has_kids BOOLEAN DEFAULT false
- is_retired BOOLEAN DEFAULT false
- groups TEXT[]
- hobbies TEXT[]
- profile_image TEXT
- role VARCHAR(50) DEFAULT 'member'
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Messages Table
```sql
- id (SERIAL PRIMARY KEY)
- sender_id INTEGER FK users
- receiver_id INTEGER FK users
- content TEXT
- read BOOLEAN DEFAULT false
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Connections Table
```sql
- id (SERIAL PRIMARY KEY)
- requester_id INTEGER FK users
- receiver_id INTEGER FK users
- status VARCHAR(50) DEFAULT 'pending' (pending, accepted, declined)
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- UNIQUE(requester_id, receiver_id)
```

### Suggestions Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id INTEGER FK users
- title VARCHAR(255)
- description TEXT
- category VARCHAR(50)
- status VARCHAR(50) DEFAULT 'open'
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Suggestion Votes Table
```sql
- id (SERIAL PRIMARY KEY)
- suggestion_id INTEGER FK suggestions
- user_id INTEGER FK users
- UNIQUE(suggestion_id, user_id)
```

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require a valid JWT token passed in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens expire after 24 hours.

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error message",
  "errors": [
    {
      "param": "field_name",
      "msg": "Field-specific error message"
    }
  ]
}
```

Common status codes:
- 200 - Success
- 201 - Created
- 204 - No Content
- 400 - Bad Request (validation errors)
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Server Error

## Security Features

- **Helmet.js** - HTTP headers security
- **CORS** - Cross-origin requests limited to FRONTEND_URL
- **Rate Limiting** - 100 requests per 15 minutes
- **Password Hashing** - bcryptjs with 10 rounds
- **JWT Authentication** - Secure token-based auth
- **SQL Injection Prevention** - Parameterized queries
- **Input Validation** - express-validator on all inputs

## Development Notes

- Database tables are created automatically on server startup
- All passwords are hashed and never stored in plain text
- Connection requests prevent duplicate entries
- Users can only modify their own profiles
- Suggestion creators can only modify/delete their own suggestions
- Messages are marked as read when retrieved
- Vote toggling allows users to add or remove votes with same endpoint

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists
- Check credentials are correct

### JWT Token Issues
- Verify JWT_SECRET is set in .env
- Check token hasn't expired (24 hour expiration)
- Ensure token format is `Authorization: Bearer <token>`

### CORS Errors
- Verify FRONTEND_URL matches your frontend URL
- Check that frontend is calling with correct origin

### Rate Limiting
- Default limit is 100 requests per 15 minutes
- This applies globally, adjust in server.js if needed

## Production Deployment

Before deploying to production:

1. Set strong JWT_SECRET
2. Use environment-specific DATABASE_URL
3. Set FRONTEND_URL to production frontend domain
4. Enable HTTPS
5. Consider adjusting rate limits based on traffic
6. Set up database backups
7. Monitor server logs
8. Consider using a reverse proxy (nginx)

## License

ISC
