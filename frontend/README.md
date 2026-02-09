# VineyardConnect Frontend

A modern, responsive Next.js social networking application for Vineyard Church of Baton Rouge. Designed with a church-friendly aesthetic using vineyard purple as the primary color.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Member Directory**: Browse and search church members
- **Profiles**: View and edit detailed member profiles with bio, interests, and groups
- **Connections**: Send/accept connection requests and manage your network
- **Messaging**: Real-time-like messaging system with connection support
- **Ideas & Suggestions**: Community members can submit and vote on ideas
- **Network Visualization**: Tree-based visualization of your connection network
- **Responsive Design**: Mobile-first, fully responsive UI

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API & Hooks

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- API server running at `http://localhost:5000/api` (or configured via `.env`)

### Installation

1. Clone and navigate to the frontend directory:
```bash
cd vineyard-connect/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your API URL (if different from default):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── pages/
│   ├── _app.js                 # App wrapper with AuthProvider
│   ├── index.js                # Login/Register landing page
│   ├── dashboard.js            # User dashboard with quick stats
│   ├── directory.js            # Browse members
│   ├── messages.js             # Messaging interface
│   ├── connections.js          # Manage connections
│   ├── suggestions.js          # Community ideas voting
│   ├── network.js              # Connection network visualization
│   └── profile/
│       └── [id].js             # Individual profile pages
├── components/
│   ├── AuthContext.js          # Auth state management
│   ├── Navbar.js               # Top navigation bar
│   ├── ProfileCard.js          # Member card component
│   ├── VineyardLogo.js         # Church logo SVG
│   └── ConnectionTree.js       # Network tree visualization
├── lib/
│   └── api.js                  # Axios instance with auth interceptors
├── styles/
│   └── globals.css             # Tailwind + custom styles
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies

```

## Color Scheme

- **Primary**: `#6B46C1` (Vineyard Purple)
- **Primary Dark**: `#553C9A` (Darker Purple)
- **Primary Light**: `#9F7AEA` (Lighter Purple)
- **Accent**: `#ED8936` (Warm Orange)

## API Integration

All API calls go through the `lib/api.js` axios instance which:
- Automatically includes the JWT token from localStorage
- Handles 401 errors by clearing auth and redirecting to login
- Uses environment variable `NEXT_PUBLIC_API_URL` for base URL

### Example API Call:
```javascript
import api from '../lib/api';

const response = await api.get('/members');
const data = response.data.data;
```

## Authentication Flow

1. User logs in/registers on the landing page (index.js)
2. API returns JWT token and user data
3. AuthContext stores token in localStorage and user in state
4. Token automatically included in all subsequent requests
5. Protected routes check for token and redirect to login if missing
6. On logout, token is cleared and user is redirected to login

## Key Components

### AuthContext (`components/AuthContext.js`)
Provides authentication state and methods:
- `user` - Current logged-in user data
- `token` - JWT authentication token
- `login(email, password)` - Login function
- `register(first_name, last_name, email, password)` - Register function
- `logout()` - Clear auth and redirect

### Navbar (`components/Navbar.js`)
Top navigation with:
- VineyardConnect logo and branding
- Navigation links (Dashboard, Directory, Messages, etc.)
- User dropdown menu
- Mobile hamburger menu

### ProfileCard (`components/ProfileCard.js`)
Reusable member card showing:
- User initials avatar
- Name and bio preview
- Age, kids, retired status
- Groups/ministry tags

## Environment Variables

- `NEXT_PUBLIC_API_URL`: API base URL (default: `http://localhost:5000/api`)

Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Page Features

### Login/Register (`pages/index.js`)
- Beautiful landing with church branding
- Toggle between login and register modes
- Form validation
- Demo credentials display

### Dashboard (`pages/dashboard.js`)
- Welcome message with user's name
- Quick stats (connections, unread messages, pending ideas)
- Quick links grid to all main features
- Recent activity feed

### Directory (`pages/directory.js`)
- Search bar for filtering members
- Grid of member profile cards
- Click to view full profiles

### Profile (`pages/profile/[id].js`)
- Full profile view with avatar initials
- Bio, age, kids, retired status, hobbies, groups
- Edit mode for own profile with inline editing
- Connect/Message buttons for other profiles
- Connection status indicator

### Messages (`pages/messages.js`)
- Left sidebar with conversation list
- Main chat area with messages
- Real-time-like polling (5 second intervals)
- Message input form at bottom
- Message bubbles styled by sender/receiver

### Connections (`pages/connections.js`)
- Tabs for "My Connections" and "Pending Requests"
- Connection cards with message and remove buttons
- Pending request cards with accept/decline buttons

### Suggestions (`pages/suggestions.js`)
- Submit idea form with title, description, category
- Category filter tabs
- Suggestion cards with vote counts
- Vote button toggles votes on/off
- Sorted by most votes

### Network (`pages/network.js`)
- Connection tree visualization
- Info sidebar with network stats and legend
- Tips for using the network
- About section explaining network benefits

## Styling

The project uses Tailwind CSS with custom extensions:
- Custom color palette with vineyard theme
- Custom components: `.btn-primary`, `.input-primary`, `.card-hover`
- Message bubble styles: `.message-bubble-sent`, `.message-bubble-received`
- Animations and transitions throughout
- Mobile-first responsive design

## Performance Optimizations

- Image lazy loading
- Component code splitting via Next.js
- Responsive images and icons
- Optimized API calls with polling intervals
- Efficient re-renders with React hooks

## Future Enhancements

- WebSocket integration for real-time messaging
- Image upload for profiles
- Advanced filtering and sorting
- Analytics and insights
- Mobile app version
- Push notifications
- Dark mode theme

## Demo Credentials

For testing, use:
- Email: `demo@church.com`
- Password: `password123`

## Support

For issues or questions, please contact the development team.

## License

© Vineyard Church of Baton Rouge
