import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import HistoricalPlayback from './pages/HistoricalPlayback'
import StreamConfiguration from './pages/StreamConfiguration'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Sidebar from './components/Sidebar'
import './App.css'

import Home from './pages/Home'

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Sidebar */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <Sidebar />
              <main className="app-content">
                <Dashboard />
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/historical"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <Sidebar />
              <main className="app-content">
                <HistoricalPlayback />
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/streams"
        element={
          <ProtectedRoute requiredRole="engineer">
            <div className="app-layout">
              <Sidebar />
              <main className="app-content">
                <StreamConfiguration />
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <div className="app-layout">
              <Sidebar />
              <main className="app-content">
                <Settings />
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  )
}

export default App
