# ScopeView ⚡

**Real-time Telemetry Dashboard for Engineering Teams**

ScopeView is a full-stack web application designed to ingest, visualize, and analyze high-frequency telemetry data streams (like CPU usage, sensor metrics, etc.) in real-time. It features a modern, responsive dashboard with live charts, historical playback, and role-based access control.

![ScopeView Dashboard](https://via.placeholder.com/800x400?text=ScopeView+Dashboard+Preview)
*(Replace with actual screenshot link if available)*

---

## 🚀 Features

*   **Real-time Visualization:** Live line charts using WebSocket data streams (< 50ms latency).
*   **Dynamic Stream Configuration:** Add, edit, and toggle telemetry streams on the fly.
*   **Historical Playback:** Replay past sessions to analyze anomalies.
*   **Role-Based Access Control (RBAC):**
    *   **Viewer:** Read-only access to dashboards and logs.
    *   **Engineer:** Can configure streams and manage settings.
    *   **Admin:** Full system control.
*   **Manual Control:** Connect/Disconnect toggle for live data feeds.
*   **Secure:** JWT-based authentication and BCrypt password hashing.
*   **Responsive Design:** Dark-themed UI optimized for desktop and tablet.

---

## 🛠️ Tech Stack

**Frontend:**
*   React 18 (Vite)
*   Recharts (Data Visualization)
*   Socket.IO Client (Real-time comms)
*   Axios (API Requests)
*   CSS Modules (Styling)

**Backend:**
*   Node.js & Express
*   Socket.IO (WebSocket Server)
*   MongoDB & Mongoose (Database)
*   JWT & BCrypt (Auth)

**Deployment:**
*   Frontend: Vercel
*   Backend: Render
*   Database: MongoDB Atlas

---

## ⚙️ Installation & Local Setup

### Prerequisites
*   Node.js (v14 or higher)
*   npm or yarn
*   MongoDB URI (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/vivek-419/ScopeView-MERN.git
cd ScopeView-MERN
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (optional, defaults to localhost):
```env
VITE_API_URL=http://localhost:4000
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `4000` |
| `MONGODB_URI` | Connection string for MongoDB | - |
| `JWT_SECRET` | Secret key for signing tokens | - |
| `CLIENT_URL` | URL of the frontend (for CORS) | `http://localhost:5173` |
| `VITE_API_URL` | Frontend: Backend API base URL | `http://localhost:4000` |

---

## 🚢 Deployment

### DB Quota Management
The project includes a cleanup script if you hit storage limits (512MB on free tier):
```bash
cd server
node scripts/clearTelemetry.js
```

### Build for Production
**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd server
npm start
```
