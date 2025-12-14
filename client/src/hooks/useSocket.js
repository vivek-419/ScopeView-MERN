import { useState, useEffect, useCallback } from 'react'
import socketService from '../services/socket'

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.connect()

    const handleConnect = () => {
      console.log('✅ WebSocket connected')
      setIsConnected(true)
      setError(null)
    }

    const handleDisconnect = () => {
      console.log('❌ WebSocket disconnected')
      setIsConnected(false)
    }

    const handleError = (err) => {
      console.error('❗ WebSocket error:', err)
      setError(err.message || 'Connection error')
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('connect_error', handleError)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('connect_error', handleError)
    }
  }, [])

  // Subscribe to telemetry streams
  const subscribe = useCallback(async (sessionId, streamKeys) => {
    try {
      await socketService.subscribe(sessionId, streamKeys)
      return { success: true }
    } catch (err) {
      setError(err)
      return { success: false, error: err }
    }
  }, [])

  // Listen for telemetry updates
  const onTelemetry = useCallback((callback) => {
    socketService.onTelemetryUpdate((data) => {
      setLastUpdate(Date.now())
      callback(data)
    })
  }, [])

  // Listen for initial telemetry data
  const onInitialData = useCallback((callback) => {
    socketService.onTelemetryInitial(callback)
  }, [])

  // Cleanup listener
  const off = useCallback((event, callback) => {
    socketService.off(event, callback)
  }, [])

  return {
    isConnected,
    error,
    lastUpdate,
    subscribe,
    onTelemetry,
    onInitialData,
    off
  }
}

export default useSocket
