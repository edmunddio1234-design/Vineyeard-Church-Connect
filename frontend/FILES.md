# VineyardConnect Frontend - Complete File List

## Configuration Files

### `package.json`
- Dependencies: next, react, react-dom, axios
- DevDependencies: tailwindcss, postcss, autoprefixer
- Scripts: dev, build, start, lint

### `next.config.js`
- Next.js configuration
- Environment variables setup

### `tailwind.config.js`
- Tailwind CSS configuration
- Custom color theme (vineyard purple + accent orange)
- Font configuration

### `postcss.config.js`
- PostCSS configuration with tailwindcss and autoprefixer

### `.env.example`
- Template for environment variables
- NEXT_PUBLIC_API_URL setting

### `.gitignore`
- Standard Node.js/Next.js ignores
- Excludes node_modules, .next, .env files, IDE settings

## Pages (Routes)

### `pages/_app.js`
- App wrapper component
- Imports global styles
- Wraps app with AuthProvider

### `pages/_document.js`
- HTML document structure
- Sets up meta tags
- Loads Google Fonts (Inter)

### `pages/index.js`
- Login/Register landing page
- Beautiful church-themed design
- Demo credentials display
- Form validation

### `pages/dashboard.js`
- Protected user dashboard
- Welcome message
- Quick stats cards (connections, messages, ideas)
- Quick links grid
- Recent activity feed

### `pages/directory.js`
- Protected member directory
- Search/filter functionality
- Grid of ProfileCard components
- Real-time search results

### `pages/profile/[id].js`
- Protected dynamic profile page
- Full profile display
- Inline editing for own profile
- Connect/Message buttons for others
- Connection status indicator

### `pages/messages.js`
- Protected messaging interface
- Conversation list (left sidebar)
- Message thread (main area)
- Message input form
- 5-second polling for real-time-like updates

### `pages/connections.js`
- Protected connections management
- Two tabs: My Connections & Pending Requests
- Connection/request cards with action buttons

### `pages/suggestions.js`
- Protected ideas and voting page
- Submit idea form with categories
- Category filter tabs
- Idea cards with vote counts
- Vote toggle functionality

### `pages/network.js`
- Protected network visualization page
- Connection tree display
- Network statistics sidebar
- Legend and tips
- About network section

## Components

### `components/AuthContext.js`
- React Context for authentication
- useAuth hook
- Manages: user, token, login, register, logout
- Token validation on mount
- Auto-login with stored token

### `components/Navbar.js`
- Top navigation component
- VineyardConnect logo and branding
- Navigation links with active highlighting
- User dropdown menu (Profile, Logout)
- Mobile hamburger menu
- Sticky positioning

### `components/ProfileCard.js`
- Reusable member profile card
- Avatar with initials
- Name and bio
- Age, kids, retired status
- Groups/ministry tags
- Link to full profile

### `components/VineyardLogo.js`
- SVG grape/vine logo
- Purple themed
- Configurable size
- Used in Navbar and landing page

### `components/ConnectionTree.js`
- Network tree visualization
- Recursive rendering
- Expandable/collapsible nodes
- API integration
- Two-level depth display

## Libraries & Utilities

### `lib/api.js`
- Axios instance configuration
- Base URL from environment
- Request interceptor (adds auth token)
- Response interceptor (handles 401 errors)
- Error handling and logging

### `lib/utils.js`
- Helper functions:
  - Date formatting (formatDate, getRelativeTime)
  - User info (getInitials)
  - Text manipulation (truncateText)
  - Email validation (isValidEmail)
  - Tag parsing/formatting
  - Color utilities (getBadgeColor)
  - Auth helpers (isAuthenticated, getToken, getStoredUser)
  - Functional utilities (debounce, pluralize)

### `lib/hooks.js`
- Custom React hooks:
  - useProtectedRoute() - Route protection
  - useFetchData() - Data fetching
  - useForm() - Form state management
  - useToggle() - Boolean state toggle
  - useApiMutation() - POST/PUT/DELETE requests
  - usePolling() - Periodic data fetching
  - usePagination() - Pagination state
  - useSearch() - Search with debounce
  - useLocalStorage() - localStorage sync
  - useDebouncedValue() - Value debouncing

## Styles

### `styles/globals.css`
- Tailwind imports (@tailwind directives)
- Custom scrollbar styling
- Message bubble styles
- Card hover effects
- Form element styling
- Button variants
- Animations and transitions
- Responsive utilities

## Documentation

### `README.md`
- Project overview
- Features list
- Tech stack
- Installation instructions
- Project structure
- Color scheme
- API integration guide
- Environment variables
- Key components explanation
- Page features
- Styling information
- Performance notes
- Future enhancements

### `SETUP.md`
- Quick start guide
- Installation steps
- Configuration instructions
- Development tips
- Troubleshooting
- Customization guide
- Deployment instructions

### `ARCHITECTURE.md`
- Detailed architecture overview
- Technology stack explanation
- Complete project structure
- Component deep dives
- API endpoints documentation
- Page feature details
- Custom hooks reference
- Styling system explanation
- Authentication flow diagram
- Development workflow
- Code standards and patterns
- Testing recommendations
- Future enhancements
- Resource links

### `FILES.md`
- This file
- Complete file listing with descriptions

## Summary Statistics

- **Total Files**: 27
- **Pages**: 9 (8 protected + 1 public)
- **Components**: 5
- **Libraries**: 3 (api, utils, hooks)
- **Config Files**: 6
- **Documentation**: 4
- **Lines of Code**: ~4,500+ (fully functional)

## Quick Reference

### To Start Development:
1. `npm install`
2. `cp .env.example .env.local`
3. `npm run dev`
4. Visit http://localhost:3000

### To Build for Production:
1. `npm run build`
2. `npm start`

### File Dependencies:
- All pages import from components
- All components import from lib/api or lib/hooks
- All components wrap with AuthProvider (_app.js)
- Global styles loaded in _app.js

### Key Import Paths:
```javascript
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';
import { useProtectedRoute, useFetchData } from '../lib/hooks';
import { formatDate, getInitials } from '../lib/utils';
```
