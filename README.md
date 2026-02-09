# VineyardConnect

Social networking platform for Vineyard Church of Baton Rouge. Connecting the Vineyard Church Family.

## Architecture

- **Frontend**: Next.js + React + Tailwind CSS (deploy to Vercel)
- - **Backend**: Node.js + Express + PostgreSQL (deploy to Render)
  -
  - ## Features
  -
  - - User Authentication (JWT + bcrypt)
    - - Member Directory with search
      - - Rich Profiles (bio, age, groups, hobbies)
        - - Direct Messaging with real-time polling
          - - Connection requests (send/accept/decline)
            - - Community Suggestions with voting
              - - Network visualization
                -
                - ## Quick Start
                -
                - ### Backend
                - ```bash
                  cd backend && npm install
                  cp .env.example .env
                  npm run dev
                  ```

                  ### Frontend
                  ```bash
                  cd frontend && npm install
                  cp .env.example .env.local
                  npm run dev
                  ```

                  Visit http://localhost:3000

                  ## Tech Stack

                  | Layer | Technology |
                  |-------|-----------|
                  | Frontend | Next.js, React, Tailwind CSS, Axios |
                  | Backend | Node.js, Express.js, JWT, bcrypt |
                  | Database | PostgreSQL |
                  | Hosting | Vercel (frontend) + Render (backend + DB) |

                  Built for Vineyard Church of Baton Rouge.# Vineyeard-Church-Connect
