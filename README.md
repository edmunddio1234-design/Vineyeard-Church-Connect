# VineyardConnect

**Social networking platform for Vineyard Church of Baton Rouge**

Connecting the Vineyard Church Family — a full-stack web application where church members can create profiles, connect with each other, send messages, and share ideas for the community.

## Architecture

```
[User's Browser]
       |
       v
[Vercel - Frontend]  <-->  [Render - Backend API]  <-->  [PostgreSQL Database]
  (Next.js/React)           (Node.js/Express)             (Stores all data)
```

## Project Structure

```
vineyard-connect/
├── frontend/           <- Deployed to Vercel
│   ├── pages/          (9 pages: login, dashboard, directory, profiles, messages, connections, suggestions, network)
│   ├── components/     (Navbar, ProfileCard, VineyardLogo, ConnectionTree, AuthContext)
│   ├── lib/            (API client, custom hooks, utilities)
│   └── styles/         (Tailwind CSS + custom styles)
│
├── backend/            <- Deployed to Render
│   ├── server.js       (Express server + DB init)
│   ├── routes/         (auth, users, messages, connections, suggestions)
│   ├── models/         (Database table definitions)
│   └── middleware/     (JWT authentication)
│
└── README.md
```

## Features

- **User Authentication** — Register/login with secure JWT tokens and bcrypt password hashing
- **Member Directory** — Browse and search all church members
- **Profiles** — Rich profiles with bio, age, groups, hobbies, and more
- **Messaging** — Direct messaging between members with real-time polling
- **Connections** — Send/accept friend requests, manage your network
- **Suggestions** — Submit ideas for the church community with voting
- **Network View** — Visual tree of how members are connected

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL connection string and JWT secret
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your backend API URL
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Deployment

- **Frontend**: Deploy to [Vercel](https://vercel.com) — connect your GitHub repo, set root directory to `frontend`
- **Backend**: Deploy to [Render](https://render.com) — create a Web Service, set root directory to `backend`
- **Database**: Create a PostgreSQL instance on Render (free tier available)

See the deployment guide for detailed step-by-step instructions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, JWT, bcrypt |
| Database | PostgreSQL |
| Hosting | Vercel (frontend) + Render (backend + DB) |

## Environment Variables

### Backend (.env)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret key for JWT tokens
- `FRONTEND_URL` — Frontend URL for CORS
- `PORT` — Server port (default: 5000)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` — Backend API URL

## License

Built for Vineyard Church of Baton Rouge.
