# VineyardConnect Frontend - Architecture & Development Guide

## Overview

VineyardConnect is a modern Next.js social networking application for Vineyard Church of Baton Rouge. It features user authentication, member directory, messaging, connection management, and community idea voting.

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios
- **State Management**: React Context API + Hooks
- **Environment**: Node.js 16+

## Project Structure

```
frontend/
├── pages/                      # Next.js routes
│   ├── _app.js                # App wrapper & AuthProvider
│   ├── _document.js           # HTML document structure
│   ├── index.js               # Auth landing page
│   ├── dashboard.js           # Main dashboard
│   ├── directory.js           # Member directory
│   ├── messages.js            # Messaging page
│   ├── connections.js         # Connection management
│   ├── suggestions.js         # Ideas & voting
│   ├── network.js             # Network visualization
│   └── profile/
│       └── [id].js            # Dynamic profile pages
│
├── components/                 # Reusable components
│   ├── AuthContext.js         # Auth state management
│   ├── Navbar.js              # Navigation component
│   ├── ProfileCard.js         # Member card component
│   ├── VineyardLogo.js        # Logo SVG component
│   └── ConnectionTree.js      # Network tree visualization
│
├── lib/                        # Utilities & helpers
│   ├── api.js                 # Axios instance with interceptors
│   ├── utils.js               # Helper functions
│   └── hooks.js               # Custom React hooks
│
├── styles/                     # CSS
│   └── globals.css            # Tailwind + custom styles
│
├── public/                     # Static assets (images, etc.)
│
├── Configuration files
│   ├── next.config.js         # Next.js config
│   ├── tailwind.config.js     # Tailwind config
│   ├── postcss.config.js      # PostCSS config
│   └── package.json           # Dependencies
│
└── Documentation
    ├── README.md              # Main documentation
    ├── SETUP.md               # Setup instructions
    └── ARCHITECTURE.md        # This file
```

## Key Components

### AuthContext (`components/AuthContext.js`)

Provides authentication state and functions:

```javascript
const { user, token, login, register, logout, loading } = useAuth();
```

Features:
- JWT token management
- Automatic token validation on mount
- Login/register with API integration
- Token storage in localStorage
- Automatic token inclusion in API requests

### Navbar (`components/Navbar.js`)

Top navigation with:
- Logo and branding
- Navigation links (active state highlighting)
- User dropdown menu
- Mobile hamburger menu
- Responsive design

### ProfileCard (`components/ProfileCard.js`)

Reusable member card showing:
- Avatar (initials)
- Name and bio
- Age, kids, retired status
- Groups/ministry tags
- Hover effects

### ConnectionTree (`components/ConnectionTree.js`)

Network visualization component:
- Recursive tree rendering
- Expandable/collapsible nodes
- API integration for loading network data
- Connection depth visualization

## API Integration

### Base Configuration (`lib/api.js`)

```javascript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

Features:
- Automatic authorization header with Bearer token
- 401 error handling (logout on invalid token)
- Error interceptor logging

Usage:
```javascript
import api from '../lib/api';

const response = await api.get('/members');
const { data } = response.data;
```

### API Endpoints Used

```
Authentication
POST   /auth/login                    - Login
POST   /auth/register                 - Register
GET    /auth/me                       - Current user

Members
GET    /members                       - List all members
GET    /members/:id                   - Get member profile
PUT    /members/:id                   - Update profile

Connections
GET    /connections/my-connections    - My connections
GET    /connections/pending-requests  - Pending requests
GET    /connections/network/:id       - Network tree
GET    /connections/status/:id        - Connection status
POST   /connections/request           - Send request
POST   /connections/accept/:id        - Accept request
POST   /connections/decline/:id       - Decline request
DELETE /connections/:id               - Remove connection

Messages
GET    /conversations                 - List conversations
GET    /conversations/:id/messages    - Get messages
POST   /conversations/:id/messages    - Send message

Suggestions
GET    /suggestions                   - List ideas
GET    /suggestions/categories        - Categories
GET    /suggestions/my-votes          - User's votes
POST   /suggestions                   - Submit idea
POST   /suggestions/:id/vote          - Vote on idea
DELETE /suggestions/:id/vote          - Remove vote

