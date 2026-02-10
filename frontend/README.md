# Vineyard Connect Frontend

React + Vite frontend for the Vineyard Church of Baton Rouge community connection platform.

## Project Structure

```
frontend/
├── index.html              # Entry HTML file
├── vite.config.js          # Vite configuration with React plugin and dev proxy
├── package.json            # Dependencies and build scripts
├── vercel.json             # Vercel deployment SPA routing config
├── .env                    # Environment variables (production API URL)
├── .env.example            # Example environment file
├── .gitignore              # Git ignore rules
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root component
    ├── index.css           # Global styles and CSS resets
    ├── theme.js            # Color theme object (T)
    ├── styles.js           # Reusable style objects (S)
    ├── constants.js        # All data constants (locations, groups, gifts, etc.)
    ├── api.js              # API service layer with all endpoints
    └── components/
        ├── Icons.jsx       # SVG icon components
        ├── UI.jsx          # Reusable UI components (Avatar, Button, Input, etc.)
        └── VineyardLogo.jsx # Ornate vineyard/grape SVG logo
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs the dev server on http://localhost:3000 with proxy to `http://localhost:5000/api`

## Build

```bash
npm run build
```

Generates optimized production build in `dist/` folder.

## Preview

```bash
npm run preview
```

Preview the production build locally.

## Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL (default: https://vineyard-connect-backend.onrender.com)

Copy `.env.example` to `.env` and adjust for your environment.

## Available Exports

### `theme.js` - Color Theme (T)
- Colors: `bg`, `bgSoft`, `bgCard`, `primary`, `primaryDark`, `primaryLight`, `primaryFaint`, `text`, `textDark`, `textMuted`, `textBody`, `border`, `borderLight`, `accent`, `white`
- Semantic: `danger`, `success`, `warning`
- Effects: `shadow`, `shadowLg`

### `styles.js` - Style Helpers (S)
- Layouts: `flex`, `flexCol`, `grid2`
- Components: `card`, `btn`, `btnSm`, `input`, `tag`, `avatar`, `divider`
- Typography: `h1`, `h2`, `h3`, `muted`

### `constants.js` - All Data
- `LOCATIONS` - 20 Baton Rouge area locations
- `SMALL_GROUPS` - 18 small group types
- `DESIRED_GROUPS` - 24 group interests
- `SPIRITUAL_GIFTS` - 15 spiritual gifts
- `AVAIL_OPTS` - 25 availability options
- `HOBBY_OPTS` - 30 hobby/interest options
- `JOB_TYPES` - Job employment types
- `JOB_CATS` - Job categories
- `PRAYER_CATS` - Prayer request categories
- `GALLERY_CATS` - Gallery post categories

### `api.js` - API Service (api)
Complete REST API client with methods for:
- Auth: `login`, `register`
- Members: `getMembers`, `getMember`
- Profile: `getProfile`, `updateProfile`
- Messages: `getConversations`, `getMessages`, `sendMessage`
- Connections: `getConnections`, `sendConnection`, `acceptConnection`, `declineConnection`
- Jobs: `getJobs`, `createJob`
- Prayer: `getPrayers`, `createPrayer`, `prayForRequest`, `markAnswered`, `addPrayerResponse`, `getPrayerResponses`
- Gallery: `getGalleryPosts`, `createGalleryPost`, `likeGalleryPost`, `getGalleryComments`, `addGalleryComment`
- Suggestions: `getSuggestions`, `createSuggestion`, `voteSuggestion`, `getSuggestionComments`, `addSuggestionComment`

### `components/Icons.jsx` - Icon Component
Renders SVG icons by name:
- `home`, `users`, `user`, `chat`, `search`, `bell`, `edit`, `location`, `heart`, `briefcase`, `star`, `logout`, `send`, `check`, `x`, `plus`, `handshake`, `clock`, `filter`, `cake`, `family`, `car`, `pray`, `gift`, `globe`, `camera`, `hands`, `image`, `megaphone`

### `components/UI.jsx` - Reusable Components
- `Avatar` - User avatar with initials
- `Tag` - Badge/tag component
- `Button` - Themed button (variants: primary, secondary, danger, success)
- `Input` - Text input field
- `TextArea` - Multi-line text input
- `Select` - Dropdown select
- `Badge` - Notification badge with count
- `Card` - Card container
- `Modal` - Modal dialog
- `InfoRow` - Info row with label and value
- `Spinner` - Loading spinner
- `LoadingState` - Full loading state display
- `EmptyState` - Empty state display
- `Pagination` - Page navigation

### `components/VineyardLogo.jsx` - Logo Component
Ornate SVG logo with "VINEYARD CHURCH OF BATON ROUGE" text.

## Styling Approach

All components use inline styles with the `T` (theme) and `S` (styles) objects for consistency. No external CSS libraries required beyond global resets in `index.css`.

## API Integration

All API calls use the `api` object from `api.js`. Bearer tokens from localStorage are automatically included in request headers.

```javascript
import { api } from './api'

// Example usage
const members = await api.getMembers('?location=Downtown Baton Rouge')
const profile = await api.getProfile()
await api.sendMessage(userId, 'Hello!')
```

## Deployment

Deploy to Vercel or any static host. `vercel.json` configures SPA routing.

```bash
npm run build
# Deploy dist/ folder
```
