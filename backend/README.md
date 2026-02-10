# VineyardConnect Backend

A complete Express.js backend for the VineyardConnect church community application. This backend connects to PostgreSQL on Render and provides comprehensive REST APIs for member management, messaging, prayer requests, job postings, gallery, and community suggestions.

## Features

- User authentication with JWT tokens
- Member profiles and discovery
- Direct messaging between members
- Connection requests (friend requests)
- Job postings with categories and types
- Prayer request management with prayer counts and responses
- Community gallery with likes and comments
- Community suggestions with voting system
- Comprehensive user profile with all details
- CORS-enabled for Vercel frontend deployment

## Database Schema

The backend includes 9 core tables:

1. **users** - User profiles with comprehensive fields
2. **connections** - Connection/friend requests
3. **messages** - Direct messages between users
4. **jobs** - Job postings
5. **prayer_requests** - Prayer requests with anonymous support
6. **prayer_responses** - Responses to prayer requests
7. **gallery_posts** - Community gallery posts
8. **gallery_comments** - Comments on gallery posts
9. **suggestions** - Community suggestions
10. **suggestion_comments** - Comments on suggestions

## Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL database access (Render database provided)

### Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd vineyard-connect/backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (.env):
```
DATABASE_URL=postgresql://vineyard_connect_user:EHP5YS5HJ5VSY0vFw5I7hYdaAdQlpIrR@dpg-d6575m7pm1nc73bni2r0-a.oregon-postgres.render.com/vineyard_connect
JWT_SECRET=your_jwt_secret_key_change_in_production_12345678
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

The server will:
- Connect to the PostgreSQL database
- Initialize the schema if tables don't exist
- Start listening on the specified PORT

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user

### Members (`/api/members`)
- `GET /` - List members with filters (location, available, group, search)
- `GET /:id` - Get specific member

### Profile (`/api/profile`)
- `GET /` - Get authenticated user's profile
- `PUT /` - Update authenticated user's profile (all fields)

### Messages (`/api/messages`)
- `POST /` - Send message
- `GET /` - Get message conversations
- `GET /conversation/:other_user_id` - Get conversation history

### Connections (`/api/connections`)
- `POST /` - Send connection request
- `PUT /:id` - Accept or decline connection request
- `GET /` - Get all connections
- `GET /pending/requests` - Get pending connection requests
- `DELETE /:id` - Delete connection

### Jobs (`/api/jobs`)
- `POST /` - Create job posting (authenticated)
- `GET /` - List jobs with filters (category, type, location, search)
- `GET /:id` - Get job details
- `PUT /:id` - Update job posting (authenticated)
- `DELETE /:id` - Delete job posting (authenticated)

### Prayer (`/api/prayer`)
- `POST /` - Create prayer request (authenticated)
- `GET /` - List prayer requests with filters
- `GET /:id` - Get prayer request details
- `PUT /:id` - Update prayer request (authenticated)
- `POST /:id/pray` - Increment prayer count
- `POST /:id/responses` - Add prayer response (authenticated)
- `GET /:id/responses` - Get prayer responses
- `DELETE /:id` - Delete prayer request (authenticated)

### Gallery (`/api/gallery`)
- `POST /` - Create gallery post (authenticated)
- `GET /` - List gallery posts with filters
- `GET /:id` - Get gallery post
- `PUT /:id` - Update gallery post (authenticated)
- `DELETE /:id` - Delete gallery post (authenticated)
- `POST /:id/like` - Like post (authenticated)
- `POST /:id/comments` - Add comment (authenticated)
- `GET /:id/comments` - Get post comments

### Suggestions (`/api/suggestions`)
- `POST /` - Create suggestion (authenticated)
- `GET /` - List suggestions with filters and sorting
- `GET /:id` - Get suggestion details
- `PUT /:id` - Update suggestion (authenticated)
- `DELETE /:id` - Delete suggestion (authenticated)
- `POST /:id/vote` - Vote for suggestion (authenticated)
- `POST /:id/comments` - Add comment (authenticated)
- `GET /:id/comments` - Get suggestion comments

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are issued on successful login/registration and expire in 7 days.

## Seed Data

The database comes with 8 pre-seeded members:
1. Sarah Johnson - Zachary, Elementary School Teacher
2. Marcus Williams - Baton Rouge Mid City, Software Engineer
3. Emily Chen - Baton Rouge Southdowns, Registered Nurse
4. David Martinez - Central, Contractor
5. Rachel Martinez - Central, Accountant
6. Grace Thompson - Baton Rouge Broadmoor, Retired Principal
7. Jason Park - Baton Rouge Sherwood Forest, Physical Therapist
8. Lisa Okafor - Baton Rouge Garden District, Graphic Designer

Plus sample jobs, prayer requests, gallery posts, and suggestions.

## Deployment to Render

1. Push code to GitHub
2. Connect GitHub repository to Render
3. Render will use `render.yaml` for deployment configuration
4. Environment variables are set in Render dashboard
5. Server will automatically deploy on push

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Invalid request
- 401 Unauthorized - Missing/invalid token
- 403 Forbidden - Access denied
- 404 Not Found - Resource not found
- 409 Conflict - Duplicate resource
- 500 Server Error - Internal error

## Security Features

- Password hashing with bcryptjs
- JWT authentication tokens
- SQL injection protection (parameterized queries)
- CORS configuration for frontend domains
- Authorization checks on user-owned resources

## File Structure

```
backend/
├── db/
│   ├── index.js          # Database pool connection
│   ├── init.sql          # Database schema
│   └── seed.sql          # Seed data
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── members.js        # Member routes
│   ├── profile.js        # Profile routes
│   ├── messages.js       # Messaging routes
│   ├── connections.js    # Connection routes
│   ├── jobs.js           # Job routes
│   ├── prayer.js         # Prayer request routes
│   ├── gallery.js        # Gallery routes
│   └── suggestions.js    # Suggestion routes
├── server.js             # Main server file
├── package.json          # Dependencies
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── render.yaml           # Render deployment config
└── README.md             # This file
```

## Development

For local development, use:
```bash
npm run dev
```

This will start the server with hot-reload capabilities (if you have nodemon installed).

## License

MIT
