import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (email, password, role = 'viewer') => {
    const response = await api.post('/auth/register', { email, password, role })
    return response.data
  }
}

// Streams API
export const streamsAPI = {
  getAll: async () => {
    const response = await api.get('/streams')
    return response.data
  },

  create: async (streamData) => {
    const response = await api.post('/streams', streamData)
    return response.data
  },

  update: async (id, streamData) => {
    const response = await api.put(`/streams/${id}`, streamData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/streams/${id}`)
    return response.data
  }
}

// Telemetry API
export const telemetryAPI = {
  getData: async (params) => {
    const response = await api.get('/telemetry', { params })
    return response.data
  },

  getStats: async (params) => {
    const response = await api.get('/telemetry/stats', { params })
    return response.data
  },

  getStreamsBySession: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}/streams`)
    return response.data
  }
}

// Config API
export const configAPI = {
  getAllStreams: async () => {
    const response = await api.get('/config/streams')
    return response.data
  },

  getStreamById: async (id) => {
    const response = await api.get(`/config/streams/${id}`)
    return response.data
  },

  createStream: async (streamData) => {
    const response = await api.post('/config/streams', streamData)
    return response.data
  },

  updateStream: async (id, streamData) => {
    const response = await api.put(`/config/streams/${id}`, streamData)
    return response.data
  },

  deleteStream: async (id) => {
    const response = await api.delete(`/config/streams/${id}`)
    return response.data
  }
}

export default api