Dashboard
GET    /dashboard/stats               - Quick stats
GET    /dashboard/activity            - Recent activity
```

## Page Features

### Login/Register (`pages/index.js`)

- Beautiful landing page with church branding
- Toggle between login and register modes
- Form validation
- Demo credentials display
- Redirects to dashboard on success

### Dashboard (`pages/dashboard.js`)

Protected route showing:
- Welcome message with user's first name
- Quick stats cards (connections, messages, ideas)
- Grid of quick links
- Recent activity feed
- Real-time data loading

### Directory (`pages/directory.js`)

Protected route with:
- Member search/filter
- Grid of ProfileCard components
- Links to individual profiles
- Real-time search results

### Profile (`pages/profile/[id].js`)

Protected dynamic route:
- Full profile view
- Inline editing for own profile
- Connect/Message buttons for others
- Connection status indicator
- Bio, age, kids, retired, hobbies, groups

### Messages (`pages/messages.js`)

Protected route with:
- Conversation list (left sidebar)
- Message thread (main area)
- Message input form
- 5-second polling for new messages
- Message bubbles (sent vs received)

### Connections (`pages/connections.js`)

Protected route with two tabs:
1. **My Connections**: Cards with message/remove buttons
2. **Pending Requests**: List with accept/decline buttons

### Suggestions (`pages/suggestions.js`)

Protected route featuring:
- Submit idea form (title, description, category)
- Category filter tabs
- Idea cards with vote counts
- Vote toggle button
- Sorting by most votes

### Network (`pages/network.js`)

Protected route with:
- ConnectionTree visualization (2-column layout)
- Network statistics sidebar
- Legend explanation
- Tips for using network
- About section

## Custom Hooks (`lib/hooks.js`)

### useProtectedRoute()
Protects pages requiring authentication and redirects to login if needed.

### useFetchData(url, dependencies)
Fetches data from API with loading/error states.

### useForm(initialValues)
Manages form state with input change handling.

### useToggle(initialState)
Simple boolean state toggle.

### useApiMutation(method)
Handles POST/PUT/DELETE requests with loading state.

### usePolling(url, interval, enabled)
Polls an endpoint at specified intervals.

### usePagination(pageSize)
Manages pagination state.

### useSearch(delay)
Manages search with debounce.

### useLocalStorage(key, initialValue)
Syncs state with localStorage.

### useDebouncedValue(value, delay)
Debounces a value.

## Styling System

### Tailwind Configuration

```javascript
// tailwind.config.js
colors: {
  primary: '#6B46C1',           // Vineyard purple
  'primary-dark': '#553C9A',    // Darker purple
  'primary-light': '#9F7AEA',   // Lighter purple
  accent: '#ED8936',             // Warm orange
}
```

### Custom CSS Classes (`styles/globals.css`)

```css
.input-primary      /* Form input styling */
.btn-primary        /* Primary button */
.btn-secondary      /* Secondary button */
.btn-ghost          /* Ghost button */
.card-hover         /* Hover animation */
.message-bubble-*   /* Message styling */
```

### Key Styling Features

- Smooth transitions and animations
- Custom scrollbar styling
- Focus states for accessibility
- Responsive grid layouts
- Subtle background patterns
- Message bubble styling

## Authentication Flow

1. User visits landing page (index.js)
2. User enters credentials and submits form
3. Frontend calls `/auth/login` or `/auth/register`
4. API returns JWT token and user data
5. Token stored in localStorage
6. AuthContext updates with user data
7. Dashboard page loads (protected route)
8. All subsequent API calls include Bearer token
9. On 401 error, token cleared and user redirected to login
10. On logout, token cleared and user redirected to login

## Protected Routes

All pages except index.js check for token using `useProtectedRoute()`:

```javascript
useEffect(() => {
  if (!authLoading && !token) {
    router.push('/');
  }
}, [token, authLoading, router]);
```

## Real-Time Features

Messages use 5-second polling instead of WebSockets:

```javascript
useEffect(() => {
  if (selectedConversation) {
    loadMessages(selectedConversation.id);
    const interval = setInterval(
      () => loadMessages(selectedConversation.id),
      5000
    );
    return () => clearInterval(interval);
  }
}, [selectedConversation]);
```

This can be upgraded to WebSockets in the future.

## Performance Optimizations

- Image lazy loading via Next.js
- Code splitting per page
- Efficient re-renders with React hooks
- Debounced search input
- Memoized callbacks
- Responsive images
- Minimized CSS with Tailwind

## Utility Functions (`lib/utils.js`)

```javascript
// Date/Time
formatDate(dateString)          // Human-readable dates
getRelativeTime(dateString)     // "2 hours ago" format

