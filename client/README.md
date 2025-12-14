# ScopeView Frontend

A modern, real-time telemetry visualization dashboard built with React + Vite.

## Features

✨ **Beautiful Dark Theme** - Fastlytics-inspired UI with neon blue accents  
📊 **Real-time Telemetry Charts** - Live data visualization with Recharts  
🔐 **Authentication System** - Login/Register pages with JWT support  
📱 **Fully Responsive** - Works on desktop, tablet, and mobile  
⚡ **Fast Performance** - Built with Vite for lightning-fast development  
🎨 **Vanilla CSS** - No framework dependencies, pure CSS styling  

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Recharts** - Chart visualization library
- **Socket.io Client** - Real-time WebSocket communication
- **Axios** - HTTP client for API calls

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The application will run on `http://localhost:5174` (or next available port).

## Project Structure

```
client/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Card.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   ├── TelemetryChart.jsx
│   │   ├── StreamSelector.jsx
│   │   ├── LogViewer.jsx
│   │   ├── ExportCSVButton.jsx
│   │   └── PageHeader.jsx
│   ├── pages/           # Application pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── HistoricalPlayback.jsx
│   │   ├── StreamConfiguration.jsx
│   │   ├── Settings.jsx
│   │   └── NotFound.jsx
│   ├── services/        # API and WebSocket services
│   │   ├── api.js
│   │   └── socket.js
│   ├── utils/           # Helper functions
│   │   └── helpers.js
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles and theme
├── index.html
├── vite.config.js
└── package.json
```

## Pages

### 🔐 Authentication
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration

### 📊 Dashboard
- **Dashboard** (`/dashboard`) - Main real-time telemetry view
  - Live telemetry charts
  - Stats cards (connection status, active streams, data rate)
  - Stream selector panel
  - System logs viewer
  - Export to CSV functionality

### 📈 Data Management
- **Historical Playback** (`/historical`) - View past telemetry data
  - Stream selection
  - Date/time range picker
  - Historical data visualization

- **Stream Configuration** (`/streams`) - Manage telemetry streams
  - Add/edit stream configurations
  - Set color, units, and value ranges
  - Enable/disable streams

### ⚙️ Settings
- **Settings** (`/settings`) - User preferences
  - Theme toggle (dark/light)
  - Update email
  - Change password
  - Logout

## Theme Customization

The app uses CSS variables for easy theming. Edit `src/index.css`:

```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #121212;
  --bg-card: #1e1e1e;
  --accent-blue: #00aaff;
  --text-primary: #e0e0e0;
  /* ... more variables */
}
```

## Backend Integration

The frontend is designed to work with the ScopeView backend server running on `http://localhost:4000`.

### API Endpoints Used:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/streams` - Fetch stream configurations
- `POST /api/streams` - Create new stream
- `GET /api/telemetry` - Fetch historical telemetry data

### WebSocket Events:
- `subscribe` - Subscribe to telemetry updates
- `telemetry:update` - Receive real-time telemetry data
- `telemetry:initial` - Receive initial data on connection

## Development

### Quick Start

```bash
# Start the dev server
npm run dev
```

The application uses Hot Module Replacement (HMR) for instant updates during development.

### Testing Login

For development, the app uses a simple token-based auth. Just enter any email and password to log in.

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Philosophy

- **Modern & Minimal** - Clean interface inspired by Fastlytics.com
- **Dark by Default** - Optimized for extended viewing sessions
- **Performance First** - Smooth animations and responsive interactions
- **Accessibility** - Semantic HTML and proper contrast ratios

## Responsive Breakpoints

- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

Built with ❤️ using React + Vite
