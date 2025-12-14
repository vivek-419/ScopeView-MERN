import io from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect(url = import.meta.env.VITE_API_URL || 'http://localhost:4000') {
    if (this.socket) {
      return this.socket
    }

    this.socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id)
      this.isConnected = true
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.isConnected = false
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  subscribe(sessionId, streamKeys = []) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    return new Promise((resolve, reject) => {
      this.socket.emit('subscribe', { sessionId, streamKeys }, (response) => {
        if (response?.success) {
          console.log('📡 Subscribed to session:', sessionId)
          resolve(response)
        } else {
          reject(response?.error || 'Subscription failed')
        }
      })
    })
  }

  onTelemetryUpdate(callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.on('telemetry:update', callback)
  }

  onTelemetryInitial(callback) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.on('telemetry:initial', callback)
  }

  sendTelemetry(data) {
    if (!this.socket) {
      console.error('Socket not connected')
      return
    }

    this.socket.emit('telemetry:data', data)
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  getConnectionStatus() {
    return this.isConnected
  }
}

// Export singleton instance
const socketService = new SocketService()
export default socketService