// User/Text
getInitials(firstName, lastName) // "JD" from John Doe
truncateText(text, length)      // Truncate with ellipsis

// Validation
isValidEmail(email)             // Email format check

// Tag Management
parseTags(tagsString)           // Split comma-separated
formatTags(tags)                // Join array to string

// Color/UI
getBadgeColor(index)            // Cycling colors for badges

// Storage
isAuthenticated()               // Check if logged in
getToken()                      // Get stored token
getStoredUser()                 // Get stored user

// Helpers
debounce(func, delay)           // Debounce function
pluralize(word, count)          // Plural/singular
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Variables prefixed with `NEXT_PUBLIC_` are exposed to browser.

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Edit files**: Hot reload automatically
3. **Check browser console**: For errors
4. **Test authentication**: Use demo credentials
5. **Use DevTools**: Network tab for API debugging
6. **Test responsive**: Resize browser or use device emulation

## Building & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deployment Options
- **Vercel**: Recommended for Next.js (auto-deployment from GitHub)
- **Self-hosted**: Build and deploy to any Node.js server
- **Docker**: Create Dockerfile for containerized deployment

## Code Standards

- Use functional components with hooks
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused
- Use custom hooks for reusable logic
- Handle errors gracefully
- Add loading states
- Use Tailwind classes (avoid inline CSS)

## Common Patterns

### Protected Page
```javascript
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthContext';

export default function Page() {
  const router = useRouter();
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/');
    }
  }, [token, loading, router]);

  if (!token) return <LoadingSpinner />;

  return <PageContent />;
}
```

### Data Fetching
```javascript
import { useFetchData } from '../lib/hooks';

export default function Page() {
  const { data, loading, error, refetch } = useFetchData('/members');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <List items={data} />;
}
```

### Form Handling
```javascript
import { useForm } from '../lib/hooks';

export default function Form() {
  const { formData, handleInputChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(formData);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
    </form>
  );
}
```

## Testing Recommendations

### Manual Testing Checklist
- [ ] Login with demo credentials
- [ ] Navigate to all pages
- [ ] Test search/filter
- [ ] Test form submissions
- [ ] Test responsive design
- [ ] Check API network calls
- [ ] Test logout
- [ ] Test protected routes

### Tools
- Browser DevTools (Elements, Console, Network)
- Next.js built-in error overlay
- Network tab for API debugging
- React DevTools extension

## Troubleshooting

### Issue: API Not Found
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running
- Check Network tab for request URL

### Issue: Login Fails
- Verify API endpoint returns JWT token
- Check token format in API response
- Check localStorage in DevTools

### Issue: Styles Not Applied
- Rebuild: `npm run build`
- Clear `.next` folder
- Check Tailwind config

### Issue: Hot Reload Not Working
- Restart dev server
- Check for syntax errors
- Review console for errors

## Future Enhancements

- [ ] WebSocket integration for real-time messaging
- [ ] Image upload for profiles and suggestions
- [ ] Dark mode theme
- [ ] Advanced filtering and sorting
- [ ] Analytics dashboard
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] User roles and permissions
- [ ] Activity logging
- [ ] Search suggestions/autocomplete
- [ ] User preferences/settings

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hooks](https://react.dev/reference/react)
- [Axios Documentation](https://axios-http.com)
- [JavaScript Regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

## Support

For development help, refer to:
- README.md - Main documentation
- SETUP.md - Setup instructions
- Individual file comments and JSDoc
