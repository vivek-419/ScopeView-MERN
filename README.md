# ScopeView ⚡

**Real-time Telemetry Dashboard for Engineering Teams**

ScopeView is a full-stack web application designed to ingest, visualize, and analyze high-frequency telemetry data streams (like CPU usage, sensor metrics, etc.) in real-time. It features a modern, responsive dashboard with live charts, historical playback, and role-based access control.

<img width="1470" height="956" alt="Screenshot 2025-12-17 at 4 55 20 PM" src="https://github.com/user-attachments/assets/1e7a699f-73cb-4c8b-bb7b-6779851ed31d" />
<img width="1470" height="956" alt="Screenshot 2025-12-17 at 4 57 02 PM" src="https://github.com/user-attachments/assets/5167dc57-f5d1-4404-abec-4cf6a24b7e74" />
<img width="1470" height="956" alt="Screenshot 2025-12-17 at 4 57 57 PM" src="https://github.com/user-attachments/assets/fa0f0455-d7de-43d4-85db-b5b17215eb1c" />


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

  API Endpoints Summary
Authentication

POST /api/auth/register — Create a new user account and set roles.
POST /api/auth/login — Authenticate and receive a secure JWT token.
Stream Configuration

GET /api/config/streams — Retrieve all active telemetry stream settings.
POST /api/config/streams — Add a new telemetry stream (Requires Admin/Engineer role).
PUT /api/config/streams/:id — Update stream properties like color or range.
DELETE /api/config/streams/:id — Remove a stream from the database.
Telemetry & Analytics

GET /api/telemetry — Fetch historical data points for the playback feature.
GET /api/telemetry/stats — Get high-level statistics (Min, Max, Avg) for any stream.
GET /api/sessions/:sessionId/streams — Find which data streams belong to a specific session.
Real-Time Data (WebSockets)

Event: 
subscribe
 — Connects the client to specific real-time data rooms.
Event: telemetry:update — Pushes live data packets to the UI at a 10Hz frequency.


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
Deployement link: https://scopeview.vercel.app/
Backend Deployement link (Render): https://scopeview-mern.onrender.com

**Backend:**
```bash
cd server
npm start
```
