# VineyardConnect Frontend - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local` if your API server is running on a different URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

### 4. Login with Demo Account
- Email: `demo@church.com`
- Password: `password123`

## What You'll Find

### Pages (User-Facing)
- `pages/index.js` - Login/Register landing page
- `pages/dashboard.js` - User dashboard with stats
- `pages/directory.js` - Member directory with search
- `pages/profile/[id].js` - Individual member profiles
- `pages/messages.js` - Messaging interface
- `pages/connections.js` - Manage connections
- `pages/suggestions.js` - Community ideas voting
- `pages/network.js` - Connection network visualization

### Components (Reusable)
- `components/AuthContext.js` - Authentication state management
- `components/Navbar.js` - Top navigation
- `components/ProfileCard.js` - Member card
- `components/VineyardLogo.js` - Church logo
- `components/ConnectionTree.js` - Network visualization

### Utilities
- `lib/api.js` - Axios instance with auth interceptors
- `lib/utils.js` - Helper functions
- `styles/globals.css` - Global styles & Tailwind

## Color Scheme

The app uses a vineyard purple theme:
- Primary: `#6B46C1` (Vineyard Purple)
- Dark: `#553C9A`
- Light: `#9F7AEA`
- Accent: `#ED8936` (Orange)

Customizable in `tailwind.config.js`

## Authentication

Uses JWT tokens stored in localStorage. The `AuthContext` handles:
- Login/Register
- Token storage and retrieval
- Automatic token inclusion in API calls
- Logout and redirect

Protected routes check for token and redirect to login if missing.

## API Integration

All API calls use the `lib/api.js` Axios instance:
```javascript
import api from '../lib/api';

const response = await api.get('/members');
const { data } = response.data;
```

Token is automatically added to all requests via interceptor.

## File Structure

```
frontend/
├── pages/              # Next.js pages (routes)
├── components/         # Reusable React components
├── lib/               # Utilities and API client
├── styles/            # CSS and Tailwind styles
├── public/            # Static assets (optional)
├── .env.example       # Environment template
├── next.config.js     # Next.js config
├── tailwind.config.js # Tailwind config
├── postcss.config.js  # PostCSS config
└── package.json       # Dependencies
```

## Development Tips

### Hot Reload
Changes to files automatically reload. Just save and refresh.

### Console Errors
Check browser console (F12) for React/JavaScript errors.

### API Debugging
Check Network tab to see all API requests and responses.

### Responsive Design
Test on mobile by resizing browser or using DevTools device emulation.

## Building for Production

```bash
npm run build
npm start
```

The build creates optimized static and server files in `.next/`

## Common Issues

### API Connection Error
- Ensure backend API is running on the configured URL
- Check `.env.local` for correct `NEXT_PUBLIC_API_URL`
- Check browser console for error details

### Login Not Working
- Verify demo credentials are correct
- Check API server is responding at `/api/auth/login`
- Look for 401/403 errors in Network tab

### Styling Issues
- Ensure Tailwind CSS built successfully
- Check for CSS errors in DevTools
- Run `npm install` again if classes don't apply

### Token Expiration
- Tokens stored in localStorage. Manual cleanup in DevTools if needed
- Logout clears token automatically

## Customization

### Colors
Edit `tailwind.config.js` theme colors

### Fonts
Update in `pages/_document.js` and `tailwind.config.js`

### API Endpoint
Change `NEXT_PUBLIC_API_URL` in `.env.local`

### Messages Polling Interval
Search for "5000" in `pages/messages.js` and modify interval

## Deployment

### Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set `NEXT_PUBLIC_API_URL` in Vercel environment variables
4. Deploy

### Self-Hosted
1. Build: `npm run build`
2. Deploy `.next`, `public`, `package.json`
3. Run: `npm start`

## Next Steps

1. Customize colors and branding
2. Add logo image to `public/`
3. Set up backend API
4. Configure database connections
5. Deploy to production

## Support & Documentation

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Axios: https://axios-http.com/docs
- React Hooks: https://react.dev/reference/react

For development help, refer to the main README.md
