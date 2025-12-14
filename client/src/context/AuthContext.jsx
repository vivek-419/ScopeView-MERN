import { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    }, [])

    // Login function
    const login = useCallback(async (email, password) => {
        try {
            const response = await authAPI.login(email, password)
            const { token: authToken, user: userData } = response

            // Store in state
            setToken(authToken)
            setUser(userData)

            // Persist to localStorage
            localStorage.setItem('token', authToken)
            localStorage.setItem('user', JSON.stringify(userData))

            return { success: true }
        } catch (error) {
            console.error('Login failed:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            }
        }
    }, [])

    // Register function
    const register = useCallback(async (email, password, role = 'viewer') => {
        try {
            await authAPI.register(email, password, role)

            // Auto-login after registration
            return await login(email, password)
        } catch (error) {
            console.error('Registration failed:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            }
        }
    }, [login])

    // Logout function
    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }, [navigate])

    // Check if user has specific role
    const hasRole = useCallback((role) => {
        return user?.role === role
    }, [user])

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        hasRole,
        isAdmin: user?.role === 'admin',
        isEngineer: user?.role === 'engineer',
        isViewer: user?.role === 'viewer'
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
