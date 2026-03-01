# Frontend Setup

React-based user interface for Noteshelf with Redux state management, Tailwind CSS styling, and responsive design.

## Environment Configuration

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_PORT` | Frontend app port (for internal use) | `3066` |
| `REACT_APP_API_URL` | Backend API endpoint | `http://localhost:4088/api` (dev) / `https://example.com/api` (prod) |
| `REACT_APP_FRONTEND_DOMAIN` | Frontend domain (for redirects) | `http://localhost:3066` (dev) / `https://example.com` (prod) |

### Development Setup

```bash
# Install dependencies
npm install

# Copy and configure .env
cp .env.example .env

# Start development server
npm start
```

Browser opens at `http://localhost:3066`

### Production Build

```bash
npm run build
```

## Features

- **React** - UI library with hooks
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Axios** - HTTP client with baseURL
- **Tailwind CSS 3** - Utility-first styling
- **React Hot Toast** - Toast notifications
- **JWT Decode** - Token parsing for auth

## Pages
Role-based routing supports separate user and admin dashboards with protected access.

## State Management

Redux Toolkit with async thunks for API calls:

**Auth State:**
- User login (user/admin)
- User registration
- Token management
- Role-based access

**Notes State:**
- Get all user notes
- Create new note
- Delete note

**Admin State:**
- Get all users
- Delete user
- Reset user notes

## Development

```bash
npm start              # Start dev server on port 3000
npm test               # Run test suite
npm run build          # Production build
```

## API Integration

Configured Axios instance with:
- `baseURL`: From `REACT_APP_API_URL`
- `withCredentials: true` - Enables cookie transmission

All Redux thunks use this configured instance for API calls.
